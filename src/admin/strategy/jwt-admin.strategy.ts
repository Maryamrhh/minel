import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwtt') {
  constructor(
    config: ConfigService,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_ADMIN_SECRET'),
    });
  }
  async validate(payload: { sub: string; phoneNumber: string }) {
    const user = await this.adminRepository.findOne({
      where: {
        id: payload.sub,
      },
    });
    return user;
  }
}
