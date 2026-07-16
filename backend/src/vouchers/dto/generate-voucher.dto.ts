import { IsString, IsNotEmpty, IsIn, Matches, IsDateString } from 'class-validator';
import { aircraftTypes } from '../../utils/mock/aircraftData';

const allowedAircrafts = aircraftTypes.map(item => item.type);

export class GenerateVoucherDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\s\.\-\']+$/, { 
    message: 'Name can only contain letters, spaces, dots, hyphens, and apostrophes.' 
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9\-]+$/, { 
    message: 'ID can only contain uppercase letters, numbers, and hyphens (e.g., CRW-007).' 
  })
  id: string;

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

  @IsString()
  @IsNotEmpty()

  @IsIn(allowedAircrafts, {
    message: `Aircraft must be one of these: ${allowedAircrafts.join(', ')}`
  })
  aircraft: string;
}