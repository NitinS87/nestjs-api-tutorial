import { Controller, Get, Patch, UseGuards, Body } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorators/index';
import { JwtGuard } from '../auth/guards/index';
import { UserService } from './user.service';
import { EditUserDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    // console.log(req.user);
    return user;
  }

  @Patch('me')
  updateMe(@GetUser('id') id: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(id, dto);
  }
}
