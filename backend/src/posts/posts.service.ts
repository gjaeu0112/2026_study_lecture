import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { User } from '../users/user.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  findAll(page = 1, limit = 10) {
    return this.postsRepository.find({
      relations: { author: true },
      order: { id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: { author: true, comments: { author: true } },
      order: {
        comments: {
          id: 'ASC',
        },
      },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return post;
  }

  create(dto: CreatePostDto, user: User) {
    const post = this.postsRepository.create({
      ...dto,
      authorId: user.id,
    });
    return this.postsRepository.save(post);
  }

  async update(id: number, dto: UpdatePostDto, user: User) {
    const post = await this.findOne(id);
    this.assertOwnerOrAdmin(post, user);
    Object.assign(post, dto);
    return this.postsRepository.save(post);
  }

  async remove(id: number, user: User) {
    const post = await this.findOne(id);
    this.assertOwnerOrAdmin(post, user);
    await this.postsRepository.delete(id);
  }

  findByAuthor(authorId: number) {
    return this.postsRepository.find({
      where: { authorId },
      order: { id: 'DESC' },
    });
  }

  private assertOwnerOrAdmin(post: Post, user: User) {
    if (user.role !== Role.ADMIN && post.authorId !== user.id) {
      throw new ForbiddenException('수정/삭제 권한이 없습니다.');
    }
  }
}
