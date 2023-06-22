import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { ConfigService } from '@nestjs/config';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly config: ConfigService,
    private jwt: JwtService,
  ) {}
  async register(createAuthDto: CreateAuthDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        phoneNumber: createAuthDto.phoneNumber,
      },
    });
    if (existUser) {      
      return 'You have already signed up!';
    }
    const tokenNumber = await Math.floor(
      Math.random() * (9999 - 1000 + 1) + 1000,
    );
    const userToken = await this.authRepository.findOne({
      where: {
        phoneNumber: createAuthDto.phoneNumber,
      },
    });
    if (await userToken) {
      this.authRepository.update(
        { phoneNumber: createAuthDto.phoneNumber },
        {
          tokenNumber: tokenNumber,
        },
      );
    } else {
      this.authRepository.save({
        ...createAuthDto,
        tokenNumber: tokenNumber,
      });
    }
    return this.sendSms(createAuthDto.phoneNumber, tokenNumber);
  }

  async verify(verifyAuthDto: VerifyAuthDto) {
    const situation = this.authRepository.findOne({
      where: {
        phoneNumber: verifyAuthDto.phoneNumber,
        tokenNumber: verifyAuthDto.tokenNumber,
      },
    });
    if (await situation) {
      const newUser = this.userRepository.create({
        phoneNumber: verifyAuthDto.phoneNumber,
      });
      const user = await this.userRepository.save(newUser);
      return this.signToken(user.id, user.phoneNumber);
    }
    return 'wrong token!';
  }

  async loginPassword(loginAuthDto: LoginAuthDto) {
    const user = await this.userRepository.findOne({
      where: {
        phoneNumber: loginAuthDto.phoneNumber,
      },
    });
    if (user.password == null) {
      return 'you do not set password!';
    }
    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);
    if (isMatch == true) {
      return this.signToken(user.id, user.phoneNumber);
    }
    return `wrong password or phone number!`;
  }

  async loginSms(smsloginAuthDto: CreateAuthDto) {
    const existUser = await this.userRepository.find({
      where: {
        phoneNumber: smsloginAuthDto.phoneNumber,
      },
    });
    if (await existUser) {
      const tokenNumber = await Math.floor(
        Math.random() * (9999 - 1000 + 1) + 1000,
      );
      this.authRepository.update(
        { phoneNumber: smsloginAuthDto.phoneNumber },
        {
          tokenNumber: tokenNumber,
        },
      );
      return this.sendSms(smsloginAuthDto.phoneNumber, tokenNumber);
    }
    return 'You have not sign up yet!';
  }

  async loginVerify(verifyAuthDto: VerifyAuthDto) {
    const situation = this.authRepository.findOne({
      where: {
        phoneNumber: verifyAuthDto.phoneNumber,
        tokenNumber: verifyAuthDto.tokenNumber,
      },
    });
    if (await situation) {      
      const thisUser = await this.userRepository.findOne({
        where: {
          phoneNumber: verifyAuthDto.phoneNumber,
        },
      });
      console.log(thisUser);
      
      return await this.signToken(await(thisUser.id), thisUser.phoneNumber);
    }
    return 'wrong token or phone number!';
  }
  async signToken(
    userId: string,
    phoneNumber: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      phoneNumber,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return {
      accessToken: token,
    };
  }

  async sendSms(phoneNumber: string, token: number) {
    const Kavenegar = await require('kavenegar');
    const api = await Kavenegar.KavenegarApi({
      apikey: this.config.get('KAVENEGAR_APIKEY'),
    });
    api.VerifyLookup(
      {
        receptor: phoneNumber,
        token: token,
        template: 'registerverify-test',
      },
      function (response, status) {
        console.log(response);
        console.log(status);
      },
    );
  }
}
