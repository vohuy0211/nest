import {
  Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, Res
} from '@nestjs/common';

import { CommentService } from './comment.service';
import { CommentDTO } from './dto/comment.dto';

@Controller('/api/v1/comment')

export class CommentController {
  constructor(public commentService: CommentService) {

  }

  @Post()
  async createComment(@Body() body: CommentDTO) {
    try {
      return await this.commentService.postComment(body)
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async getCommentByProductId(@Param('id') id: number) {
    try {
      return await this.commentService.getCommentByProductt(id)
    } catch (error) {
      console.log(error);
    }
  }
}