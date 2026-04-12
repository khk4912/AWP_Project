import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: '오늘은 팀 프로젝트 병합을 진행했다.' })
  @IsString()
  @MinLength(1)
  content!: string;

  @ApiProperty({ example: '', required: false, description: '이미지 URL 또는 업로드 후 반환된 경로' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
