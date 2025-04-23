import { NextRequest, NextResponse } from 'next/server';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { User } from "@/entities/User";
import { ResponseFactory } from '@/utils/ResponseFactory';
import { AppDataSource, initializeDataSource } from '@/data-source';
import jwt from 'jsonwebtoken';
import UserLoginResponse from "@/models/Response/UserLoginResponse"
import '@/envConfig.ts'
import { OtpDto } from '@/dtos/User/OtpDto';
import { Otp } from '@/entities/Otp';
import { verifyTokenForOTP } from '@/utils/verifyToken';
import { headers } from 'next/headers';
import { UserDto } from '@/dtos/User/UserDto';
import { v4 } from "uuid";

import AWS from 'aws-sdk';
import { ProxyOTPEmailSender } from '@/proxy/ProxyOTPEmailSender';
import { AWSEmailSender } from '@/proxy/AWSEmailSender';

 AWS.config.update({ 
 region: process.env.AWS_REGION2!,  
 accessKeyId: process.env.AWS_ACCESS_KEY_ID!, 
 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!, 
 });

 const ses = new AWS.SES({ apiVersion: 'latest' });
		
    

export async function GET(req: NextRequest) {
  try {    
      const authorization = (await headers()).get('authorization')
      
      var jwt = verifyTokenForOTP(authorization!);
      if(jwt == null){
        return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
      }
      await initializeDataSource();
      
      let otp = new Otp();
      otp.pin = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      otp.userId = jwt.userId;
      otp.createdBy = jwt.userId;
      otp.reference = v4();

      let proxyEmailSender = new ProxyOTPEmailSender(new AWSEmailSender());
      proxyEmailSender.sendEmail(jwt.userId, jwt.email, 'Chula SystemPeerReview OTP Verification', "Your confirmation code is " + otp.pin)
    


      await AppDataSource.manager.save(otp);

      
      return NextResponse.json(ResponseFactory.success(null),{status: 200});

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }
}

    
    
export async function sendEmail(to: string, from: string, subject: string, message: string) {
  const params = {
    Source: from,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: message } },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log('Email sent:', result.MessageId);
    return result.MessageId;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
		
    


export async function POST(req: NextRequest) {
  const authorization = (await headers()).get('authorization')
  
  var jwtAuth = verifyTokenForOTP(authorization!);
  if(jwtAuth == null){
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
          userId: jwtAuth.userId,          
      },
      order: {
        createdDate: 'DESC',
      },
    });    

    if (otp == null) {
        return NextResponse.json(ResponseFactory.error('Incorrect OTP', 'NO_OTP_FOUND'), {status: 401});        
    }                

    if(otp && otp.pin != OTPPin){
        return NextResponse.json(ResponseFactory.error('Incorrect OTP', 'NO_OTP_FOUND'), {status: 401});        
    }

    const user = await AppDataSource.manager.findOneBy(User, { id: jwtAuth.userId });
      if (!user) {
          return NextResponse.json(ResponseFactory.error('No user found', 'NO_USER_FOUND'), {status: 401});        
      }
      
    const token = jwt.sign({ userId: jwtAuth.userId, role: jwtAuth.role, email: jwtAuth.email, isPassOTP: true }, process.env.JWT_SECRET!, { expiresIn: '24h' });
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