import { NextRequest, NextResponse } from 'next/server';
import { User, UserRoleEnum } from "@/entities/User";
import { ResponseFactory } from '@/utils/ResponseFactory';
import { AppDataSource, initializeDataSource } from '@/data-source';
import { verifyToken } from '@/utils/verifyToken';
import { headers } from 'next/headers';
import { StudentProfile } from '@/entities/StudentProfile';
import { InstructorProfile } from '@/entities/InstructorProfile';
import { StudentProfileDto } from '@/dtos/StudentProfile/StudentProfileDto';
import { InstructorProfileDto } from '@/dtos/InstructorProfile/InstructorProfileDto';

export async function GET(req: NextRequest) {
  try {    
      const authorization = (await headers()).get('authorization')      
      var jwt = verifyToken(authorization!);
      if(jwt == null){
        return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
      }
      
      await initializeDataSource();            

      if(jwt.role == UserRoleEnum.student){      

        var studentProfile = await AppDataSource
        .getRepository(StudentProfile)
        .createQueryBuilder("StudentProfile")
        .leftJoinAndSelect("StudentProfile.user", "user")
        .where("user.id = :id", { id: jwt.userId })        
        .getOne();
        if(studentProfile == null){
          return NextResponse.json(ResponseFactory.error("Student Profile is not found", 'PROFILE_NOT_FOUND'), {status: 404});
        }
        
        var studentProfileDto = new StudentProfileDto(await studentProfile.user, studentProfile);        
        return NextResponse.json(ResponseFactory.success(studentProfileDto),{status: 200});
      }else{
        var instructorProfile = await AppDataSource
        .getRepository(InstructorProfile)
        .createQueryBuilder("InstructorProfile")
        .leftJoinAndSelect("InstructorProfile.user", "user")
        .where("user.id = :id", { id: jwt.userId })        
        .getOne();
        if(instructorProfile == null){
          return NextResponse.json(ResponseFactory.error("Instructor Profile is not found", 'PROFILE_NOT_FOUND'), {status: 404});
        }
        
        var instructorProfileDto = new InstructorProfileDto(await instructorProfile.user, instructorProfile);        
        return NextResponse.json(ResponseFactory.success(instructorProfileDto),{status: 200});
      }
    



  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }
}