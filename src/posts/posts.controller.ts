import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostInterface } from './interfaces/post.interface';
import { CreateDTO } from './dto/create-post.dto';
import { UpdateDTO } from './dto/update-post.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async findAll(@Query('search') search?: string): Promise<PostInterface[]> {
    const extractFindAll = await this.postService.findAll();

    if (search) {
      return extractFindAll.filter((post) =>
        post.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      );
    }

    return extractFindAll;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostInterface> {
    return this.postService.findOne(id);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Body() data: CreateDTO,
  ): Promise<PostInterface> {
    console.log("received Data",data);    
    return this.postService.createPost(data);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatedData: UpdateDTO,
  ): Promise<PostInterface> {
    return this.postService.update(id, updatedData);
  }

  @Delete(':id')
  async deletepost(@Param('id')id:string):Promise<void>{
    this.postService.remove(id)
  }
}
