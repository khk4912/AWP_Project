import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<PostDocument>) {}

  async create(postData: { author: string; content: string; imageUrl?: string }) {
    const newPost = new this.postModel({
      author: postData.author,
      content: postData.content,
      imageUrl: postData.imageUrl ?? '',
    });
    const saved = await newPost.save();
    return {
      message: 'Post created successfully.',
      postId: saved._id.toString(),
    };
  }

  async findAll() {
    return this.postModel.find().populate('author', 'username email profileImage').sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id).populate('author', 'username email profileImage').populate('likedBy', 'username email').exec();
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    return post;
  }

  async update(id: string, userId: string, data: { content?: string; imageUrl?: string }) {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    if (post.author.toString() != userId) {
      throw new ForbiddenException('You can only update your own post.');
    }
    if (data.content !== undefined) post.content = data.content;
    if (data.imageUrl !== undefined) post.imageUrl = data.imageUrl;
    await post.save();
    return { message: 'Post updated successfully.' };
  }

  async delete(id: string, userId: string) {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    if (post.author.toString() != userId) {
      throw new ForbiddenException('You can only delete your own post.');
    }
    await this.postModel.findByIdAndDelete(id).exec();
    return { message: 'Post deleted successfully.' };
  }

  async like(id: string, userId: string) {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found.');

    const alreadyLiked = post.likedBy.some((likedUserId) => likedUserId.toString() === userId);
    if (!alreadyLiked) {
      post.likedBy.push(userId as unknown as UserDocument);
      await post.save();
    }
    return { message: 'Post liked successfully.' };
  }

  async unlike(id: string, userId: string) {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found.');

    post.likedBy = post.likedBy.filter((likedUserId) => likedUserId.toString() !== userId) as any;
    await post.save();
    return { message: 'Post unliked successfully.' };
  }

  async uploadImage(file: Express.Multer.File) {
    return {
      message: 'Image uploaded successfully.',
      imageUrl: `/uploads/${file.originalname}`,
    };
  }
}
