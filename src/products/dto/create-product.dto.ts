import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {
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
