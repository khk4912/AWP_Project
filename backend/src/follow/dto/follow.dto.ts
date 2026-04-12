import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class FollowDto {
  @ApiProperty({ example: '6651d7a2b2f0e0f4f7fa8f21' })
  @IsMongoId()
  targetUserId!: string;
}
