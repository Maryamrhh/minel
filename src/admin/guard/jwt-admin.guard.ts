import { AuthGuard } from '@nestjs/passport';

export class JwtAdminGaurd extends AuthGuard('jwtt') {
  constructor() {
    super();
  }
}
