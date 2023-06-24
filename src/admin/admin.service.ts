import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ProductsService } from 'src/products/products.service';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { LoginAuthDto } from 'src/auth/dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminReposetory: Repository<Admin>,
    private config: ConfigService,
    private jwt: JwtService,
    ){}
  create(createProductDto: CreateProductDto) {
  }


  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }

  async adminLogin(loginAuthDto: LoginAuthDto) {
    const admin = await this.adminReposetory.findOne({
      where: {
        phoneNumber: loginAuthDto.phoneNumber,
      },
    });
    const isMatch = await bcrypt.compare(loginAuthDto.password, admin.password);
    if (isMatch == true) {
      return this.signToken(admin.id, admin.phoneNumber);
    }
    return `wrong password or phone number!`;
  }

  async signToken(
    userId: string,
    phoneNumber: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      phoneNumber,
    };
    const secret = this.config.get('JWT_ADMIN_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return {
      accessToken: token,
    };
  }

  async showOrders() {

  }
}
