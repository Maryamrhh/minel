import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyAuthDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsNumber()
  tokenNumber: number;
}
