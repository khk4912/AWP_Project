import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  // 1. 게시글 생성
  async create(postData: any) {
    const newPost = new this.postModel(postData);
    return newPost.save();
  }

  // 2. 전체 게시글 조회 (최신순 정렬)
  async findAll() {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }
}