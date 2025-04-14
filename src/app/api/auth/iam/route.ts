import { NextRequest, NextResponse } from 'next/server';
import { ResponseFactory } from '@/utils/ResponseFactory';
import { verifyToken } from '@/utils/verifyToken';
import { headers } from 'next/headers';


export async function GET(req: NextRequest) {
  try{
    const authorization = (await headers()).get('authorization')
    var jwt = verifyToken(authorization!);
    return NextResponse.json(ResponseFactory.success(jwt),{status: 200});

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }

}