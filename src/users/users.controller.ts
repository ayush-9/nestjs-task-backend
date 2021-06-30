import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthUserDto } from './authuser.dto';
import { User } from './user.interface';
import { UsersService } from './users.service';
import * as Joi from 'joi';
import { JoiValidationPipe } from 'src/items/joi-validation-pipe.pipe';

const joischemaforuser = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/),
    )
    .required(),
});

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  @UsePipes(new JoiValidationPipe(joischemaforuser))
  signUp(@Body() authUserDto: AuthUserDto): Promise<User> {
    return this.usersService.signup(authUserDto);
  }

  @Post('/signin')
  @UsePipes(new JoiValidationPipe(joischemaforuser))
  signIn(@Body() authUserDto: AuthUserDto): Promise<{ accessToken: string }> {
    return this.usersService.signin(authUserDto);
  }
}
