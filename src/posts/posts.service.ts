import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
    constructor(@InjectModel('Post') private readonly postModel:Model<Post>){}

    async findAll():Promise<Post[]>{
        return this.postModel.find().exec();
    }

    async findOne(id:string):Promise<Post>{
        const post =  await this.postModel.findById(id);

        if(!post){
          throw new NotFoundException(`post with ${id} not found`)
        }
        return post
    }

    async createPost(data: Omit<Post,'id' | 'createdAt'>):Promise<Post>{
        const newPost = await this.postModel.create(data);
        return newPost.save();    
    }

    
    async update(id:string,updatedData: Partial<Omit<Post,'id'| 'createdAt'>>):Promise<Post>{
        const updatedPost = await this.postModel.findByIdAndUpdate(id,updatedData,{new:true});
        if(!updatedPost){
           throw new NotFoundException("Post not updated some error occured")
        }
        return updatedPost;
    }

    async remove(id:string):Promise<{message:string}>{
       const removedPost = await this.postModel.findByIdAndDelete(id);
        return {message:"post has been deleted"}
    }
}
