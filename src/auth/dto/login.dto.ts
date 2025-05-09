import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class loginDto {
    @IsEmail({},{message:"Please provide valid email"})
    @IsNotEmpty({message:"field cannot be empty"})
    email:string;

    @IsNotEmpty({message:"field cannot be empty"})
    password:string;

}