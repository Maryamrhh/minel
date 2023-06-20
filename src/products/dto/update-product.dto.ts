import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsString()
  title: string;
  
  @IsNumber()
  price: number;

  @IsNumber()
  number: number;

  @IsString()
  description: string;

  @IsString()
  category: string;
}
