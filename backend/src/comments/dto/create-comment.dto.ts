import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: '6651d7a2b2f0e0f4f7fa8f21' })
  @IsMongoId()
  postId!: string;

  @ApiProperty({ example: '좋은 글입니다.' })
  @IsString()
  @MinLength(1)
  content!: string;
}
