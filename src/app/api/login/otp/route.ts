import { NextRequest, NextResponse } from 'next/server';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { User } from "@/entities/User";
import { UserLoginDto } from "@/dtos/User/UserDto";
import bcrypt from 'bcryptjs';
import { ResponseFactory } from '@/utils/ResponseFactory';
import { AppDataSource, initializeDataSource } from '@/data-source';
import jwt from 'jsonwebtoken';
import UserLoginResponse from "@/models/Response/UserLoginResponse"
import '@/envConfig.ts'
import * as cookie from 'cookie';
import { OtpDto } from '@/dtos/User/OtpDto';
import { Otp } from '@/entities/Otp';
import { verifyToken } from '@/utils/verifyToken';
import { headers } from 'next/headers';

export async function GET(req: NextRequest) {
  try {    
      const authorization = (await headers()).get('authorization')
      console.log("authorization: " + authorization);
      var jwt = verifyToken(authorization!);
      if(jwt == null){
        return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
      }
      await initializeDataSource();
      
      let otp = new Otp();
      otp.pin = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      otp.userId = jwt.id;
      otp.createdBy = jwt.id;
      await AppDataSource.manager.save(otp);

      
      return NextResponse.json(ResponseFactory.success(null),{status: 200});

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }
}


export async function POST(req: NextRequest) {
  const authorization = (await headers()).get('authorization')
  console.log("authorization: " + authorization);
  var jwt = verifyToken(authorization!);
  if(jwt == null){
    return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
  }            

  const body = await req.json();
  const dto = plainToInstance(OtpDto, body);  
  const errors = await validate(dto);
  if (errors.length > 0) {
      return NextResponse.json(ResponseFactory.error(errors.toString(), 'fail'), {status: 400});
  }

  await initializeDataSource();
  const { OTPPin } = dto;  

  try {                  
    const otp = await AppDataSource.manager.findOne(Otp, {      
      where: { 
          userId: jwt.id, 
          pin: OTPPin,
      },
      order: {
        createdDate: 'DESC', // or 'ASC'
      },
    });    

    if (!otp) {
        return NextResponse.json(ResponseFactory.error('Incorrect OTP', 'NO_OTP_FOUND'), {status: 401});        
    }                
    
    return NextResponse.json(ResponseFactory.success(null),{status: 200});
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }

}