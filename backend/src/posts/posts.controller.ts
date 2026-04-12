import { Body, Controller, Delete, Get, Param, Patch, Post as HttpPost, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @ApiOperation({ summary: '게시글 작성' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @HttpPost()
  async create(@User() user: JwtPayload, @Body() dto: CreatePostDto) {
    return this.postsService.create({
      author: user.userId,
      content: dto.content,
      imageUrl: dto.imageUrl,
    });
  }

  @ApiOperation({ summary: '게시글 전체 조회' })
  @Get()
  async findAll() {
    return this.postsService.findAll();
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

  @ApiOperation({ summary: '이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  @HttpPost('upload/image')
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.postsService.uploadImage(file);
  }
}
