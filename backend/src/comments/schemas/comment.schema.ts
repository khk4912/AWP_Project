import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Post } from '../../posts/schemas/post.schema';
import { User } from '../../users/schemas/user.schema';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  post!: Post;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author!: User;

  @Prop({ required: true })
  content!: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
