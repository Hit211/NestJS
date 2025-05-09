import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateDTO{
    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    title?:string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    content?:string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    authorname?:string;
}