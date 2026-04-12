import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: '수정된 게시글 내용', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;

  @ApiProperty({ example: 'updated-image.png', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
