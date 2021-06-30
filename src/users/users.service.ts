import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.interface';
import { AuthUserDto } from './authuser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async findOne(username: string): Promise<User> {
    return await this.userModel.findOne({ username });
  }

  async signup(user: User): Promise<User> {
    const userexist = await this.findOne(user.username);
    const salt = await bcrypt.genSalt();

    if (userexist) {
      throw new ConflictException(`Username ${user.username} already exists`);
    }
    const newUser = new this.userModel(user);
    newUser.salt = salt;
    newUser.password = await bcrypt.hash(newUser.password, salt);
    return await newUser.save();
  }

  async signin(authUserDto: AuthUserDto): Promise<{ accessToken: string }> {
    const { username, password } = authUserDto;
    const user = await this.findOne(username);

    const hashpassword = await bcrypt.hash(password, user.salt);
    if (user && hashpassword === user.password) {
      const payload = { username: user.username };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid Credentials!!');
    }
  }
}
