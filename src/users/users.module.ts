import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    //this JwtModule exports JwtService(used in users.service.ts) which perform operations like signing the token.
    JwtModule.register({
      secret: 'Secretkeyvalue',
      signOptions: {
        expiresIn: 7200, //2 hours
      },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }], 'users'),
  ],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
  exports: [JwtStrategy, PassportModule],
})
export class UsersModule {}
