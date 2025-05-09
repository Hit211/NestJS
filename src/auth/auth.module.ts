import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategies';
import { RolesGuard } from './guards/role.guard';

@Module({
  imports:[

    
      MongooseModule.forFeature([{name:'User',schema:UserSchema}]),

      PassportModule.register({defaultStrategy:'jwt'}),

      JwtModule.register({})
    ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,RolesGuard],
  exports:[AuthService,RolesGuard]
})
export class AuthModule {}
