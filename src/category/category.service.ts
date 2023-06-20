import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>) {}
  
  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(category: string) {
    return await this.productRepository.find({where: {
      category: category
    }});
  }
}
