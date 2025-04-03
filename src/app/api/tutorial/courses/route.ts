import { NextRequest, NextResponse } from 'next/server';
import { User, UserRoleEnum } from "@/entities/User";
import { ResponseFactory } from '@/utils/ResponseFactory';
import { AppDataSource, initializeDataSource } from '@/data-source';
import { Course } from '@/entities/Course';
import { CourseEnrollment } from '@/entities/CourseEnrollment';

export async function GET(req: NextRequest) {
  try {    
      const idParam = req?.nextUrl?.searchParams.get('courseId')      
      if(idParam != null){
        const id = parseInt(idParam!);
        await initializeDataSource();
        const repo = AppDataSource.getRepository(Course)
        var course = await repo.findOne({ where: {
          id: id
      } });
        return NextResponse.json(ResponseFactory.success(course),{status: 201});
      }

      

      await initializeDataSource();
      const repo = AppDataSource.getRepository(Course)
      var all = await repo.find();
      return NextResponse.json(ResponseFactory.success(all),{status: 201});

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }
}
