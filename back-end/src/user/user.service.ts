import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ILike, Repository } from 'typeorm';

import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import sceret from '../jwt.config';
import { User } from './database/user.entity';
import { Login, UserDTO } from './dto/user.dto';

let refreshTokenArr = []
@Injectable()

export class UserService {
  constructor(@InjectRepository(User)
  private UserRepo: Repository<User>
  ) { }

  async getUser() {
    try {
      return await this.UserRepo.find();
    } catch (error) {
      console.log(error);
    }
  }

  async getUserById(id: number) {
    try {
      return await this.UserRepo.findOneBy({ id });
    } catch (error) {
      console.log(error);
    }
  }

  async searchUser(name: string): Promise<UserDTO[]> {
    try {
      return await this.UserRepo.find({
        where: {
          username: ILike(`%${name}%`)
        }
      })
    } catch (error) {
      console.log(error);

    }
  }

  async handleRegister(data: UserDTO) {
    // get email vs password ở body
    const { email, password } = data;
    console.log(data);

    try {
      //kiểm tra username đã tồn tại chưa
      const UserData = await this.UserRepo.findOne({ where: { email } });

      // nếu mà tồn tại username thì báo lỗi
      if (UserData) {
        return ({ msg: 'email already exists' });
      }
      // trường hợp k tồn tại username
      const saltRounds = 10; //độ an toàn mã hóa của password
      const salt = await bcrypt.genSalt(saltRounds);
      // console.log("haha");

      const hashedPassword = await bcrypt.hash(password, salt); // Mã hóa password
      const user = this.UserRepo.create({ ...data, password: hashedPassword }); // Insert dữ liệu, password = password mới mã hóa

      await this.UserRepo.save(user);

      return ({ msg: 'Register Successfully' });
    } catch (error) {
      // lỗi serve
      console.log("error", error);
      return {
        msg: 'Error',
        error: error
      }
    }
  }

  async handleLogin(data: Login, res: Response) {
    const { email, password } = data;
    // console.log(data);

    try {

      const user = await this.UserRepo.findOne({ where: { email } });
      // console.log(user);
      // Nếu có user thì so sánh password bằng hàm compare
      if (user) {
        const myPass = await bcrypt.compare(password, user.password);
        if (myPass) {
          const payload = {
            userId: user.id,
            email: user.email
          };

          const accessToken = jwt.sign(payload, sceret.sceretKey, { expiresIn: "6000s" });
          const refreshToken = jwt.sign(payload, sceret.sceretKeyRefresh, { expiresIn: "365d" });
          refreshTokenArr.push(refreshToken)
          const { password, ...data } = user;

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          res.status(200).json({
            data,
            accessToken
          })
        } else {
          return ({ msg: 'Password Wrong' });
        }
      } else {
        // Nếu sai thì báo lỗi
        return ({ msg: 'email dont exist' });
      }
    } catch (error) {
      console.log("Đăng nhập thất bại");
      console.log("Login failed:", error);
      return res.status(500).json({ msg: 'Internal Server Error' });

    }
  }

  async refreshToken(res: Response, req: Request) {

    const refreshToken = req.cookies.refreshToken;
    // console.log(111, refreshToken);

    //Lưu ý nhớ cài đặt cookie-parser
    if (!refreshToken) {
      return res.status(401).json("Unauthenticateds")
    }
    if (!refreshTokenArr.includes(refreshToken)) {
      return res.status(401).json("Unauthenticated")
    }
    jwt.verify(refreshToken, sceret.sceretKeyRefresh, (err: any, user: any) => {
      if (err) {
        return res.status(400).json("refreshToken is not valid")
      }
      const { iat, exp, ...userOther } = user
      // console.log(user);
      refreshTokenArr = refreshTokenArr.filter(token => token !== refreshToken) //lọc ra những thằng cũ
      //nếu đúng thì nó sẽ tạo accessToken mới và cả refreshToken mới
      const newAccessToken = jwt.sign(userOther, sceret.sceretKey, { expiresIn: "6000s" })
      const newRefreshToken = jwt.sign(userOther, sceret.sceretKeyRefresh, { expiresIn: "365d" })
      refreshTokenArr.push(newRefreshToken)
      res.cookie("refreshToken", newRefreshToken, { //Lưu NewrefreshToken vào cookie khi reset thành công 
        httpOnly: true,
        secure: true,
        sameSite: "none"
      })
      return res.status(200).json(newAccessToken)

    })
  }

  async handleLogout(req: Request, res: Response) {
    res.clearCookie("refreshToken")
    refreshTokenArr = refreshTokenArr.filter(token => token !== req.cookies.refreshToken)
    res.status(200).json("Logout successfully")
  }

  async updateUser(id: number, data: UserDTO) {
    try {
      const userToUpdate = await this.UserRepo.findOne({ where: { id: id } });
      if (!userToUpdate) {
        return { msg: "User not found" }
      } else {
        await this.UserRepo.update(id, data);
      }
    } catch (error) {
      console.log(error);
    }
  }


} 