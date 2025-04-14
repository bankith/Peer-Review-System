import { NextRequest, NextResponse } from 'next/server';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { User } from "@/entities/User";
import { UserLoginDto } from "@/dtos/User/UserLoginDto";
import bcrypt from 'bcryptjs';
import { ResponseFactory } from '@/utils/ResponseFactory';
import { AppDataSource, initializeDataSource } from '@/data-source';
import jwt from 'jsonwebtoken';
import UserLoginResponse from "@/models/Response/UserLoginResponse"
import '@/envConfig.ts'
import * as cookie from 'cookie';
import { UserDto } from '@/dtos/User/UserDto';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const dto = plainToInstance(UserLoginDto, body);  

  const errors = await validate(dto);
  if (errors.length > 0) {
      return NextResponse.json(ResponseFactory.error(errors.toString(), 'fail'), {status: 400});
  }
  await initializeDataSource();

  const { email, password } = dto;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {                  
    const user = await AppDataSource.manager.findOneBy(User, { email: email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return NextResponse.json(ResponseFactory.error('Incorrect username or password', 'NO_USER_FOUND'), {status: 401});        
    }
    const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '24h' });    

    const userLoginResponse = UserLoginResponse.From(new UserDto(user));
    userLoginResponse.token = token;
    
    return NextResponse.json(ResponseFactory.success(userLoginResponse),{status: 200});
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }

}