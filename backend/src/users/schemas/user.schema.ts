// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true, select: false }) // 보안상 기본 조회에서 비밀번호 숨김
  password!: string;

  @Prop({ default: '' })
  profileImage!: string;

  @Prop({ default: '' })
  bio!: string;

  // 내가 팔로우하는 사람들
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  following!: User[];

  // 나를 팔로우하는 사람들
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  followers!: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);