import { NextRequest, NextResponse } from 'next/server';
import { User } from "@/entities/User";
import { ResponseFactory } from '@/utils/ResponseFactory';
import { AppDataSource, initializeDataSource } from '@/data-source';
import jwt from 'jsonwebtoken';
import UserLoginResponse from "@/models/Response/UserLoginResponse"
import '@/envConfig.ts'
import { verifyTokenForOTP } from '@/utils/verifyToken';
import { headers } from 'next/headers';
import { UserDto } from '@/dtos/User/UserDto';
import { UserFactoryServerSide } from '@/factories/UserFactoryServerSide';

export async function GET(req: NextRequest) {
  try {    
      const authorization = (await headers()).get('authorization')
      
      var jwtAuth = verifyTokenForOTP(authorization!);
      if(jwtAuth == null){
        return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
      }
      await initializeDataSource();
      

      const user = await AppDataSource.manager.findOneBy(User, { id: jwtAuth.userId });
      if (!user) {
          return NextResponse.json(ResponseFactory.error('No user found', 'NO_USER_FOUND'), {status: 401});        
      }
      
      const token = jwt.sign({ userId: jwtAuth.userId, role: jwtAuth.role, email: jwtAuth.email, isPassOTP: true }, process.env.JWT_SECRET!, { expiresIn: '24h' });    

     var studenOrIntructorDto = await UserFactoryServerSide.create(user);

    const userLoginResponse = UserLoginResponse.From(studenOrIntructorDto);
    userLoginResponse.token = token;

    return NextResponse.json(ResponseFactory.success(userLoginResponse),{status: 200});

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }
}

