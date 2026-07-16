import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  crew_name: string;

  @Column()
  crew_id: string;

  @Column()
  flight_number: string;

  @Column()
  flight_date: string;

  @Column()
  aircraft_type: string;

  @Column()
  seat1: string;

  @Column()
  seat2: string;

  @Column()
  seat3: string;

  @CreateDateColumn()
  created_at: Date;
}