import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
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
}
