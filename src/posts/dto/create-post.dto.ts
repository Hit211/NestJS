import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";

export class CreateDTO{
   
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(50)
    title:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(50)
    content:string;


    @IsNotEmpty()
    authorName:Types.ObjectId;
}

