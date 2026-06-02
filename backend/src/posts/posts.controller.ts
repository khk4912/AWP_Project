import * as fs from 'fs';
import * as path from 'path';
import { Body, Controller, Delete, Get, Param, Patch, Post as HttpPost, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from '../common/decorators/user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '이미지 업로드' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @HttpPost('upload')
  @UseInterceptors(FilesInterceptor('files', 5, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const dir = path.join(process.cwd(), 'uploads', 'posts');
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        cb(null, `${unique}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('이미지 파일만 업로드할 수 있습니다.'), false);
      }
    },
  }))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = files.map((f) => `/api/uploads/posts/${f.filename}`);
    return { urls };
  }

  @ApiOperation({ summary: '게시글 작성' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @HttpPost()
  async create(@User() user: JwtPayload, @Body() dto: CreatePostDto) {
    return this.postsService.create({
      author: user.userId,
      content: dto.content,
      imageUrls: dto.imageUrls,
    });
  }

  @ApiOperation({ summary: '게시글 전체 조회' })
  @Get()
  async findAll(@Query('skip') skip: string = '0', @Query('limit') limit: string = '10') {
    return this.postsService.findAll(parseInt(skip), parseInt(limit));
  }

  @ApiOperation({ summary: '피드 (팔로우한 사람의 글)' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('feed')
  async getFeed(@User() user: JwtPayload, @Query('skip') skip: string = '0', @Query('limit') limit: string = '10') {
    return this.postsService.getFeed(user.userId, parseInt(skip), parseInt(limit));
  }

  @ApiOperation({ summary: '단일 게시글 조회' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @ApiOperation({ summary: '게시글 수정' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @User() user: JwtPayload, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, user.userId, dto);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: JwtPayload) {
    return this.postsService.delete(id, user.userId);
  }

  @ApiOperation({ summary: '좋아요' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @HttpPost(':id/like')
  async like(@Param('id') id: string, @User() user: JwtPayload) {
    return this.postsService.like(id, user.userId);
  }

  @ApiOperation({ summary: '좋아요 취소' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @HttpPost(':id/unlike')
  async unlike(@Param('id') id: string, @User() user: JwtPayload) {
    return this.postsService.unlike(id, user.userId);
  }
}
