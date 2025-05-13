import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types,Document } from "mongoose";


export enum UserRole{
    USER = "user",
    ADMIN = 'admin'
}


@Schema({timestamps:true})
export class User{
    @Prop({unique:true,required:true})
    email:string;
    
    @Prop({required:true})
    password:string;
    
    @Prop({enum:UserRole , default:UserRole.USER})
    role:UserRole;
    
    @Prop({type:[{type:Types.ObjectId, ref:'Post'}]})
    posts:Types.ObjectId[];

    @Prop({default:false})
    isBlocked:boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);