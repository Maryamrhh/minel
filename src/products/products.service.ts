import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {    
    const newProduct = await this.productRepository.create(createProductDto);
    return await  this.productRepository.save(newProduct);
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: string) {
    return this.productRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.update({ id: id }, updateProductDto);
  }

  remove(id: string) {
    return this.productRepository.delete({ id: id });
  }
}
