import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async register(username: string, email: string, password: string) {
    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      throw new ConflictException('Email is already in use.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      username,
      email,
      password: hashedPassword,
      role: 'user',
    });

    return {
      message: 'User registered successfully.',
      userId: user._id.toString(),
    };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).select('+password').exec();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const secret = process.env.ACCESS_SECRET;
    if (!secret) {
      throw new UnauthorizedException('ACCESS_SECRET is not configured.');
    }

    const accessToken = jwt.sign(
      { userId: user._id.toString(), role: user.role ?? 'user' },
      secret,
      { expiresIn: '1h' },
    );

    return { accessToken };
  }
}
