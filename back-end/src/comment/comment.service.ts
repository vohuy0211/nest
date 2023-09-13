import { ILike, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Comment } from './database/comment.entity';
import { CommentDTO } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(@InjectRepository(Comment)
  private CommentRepo: Repository<Comment>
  ) { }
  async postComment(data: CommentDTO) {
    try {
      const comments = {
        userId: data.userId,
        productId: data.productId,
        star: data.star,
        comment: data.comment,
      }
      this.CommentRepo.create(comments)
      await this.CommentRepo.save(comments)
      return { message: 'comment created successfully' }

    } catch (error) {
      console.log(error);

    }
  }

  async getCommentByProductt(id: number) {
    try {
      const commentByProductId = await this.CommentRepo.find({
        where: { productId: id },
        relations: ['user']
      })
      return commentByProductId
    } catch (error) {
      console.log(error);
    }
  }
}