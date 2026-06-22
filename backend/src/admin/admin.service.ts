import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly usersService: UsersService,
  ) {}

  getDashboard() {
    return Promise.all([
      this.usersRepository.count(),
      this.postsRepository.count(),
      this.commentsRepository.count(),
    ]).then(([userCount, postCount, commentCount]) => ({
      userCount,
      postCount,
      commentCount,
    }));
  }

  getUsers() {
    return this.usersService.findAll();
  }

  updateUserRole(userId: number, role: Role) {
    return this.usersService.updateRole(userId, role);
  }

  removeUser(userId: number) {
    return this.usersService.remove(userId);
  }

  getPosts() {
    return this.postsRepository.find({
      relations: { author: true },
      order: { id: 'DESC' },
    });
  }

  removePost(postId: number) {
    return this.postsRepository.delete(postId);
  }
}
