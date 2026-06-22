import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { PostsService } from '../posts/posts.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return this.usersService.toPublic(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  async updateMe(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    const updated = await this.usersService.updateProfile(user.id, dto);
    return this.usersService.toPublic(updated!);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me/posts')
  getMyPosts(@CurrentUser() user: User) {
    return this.postsService.findByAuthor(user.id);
  }
}
