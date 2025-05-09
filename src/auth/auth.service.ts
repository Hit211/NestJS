import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schema/user.schema';
import { registerDto } from './dto/register.dto';
import * as bcrypt from "bcrypt"
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private readonly userModel:Model<UserDocument>,private jwtService:JwtService){}

    async createUser(user:registerDto){
        const existingUser = await this.userModel.findOne({email:user.email});

        if(existingUser){
          throw new ConflictException("email already in use")
        }
        
        const hashedPassword = await this.hashedPassword(user.password);

        const newuser = this.userModel.create({
            email:user.email,
            password:hashedPassword,
            name:user.name,
            role:UserRole.USER
        })
           
        const savedUser = (await newuser).toObject();
        const {password,...safeUser} = savedUser
        
        return {
            user:safeUser,
            message:"Registration successfully"
        }
    }

    
    async createAdmin(user:registerDto){
        const existingAdmin = await this.userModel.findOne({email:user.email})
        if(existingAdmin){
            throw new ConflictException("Admin is already exists")
        }
        
        const hashedPassword = await this.hashedPassword(user.password);

        const newAdmin = await this.userModel.create({
            email:user.email,
            name:user.name,
            password:hashedPassword,
            role:UserRole.ADMIN
        })

        const savedAdmin = await newAdmin.toObject();
        const {password,...safeAdmin} = savedAdmin;
        return {
            admin:safeAdmin,
            message:"Admin Created"
        }
    }

    async login(user:loginDto){
        const existingUser = await this.userModel.findOne({email:user.email}).lean();

        if(!existingUser){
            throw new ConflictException("Email is invalid")
        }

        const isMatchPassword = await this.verifyPassword(user.password,existingUser.password);
        if(!isMatchPassword){
            throw new ConflictException("Password is invalid")
        }

        const tokens = await this.generateToken(existingUser);
        const {password,...result} = existingUser;

        return {
            user:result,
            ...tokens
        }
    }


    async refreshToken(refreshtoken:string){
        try {
            const payload = this.jwtService.verify(refreshtoken,{
                secret:process.env.SECRET_REFRESH_TOKEN
            })
    
            const user = await this.userModel.findOne({
                id:payload.sub
            })

            if(!user){
                throw new UnauthorizedException('Invalid Token')
            }

            const accessToken = this.generateAccessToken(user)
            return accessToken;
        } catch (error) {
            throw new UnauthorizedException('Invalid Token')
        }
    }
    
    
    private async hashedPassword(password:string): Promise<string>{
        return bcrypt.hash(password,10);
    }

    private async verifyPassword(password:string,userPassword:string):Promise<Boolean>{
        return bcrypt.compare(password,userPassword);
    }

    private async generateToken(existingUser:UserDocument){
        return{
            accesstoken :this.generateAccessToken(existingUser),
            refreshtoken : this.generaterefreshToken(existingUser)
        }
    }

    private generateAccessToken(user:UserDocument):string{
        const payload = {
            email:user.email,
            sub:user.id,
            role:user.role
        }

        return this.jwtService.sign(payload,{secret:process.env.SECRET_ACCESS_TOKEN,expiresIn:"15m"})
    }

    private generaterefreshToken(user:UserDocument):string{
        const payload = {
            sub:user.id
        }
        return this.jwtService.sign(payload,{secret:process.env.SECRET_REFRESH_TOKEN,expiresIn:"7d"})
    }
}
