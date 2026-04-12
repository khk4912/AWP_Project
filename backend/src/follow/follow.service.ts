import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async follow(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself.');
    }

    const me = await this.userModel.findById(userId).exec();
    const target = await this.userModel.findById(targetUserId).exec();

    if (!me || !target) {
      throw new NotFoundException('User not found.');
    }

    const alreadyFollowing = me.following.some((id) => id.toString() === targetUserId);
    if (!alreadyFollowing) {
      me.following.push(target._id as any);
      target.followers.push(me._id as any);
      await me.save();
      await target.save();
    }

    return { message: 'Followed successfully.' };
  }

  async unfollow(userId: string, targetUserId: string) {
    const me = await this.userModel.findById(userId).exec();
    const target = await this.userModel.findById(targetUserId).exec();

    if (!me || !target) {
      throw new NotFoundException('User not found.');
    }

    me.following = me.following.filter((id) => id.toString() !== targetUserId) as any;
    target.followers = target.followers.filter((id) => id.toString() !== userId) as any;

    await me.save();
    await target.save();

    return { message: 'Unfollowed successfully.' };
  }

  async getRelations(userId: string) {
    const user = await this.userModel.findById(userId).populate('followers', 'username email').populate('following', 'username email').exec();

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return {
      userId: user._id.toString(),
      followers: user.followers,
      following: user.following,
      followerCount: user.followers.length,
      followingCount: user.following.length,
    };
  }
}
