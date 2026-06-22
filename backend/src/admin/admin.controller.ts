import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from '../common/enums/role.enum';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id/role')
  updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.adminService.updateUserRole(id, dto.role);
  }

  @Delete('users/:id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.removeUser(id);
  }

  @Get('posts')
  getPosts() {
    return this.adminService.getPosts();
  }

  @Delete('posts/:id')
  removePost(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.removePost(id);
  }
}
