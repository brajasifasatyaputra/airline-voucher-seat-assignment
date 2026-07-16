import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Voucher } from './entities/voucher.entity';
import { CheckVoucherDto } from './dto/check-voucher.dto';
import { GenerateVoucherDto } from './dto/generate-voucher.dto';
import { generateRandomSeats } from '../utils/seat-generator.util';
import { aircraftTypes } from 'src/utils/mock/aircraftData';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
    private dataSource: DataSource // Inject DataSource buat Transaction
  ) {}

  // GET /api/aircrafts
  async getAircraftTypes() {
    const aircraftList = aircraftTypes?.map((aircraft) => {
      return {
        type: aircraft.type
      }
    })
    return {
      success: true,
      aircrafts: aircraftList
    };
  }

  // POST /api/check
  async checkVoucher(checkVoucherDto: CheckVoucherDto) {
    const { flightNumber, date } = checkVoucherDto;
    
    // Explicit Parameterized Query (SQL Injection Prevention)
    const count = await this.voucherRepository.createQueryBuilder('voucher')
      .where('voucher.flight_number = :flight', { flight: flightNumber })
      .andWhere('voucher.flight_date = :fdate', { fdate: date })
      .getCount();

    return { 
      success: true,
      exists : count > 0 
    };
  }

  // POST /api/generate
  async generateVoucher(generateVoucherDto: GenerateVoucherDto) {
    // WRAP in TRANSACTION
    return await this.dataSource.transaction(async (transactionalEntityManager) => {
      
      // 1. Data Check (Di dalam ruang isolasi transaksi)
      const count = await transactionalEntityManager.createQueryBuilder(Voucher, 'voucher')
        .where('voucher.flight_number = :flight', { flight: generateVoucherDto.flightNumber })
        .andWhere('voucher.flight_date = :fdate', { fdate: generateVoucherDto.date })
        .getCount();

      if (count > 0) {
        throw new ConflictException(`Vouchers have already been generated for flight number ${generateVoucherDto.flightNumber} on ${generateVoucherDto.date}.`);
      }

      // 2. Seats Generate
      const seats = generateRandomSeats(generateVoucherDto.aircraft);

      const newVoucher = transactionalEntityManager.create(Voucher, {
        crew_name: generateVoucherDto.name,
        crew_id: generateVoucherDto.id,
        flight_number: generateVoucherDto.flightNumber,
        flight_date: generateVoucherDto.date,
        aircraft_type: generateVoucherDto.aircraft,
        seat1: seats[0],
        seat2: seats[1],
        seat3: seats[2],
      });

      try {
        await transactionalEntityManager.save(newVoucher);
      } catch (error) {
        if (typeof error === 'object' && error !== null) {
          const dbError = error as { code?: string; message?: string };
          
          if (dbError.code === 'SQLITE_CONSTRAINT_UNIQUE' || (dbError.message && dbError.message.includes('UNIQUE constraint failed'))) {
            throw new ConflictException('Race condition detected: Vouchers have already been generated for this flight and date.');
          }
        }
        throw new InternalServerErrorException('An error occurred while saving the voucher.');
      }

      return {
        success: true,
        seats,
      }
    });
  }
}
