import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author!: User;

  @Prop({ required: true })
  content!: string;

  @Prop({ type: [String], default: [] })
  imageUrls!: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
  likedBy!: User[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
