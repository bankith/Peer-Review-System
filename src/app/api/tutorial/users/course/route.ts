import { NextRequest, NextResponse } from 'next/server';
import { User, UserRoleEnum } from "@/entities/User";
import { ResponseFactory } from '@/utils/ResponseFactory';
import { AppDataSource, initializeDataSource } from '@/data-source';
import { CourseEnrollment } from '@/entities/CourseEnrollment';

export async function GET(req: NextRequest) {
  try {    
      const idParam = req?.nextUrl?.searchParams.get('id')      
      if(idParam != null){
        const id = parseInt(idParam!);
        await initializeDataSource();

        const categoriesWithQuestions = await AppDataSource
        .getRepository(CourseEnrollment)
        .createQueryBuilder("CourseEnrollment")
        .leftJoinAndSelect("CourseEnrollment.student", "student")
        .leftJoinAndSelect("CourseEnrollment.course", "course")
        .where("CourseEnrollment.studentId = :id", { id: id })
        .getMany()


        return NextResponse.json(ResponseFactory.success(categoriesWithQuestions),{status: 201});
      }

      return NextResponse.json(ResponseFactory.success("1"),{status: 201});

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }
}
