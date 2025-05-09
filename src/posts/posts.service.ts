import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateDTO } from './dto/update-post.dto';
import { CreateDTO } from './dto/create-post.dto';

@Injectable()
export class PostsService {
    constructor(@InjectModel('Post') private readonly postModel:Model<Post>){}

    async findAll():Promise<Post[]>{
        return this.postModel.find().lean().exec();
    }

    async findOne(id:string):Promise<Post>{
        const post =  await this.postModel.findById(id);

        if(!post){
          throw new NotFoundException(`post with ${id} not found`)
        }
        return post
    }

    async createPost(data: CreateDTO):Promise<Post>{
        return this.postModel.create(data);           
    }

    async update(id:string,updatedData: UpdateDTO):Promise<Post>{
        const updatedPost = await this.postModel.findByIdAndUpdate(id,updatedData,{new:true});
        if (!updatedPost) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }        
        return updatedPost;
    }

    async remove(id: string): Promise<{ message: string }> {
        const removedPost = await this.postModel.findByIdAndDelete(id);
        if (!removedPost) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        return { message: "Post has been deleted" };
    }
}
