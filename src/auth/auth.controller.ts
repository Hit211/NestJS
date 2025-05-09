import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { Roles } from './decorators/roles.decorators';
import { UserRole } from './schema/user.schema';
import { JwtAuthCard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/role.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService) {}

    @Post('register')
    register(@Body() body:registerDto){
        return this.authService.createUser(body);
    }

    @Post('login')
    login(@Body() body:loginDto){
        return this.authService.login(body)
    }

    @Post('refresh')
    refreshToken(@Body('refreshToken') refreshToken:string ){
        return this.authService.refreshToken(refreshToken);
    }

    @UseGuards(JwtAuthCard)
    @Get('profile')
    getProfile(@CurrentUser() user:any){
      return user;
    }

    @Post('create-admin')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthCard,RolesGuard)
    createAdmin(@Body() body:registerDto){
        console.log('Received request to create admin with body:', body);
        return this.authService.createAdmin(body);
    }

    @Get('all')
    getAllUsers(){
        return this.authService.getAllUsers();
    }
    
    
}
