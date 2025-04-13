import { NextRequest, NextResponse } from 'next/server';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { User } from "@/entities/User";
import { UserSignupDto } from "@/dtos/User/UserLoginDto";
import bcrypt from 'bcryptjs';
import { ResponseFactory } from '@/utils/ResponseFactory';
import { AppDataSource, initializeDataSource } from '@/data-source';
import { verifyToken } from '@/utils/verifyToken';
import { headers } from 'next/headers';


export async function GET(req: NextRequest) {
  try{
    const authorization = (await headers()).get('authorization')
    var jwt = verifyToken(authorization!);
  
    return NextResponse.json(ResponseFactory.success(jwt),{status: 201});

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }

}