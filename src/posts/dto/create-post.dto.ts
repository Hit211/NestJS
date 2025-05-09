import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

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
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    authorName:string;
}

