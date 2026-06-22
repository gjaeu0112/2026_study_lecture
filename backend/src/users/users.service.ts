import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Role } from '../common/enums/role.enum';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const email = this.configService.get<string>('ADMIN_EMAIL');
    const password = this.configService.get<string>('ADMIN_PASSWORD');
    const name = this.configService.get<string>('ADMIN_NAME', '관리자');

    if (!email || !password) {
      return;
    }

    const exists = await this.findByEmail(email);
    if (exists) {
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersRepository.save({
      email,
      password: hashedPassword,
      name,
      role: Role.ADMIN,
    });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  findAll() {
    return this.usersRepository.find({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      order: { id: 'DESC' },
    });
  }

  async create(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      role: Role.USER,
    });
    return this.usersRepository.save(user);
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }

    if (dto.name) {
      user.name = dto.name;
    }

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    return this.usersRepository.save(user);
  }

  async updateRole(userId: number, role: Role) {
    await this.usersRepository.update(userId, { role });
    return this.findById(userId);
  }

  async remove(userId: number) {
    await this.usersRepository.delete(userId);
  }

  toPublic(user: User) {
    const { password: _password, ...publicUser } = user;
    return publicUser;
  }
}
