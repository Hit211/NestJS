import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoLoggerService } from './posts/mongodb/mongo-logger.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGO_URI', { infer: true });

        console.log('MONGO_URI from ConfigService:', mongoUri); 
        if (!mongoUri) {
          console.error('❌ MONGO_URI is undefined or missing in the environment variables!');
        }

        return {
          uri: mongoUri || '',
        };
      },
    }),
    PostsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, MongoLoggerService],
})
export class AppModule {}
