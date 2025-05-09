import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Post{

    @Prop({required:true})
    title: string;

    @Prop({reuqired:true})
    content:string

    @Prop({required:true})
    authorName:string
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post)
