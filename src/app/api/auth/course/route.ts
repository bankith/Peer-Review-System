import { NextRequest, NextResponse } from 'next/server';
import { User, UserRoleEnum } from "@/entities/User";
import { ResponseFactory } from '@/utils/ResponseFactory';
import { AppDataSource, initializeDataSource } from '@/data-source';
import { CourseEnrollment } from '@/entities/CourseEnrollment';
import { verifyToken } from '@/utils/verifyToken';
import { headers } from 'next/headers';
import { Course } from '@/entities/Course';

export async function GET(req: NextRequest) {
  try {    
      const authorization = (await headers()).get('authorization')
      var jwt = verifyToken(authorization!);
      if(jwt == null){
        return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
      }

      const idParam = req?.nextUrl?.searchParams.get('studentId')      
      if(idParam != null){
        const id = parseInt(idParam!);
        await initializeDataSource();

        var courses = await AppDataSource
        .getRepository(Course)
        .createQueryBuilder("Course")
        .leftJoinAndSelect("Course.courseEnrollments", "courseEnrollment")        
        .where("courseEnrollment.studentId = :id", { id: jwt.id })        
        .getMany()

        return NextResponse.json(ResponseFactory.success(courses),{status: 200});
      }

      return NextResponse.json(ResponseFactory.success("1"),{status: 201});

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }
}
