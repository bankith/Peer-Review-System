import { NextRequest, NextResponse } from 'next/server';
import { User, UserRoleEnum } from "@/entities/User";
import { ResponseFactory } from '@/utils/ResponseFactory';
import { AppDataSource, initializeDataSource } from '@/data-source';

export async function GET(req: NextRequest) {
  try {    
      const userIdParam = req?.nextUrl?.searchParams.get('userId')      
      if(userIdParam != null){
        const userId = parseInt(userIdParam!);
        await initializeDataSource();
        const userRepository = AppDataSource.getRepository(User)
        var user = await userRepository.findOne({ where: {
          id: userId
      } });
        return NextResponse.json(ResponseFactory.success(user),{status: 201});
      }

      await initializeDataSource();
      const userRepository = AppDataSource.getRepository(User)
      var allUser = await userRepository.find();
      return NextResponse.json(ResponseFactory.success(allUser),{status: 201});

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }
}
