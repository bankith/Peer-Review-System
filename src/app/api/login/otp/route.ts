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
import { OtpDto } from '@/dtos/User/OtpDto';
import { Otp } from '@/entities/Otp';
import { verifyToken } from '@/utils/verifyToken';
import { headers } from 'next/headers';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/Mail/email-template';

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
      otp.userId = jwt.userId;
      otp.createdBy = jwt.userId;

      const resend = new Resend("re_LQXYHGaM_JmU2TWPkkn3tATeQbCJ5Nopv");
      const { data, error } = await resend.emails.send({
        from: 'SystemPeerReview <no-reply-SystemPeerReview@bankstanakan.com>',
        to: [jwt.email],
        subject: 'Chula SystemPeerReview OTP Verification',
        react: await EmailTemplate({ otpPin: otp.pin }),
      });
    
      if (error) {
        console.log(error)
        return NextResponse.json(ResponseFactory.error(error.message, 'EMAIL_ERROR'), {status: 500});
      }

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
          userId: jwt.userId,          
      },
      order: {
        createdDate: 'DESC', // or 'ASC'
      },
    });    

    if (otp == null) {
        return NextResponse.json(ResponseFactory.error('Incorrect OTP', 'NO_OTP_FOUND'), {status: 401});        
    }                

    if(otp && otp.pin != OTPPin){
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