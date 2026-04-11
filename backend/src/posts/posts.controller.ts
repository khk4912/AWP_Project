import { Controller, Get, Post as HttpPost, Body } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts') // http://localhost:3000/posts 주소를 담당
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 게시글 작성 (POST)
  @HttpPost()
  async create(@Body() body: any) {
    return this.postsService.create(body);
  }

  // 게시글 전체 불러오기 (GET)
  @Get()
  async findAll() {
    return this.postsService.findAll();
  }
}