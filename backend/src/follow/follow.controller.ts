import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../common/decorators/user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { FollowDto } from './dto/follow.dto';
import { FollowService } from './follow.service';

@ApiTags('Follow')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiOperation({ summary: '팔로우' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  follow(@User() user: JwtPayload, @Body() dto: FollowDto) {
    return this.followService.follow(user.userId, dto.targetUserId);
  }

  @ApiOperation({ summary: '언팔로우' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('unfollow')
  unfollow(@User() user: JwtPayload, @Body() dto: FollowDto) {
    return this.followService.unfollow(user.userId, dto.targetUserId);
  }

  @ApiOperation({ summary: '팔로워/팔로잉 조회' })
  @Get(':userId')
  getRelations(@Param('userId') userId: string) {
    return this.followService.getRelations(userId);
  }
}
