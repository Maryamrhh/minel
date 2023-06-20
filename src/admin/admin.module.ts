import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdminStrategy } from './strategy';

@Module({
  imports:[JwtModule.register({}), TypeOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [AdminService, JwtAdminStrategy]
})
export class AdminModule {}
