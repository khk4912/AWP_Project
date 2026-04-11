import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 1. 환경변수 설정 (전역에서 사용 가능하게)
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // 2. MongoDB 로컬 서버에 연결 ('sns-database'라는 이름의 DB를 자동 생성/사용)
    MongooseModule.forRoot('mongodb://localhost:27017/sns-database'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}