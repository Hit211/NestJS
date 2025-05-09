import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Post{

    @Prop({required:true})
    title: string;

    @Prop({reuqired:true})
    content:string

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User',required:true})
    authorName:mongoose.Types.ObjectId;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post)
