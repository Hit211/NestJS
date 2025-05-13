import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private authService:AuthService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:process.env.SECRET_ACCESS_TOKEN as string
        })
    }

   async validate(payload: any) {
       try {       
        const userDoc = await this.authService.currentUserById(payload.sub);
        if(!userDoc || userDoc.isBlocked){
            throw new UnauthorizedException("User is blocked")
        }
        const user = userDoc.toObject;

        return {
           ...user,
            role:payload.role
        };
       } catch (error) {
        console.log("error found in validation",error.message);
        throw new UnauthorizedException("Invalid Token")
       }
   }
}