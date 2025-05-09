import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './schema/post.schema';
import { MongoLoggerService } from './mongodb/mongo-logger.service';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'Post',schema:PostSchema}])
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
