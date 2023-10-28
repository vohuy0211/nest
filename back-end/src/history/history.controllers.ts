import {
  Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put
} from '@nestjs/common';

import { HistoryDTO } from './dto/history.dto';
import { HistoryService } from './history.service';

@Controller(
  '/api/v1/history'
)
export class HistoryController {
  constructor(public historyService: HistoryService) {
  }

  @Post('postHistory')
  createHistory(@Body() body: HistoryDTO) {
    return this.historyService.handlePostHistory(body)
  }

  @Get()
  async getHistoryAll() {
    try {
      return await this.historyService.handleGetAllHistory()
    } catch (error) {
      console.log(error);
    }
  }

  @Get('getHistoryByUserId/:id')
  async getHistoryByIdUser(@Param("id") id: number) {
    try {
      return await this.historyService.handleGetHistoryById(id)
    } catch (error) {
      console.log(error);
    }
  }

  @Get(":id")
  async getHistoryById(@Param('id') id: number) {
    try {
      return await this.historyService.getHistoryById(id as any)
    } catch (error) {
      console.log(error);
    }
  }



  @Patch('patchHistory/:id')
  async updateHistoryById(@Param('id') id: number, @Body() data: HistoryDTO) {
    try {
      return await this.historyService.handlePatchHistory(id, data);
    } catch (error) {
      console.log(error);
    }
  }

  @Delete(':id')
  async DeleteById(@Param('id') id: number) {
    try {
      return await this.historyService.deleteHistoryById(id)
    } catch (error) {
      console.log(error);
    }
  }


}