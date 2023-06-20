import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('signup/verify')
  verify(@Body() verifyAuthDto: VerifyAuthDto) {
    return this.authService.verify(verifyAuthDto);
  }

  @Post('login/password')
  passwordLogin(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.loginPassword(loginAuthDto);
  }

  @Post('login/sms')
  smsLogin(@Body() smsLoginAuthDto: CreateAuthDto) {
    return this.authService.loginSms(smsLoginAuthDto);
  }

  @Post('login/verify')
  loginVerify(@Body() verifyAuthDto: VerifyAuthDto) {
    return this.authService.loginVerify(verifyAuthDto);
  }
}
