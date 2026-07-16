import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CheckVoucherDto } from './dto/check-voucher.dto';
import { GenerateVoucherDto } from './dto/generate-voucher.dto';

@Controller()
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get('aircrafts')
  @HttpCode(HttpStatus.OK)
  getAircraftTypes() {
    return this.vouchersService.getAircraftTypes()
  }
  
  @Post('check')
  @HttpCode(HttpStatus.OK)
  check(@Body() CheckVoucherDto: CheckVoucherDto) {
    return this.vouchersService.checkVoucher(CheckVoucherDto);
  }

  @Post('generate')
  generate(@Body() generateVoucherDto: GenerateVoucherDto) {
    return this.vouchersService.generateVoucher(generateVoucherDto);
  }
}
