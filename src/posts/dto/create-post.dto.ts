import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";

export class CreateDTO{
   
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(50)
    title:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(50)
    content:string;


    @ApiProperty()
    @IsNotEmpty()
    authorName:Types.ObjectId;
}

