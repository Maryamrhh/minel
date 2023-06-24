import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Auth } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import {JwtStrategy } from './strategy';
import { Admin } from 'src/admin/entities/admin.entity';
import { Cart } from 'src/checkout/entities/cart.entity';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([Auth, User, Admin, Cart])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
