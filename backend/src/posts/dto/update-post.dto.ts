import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: '수정된 게시글 내용', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;

  @ApiProperty({ example: [], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}
