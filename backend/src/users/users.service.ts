import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(dto: { username: string; email: string; password: string; bio?: string }) {
    const existing = await this.userModel.findOne({ email: dto.email }).exec();
    if (existing) {
      throw new ConflictException('Email is already in use.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      bio: dto.bio ?? '',
    });

    return {
      message: 'User created successfully.',
      userId: user._id.toString(),
    };
  }

  async findAllUsers() {
    return this.userModel.find().select('-password').sort({ createdAt: -1 }).exec();
  }

  async findUserById(userId: string) {
    const user = await this.userModel.findById(userId).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }
}
