import { NextRequest, NextResponse } from 'next/server';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { User } from "@/entities/User";
import { UserSignupDto } from "@/dtos/User/UserDto";
import bcrypt from 'bcryptjs';
import { ResponseFactory } from '@/utils/ResponseFactory';
import { AppDataSource, initializeDataSource } from '@/data-source';


export async function POST(req: NextRequest) {

  // Validate
  const body = await req.json();
  const dto = plainToInstance(UserSignupDto, body);  

  const errors = await validate(dto);
  if (errors.length > 0) {
      return NextResponse.json(ResponseFactory.error('Validation failed', errors.toString()), {status: 400});
  }

  // Init Database Connection
  await initializeDataSource();
  
  // Save User to database
  try {                  
      const { email, password } = dto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User();
      user.email = email;
      user.password = hashedPassword;
      await await AppDataSource.manager.save(user);
      
      return NextResponse.json(ResponseFactory.success(user),{status: 201});
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }

}