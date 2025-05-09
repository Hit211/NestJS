import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class registerDto {
    @IsEmail({},{message:"Please provide valid email"})
    @IsNotEmpty()
    email:string;

    @IsNotEmpty({message:"Field cannot be empty"})
    @IsString({message:"Name must be a string"})
    @MinLength(3,{message:"Name must be at least 3 characters long"})
    @MaxLength(50,{message:"Limit is 50 Charcters"})
    name:string;
 
    @IsNotEmpty({message:"Field cannot be empty"})
    @MinLength(6)
    password:string;

}