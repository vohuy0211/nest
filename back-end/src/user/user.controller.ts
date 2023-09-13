import { Request, Response } from 'express';

import {
  Body, Controller, Get, NotFoundException, Param, Patch, Post, Req, Res
} from '@nestjs/common';

import { Login, UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('/api/v1/user')
export class UserController {
  constructor(public userService: UserService) {

  }

  @Post('register')
  async registerUser(@Body() body: UserDTO) {
    try {
      console.log("abc");
      return this.userService.handleRegister(body);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('login')
  async loginUser(@Body() body: Login, @Res() res: Response) {
    try {
      return this.userService.handleLogin(body, res);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('refresh-token')
  async refreshToken(@Res() res: Response, @Req() req: Request) {
    try {
      return this.userService.refreshToken(res, req)
    } catch (error) {
      console.log(error);

    }
  }

  @Post('logout')
  async logoutUser(@Res() res: Response, @Req() req: Request) {
    try {
      return this.userService.handleLogout(req, res);
    } catch (error) {
      console.log(error);
    }
  }

  @Patch(':id')
  async editUserById(@Param('id') id: number, @Body() body: UserDTO) {
    try {
      return this.userService.updateUser(id, body);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('get-user/:id')
  async getUserById(@Param('id') id: number) {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @Get('search/:name')
  async searchUserByName(@Param('name') name: string): Promise<UserDTO[]> {
    try {
      return await this.userService.searchUser(name);
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  async getAllUsers() {
    try {
      return await this.userService.getUser();
    } catch (error) {
      console.log(error);
    }
  }

  @Patch('patch-user-admin/:id')
  async updateUser(@Param('id') id: number, @Body() body: UserDTO) {
    try {
      return this.userService.updateUser(id, body);
    } catch (error) {
      console.log(error);
    }
  }

}