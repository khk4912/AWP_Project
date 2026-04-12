import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../common/decorators/user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: '댓글 생성' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  create(@User() user: JwtPayload, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto.postId, user.userId, dto.content);
  }

  @ApiOperation({ summary: '게시글별 댓글 조회' })
  @Get('post/:postId')
  getByPost(@Param('postId') postId: string) {
    return this.commentsService.getByPost(postId);
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @User() user: JwtPayload) {
    return this.commentsService.delete(id, user.userId);
  }
}
