import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: '오늘은 팀 프로젝트 병합을 진행했다.' })
  @IsString()
  @MinLength(1)
  content!: string;

  @ApiProperty({ example: [], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}
