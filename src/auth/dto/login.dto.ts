import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class loginDto {
    @ApiProperty()
    @IsEmail({},{message:"Please provide valid email"})
    @IsNotEmpty({message:"field cannot be empty"})
    email:string;

    @ApiProperty()
    @IsNotEmpty({message:"field cannot be empty"})
    password:string;

}