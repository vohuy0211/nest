import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

require("dotenv").config();
const PORT = process.env.APP_PORT || 8000
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigin = [
    'http://localhost:8080',
    'http://localhost:8000',
    'http://localhost:5173'
  ];

  //middleware
  const corsOptions = {
    origin: corsOrigin,
    credentials: true, // access-control-allow-credentials: true
    optionsSuccessStatus: 200, // Sửa tên thuộc tính thành optionsSuccessStatus
  };

  app.enableCors(corsOptions);
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.useGlobalPipes(new ValidationPipe())
  // const PORT = 8000;
  await app.listen(PORT, () => {
    console.log(process.env.APP_PORT, 'APP_PORT');
    console.log(`server đã chạy http://localhost:${PORT}`);
  });
}
bootstrap();
