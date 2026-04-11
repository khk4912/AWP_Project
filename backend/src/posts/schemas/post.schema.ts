import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema'; // 유저 스키마를 불러옵니다

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  // 1. 문자열이 아니라, Users 컬렉션의 실제 ObjectId를 연결합니다. (MySQL의 Foreign Key 역할)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author!: User;

  @Prop({ required: true })
  content!: string;

  @Prop({ default: '' })
  imageUrl!: string;

  // 2. 명세서의 'likes' 테이블을 대체하는 배열입니다. 하트를 누른 유저들의 ID가 담깁니다.
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  likedBy!: User[];
}

export const PostSchema = SchemaFactory.createForClass(Post);