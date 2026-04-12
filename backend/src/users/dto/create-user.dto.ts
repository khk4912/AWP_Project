import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'samgg' })
  @IsString()
  @MinLength(2)
  username!: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: '안녕하세요!', required: false })
  @IsOptional()
  @IsString()
  bio?: string;
}
