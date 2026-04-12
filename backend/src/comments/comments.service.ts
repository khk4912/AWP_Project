import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsService } from '../posts/posts.service';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    private readonly postsService: PostsService,
  ) {}

  async create(postId: string, userId: string, content: string) {
    await this.postsService.findOne(postId);

    const comment = await this.commentModel.create({
      post: postId,
      author: userId,
      content,
    });

    return {
      message: 'Comment created successfully.',
      commentId: comment._id.toString(),
    };
  }

  async getByPost(postId: string) {
    return this.commentModel.find({ post: postId }).populate('author', 'username email profileImage').sort({ createdAt: -1 }).exec();
  }

  async delete(commentId: string, userId: string) {
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) throw new NotFoundException('Comment not found.');
    if (comment.author.toString() != userId) {
      throw new ForbiddenException('You can only delete your own comment.');
    }
    await this.commentModel.findByIdAndDelete(commentId).exec();
    return { message: 'Comment deleted successfully.' };
  }
}
