import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateDTO{
    @ApiProperty()
    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    title?:string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    content?:string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    authorname?:string;
}