import { IsString, IsNotEmpty, Matches, IsDateString } from 'class-validator';

export class CheckVoucherDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9\-]+$/, { 
    message: 'Flight Number can only contain uppercase letters, numbers, and hyphens (e.g., GA-123).' 
  })
  flightNumber: string;

  @IsNotEmpty()
  @IsDateString({}, { 
    message: 'Date must be a valid date format (YYYY-MM-DD).' 
  })
  date: string;
}