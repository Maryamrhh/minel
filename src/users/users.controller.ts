import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/auth/decorator';
import { User } from './entities/user.entity';
import { JwtGaurd } from 'src/auth/guard';

@UseGuards(JwtGaurd)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return this.usersService.getMe(user);
  }


  @Patch('profile/edit')
  editProfile(@Body() updateUserDto: UpdateUserDto, @GetUser() user: User) {
    return this.usersService.editeProfile(updateUserDto, user);
  }

  @Delete(':id')
  removeFromCart(@Param('id') id: string, @GetUser() user: User) {
    return this.usersService.removeFromCart(id, user);
  }

  @Get(':id/:itemNumber')
  addToCart(@Param('id') id: string,@Param('itemNumber') itemNumber: string,  @GetUser() user: User) {
    return this.usersService.addToCart(id,+itemNumber, user);
  }
}
