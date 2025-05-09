import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';

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

    
}
