import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import config from './config/keys';

@Module({
  imports: [
    ItemsModule,
    MongooseModule.forRoot(config.mongoURIItems, {
      connectionName: 'items',
    }),
    MongooseModule.forRoot(config.mongoURIUsers, {
      connectionName: 'users',
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
