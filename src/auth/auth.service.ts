import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schema/user.schema';
import { registerDto } from './dto/register.dto';
import * as bcrypt from "bcrypt"
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { SocketGateway } from 'src/socket/socket.gateway';
// import { RSocketService } from './rsocket/rsocket.service';

@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private readonly userModel:Model<UserDocument>,private jwtService:JwtService,
    //  private readonly rsocketService: RSocketService
    private readonly socketGateway: SocketGateway
    ){}

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
        try {
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
        } catch (error) {
          console.log("error occured during create admin",error.message);
             
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

        if(existingUser.isBlocked){
            throw new UnauthorizedException("User is blocked")
        }
        const tokens = await this.generateToken(existingUser);
        const {password,...result} = existingUser;

        return {
            user:result,
            ...tokens
        }
    }


    async currentUserById(id:string){
        const user = await this.userModel.findOne({id:id})
        if(!user){
            throw new UnauthorizedException("user not found")
        }

        const {password,...result} = user;
        
        return result;
    }

    async getAllUsers(includedBlocked:boolean){
        if(includedBlocked) return await this.userModel.find();
        return await this.userModel.find({isBlocked:false});       
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

    async deleteUser(id:string){
        try {
            console.log("userId;",id);
            
           const user = await this.userModel.findByIdAndDelete(id);
           if (!user) {
            throw new Error('User not found');
          }
           console.log("user successfully deleted");
           
           return user;
        } catch (error) {
            console.log("Error in deleteion",error.message); 
            throw new Error("User deletion failed");          
        }
    }

    async blockUser(id:string,shouldBlock:boolean){
        try {
            const user = await this.userModel.findByIdAndUpdate(id,{isBlocked:shouldBlock},{new:true});
            if(!user){
                throw new Error("User Not Found")
            }


    //   if (shouldBlock) {
    //     this.rsocketService.broadcastUserBlocked('6822db90cfbb5dcde8f1b9c3');
    //   }

         if(shouldBlock){
            this.socketGateway.blockUser(id);
         } else{
            this.socketGateway.notifyUserUnbloked(id);
         }
           
            return {message:shouldBlock?'User Blocked': 'User unblocked',user}
        } catch (error) {
            console.log("error occur during blocking user",error);
            throw new Error("failed to block user")
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
