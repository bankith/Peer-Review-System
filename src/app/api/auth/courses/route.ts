import { NextRequest, NextResponse } from 'next/server';
import { User, UserRoleEnum } from "@/entities/User";
import { ResponseFactory } from '@/utils/ResponseFactory';
import { AppDataSource, initializeDataSource } from '@/data-source';
import { CourseEnrollment } from '@/entities/CourseEnrollment';
import { verifyToken } from '@/utils/verifyToken';
import { headers } from 'next/headers';
import { Course, CourseTermEnum } from '@/entities/Course';
import GroupedCourse from '@/models/Response/GroupedCourseResponse';

export async function GET(req: NextRequest) {
  try {    
      const authorization = (await headers()).get('authorization')
      console.log("authorization: " + authorization);
      var jwt = verifyToken(authorization!);
      if(jwt == null){
        return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
      }
      
      await initializeDataSource();

      console.log(jwt)

      if(jwt.role == UserRoleEnum.student){      

        var courses = await AppDataSource
        .getRepository(Course)
        .createQueryBuilder("Course")
        .leftJoinAndSelect("Course.courseEnrollments", "courseEnrollment")        
        .where("courseEnrollment.studentId = :id", { id: jwt.id })        
        .getMany()

        console.log(courses)
        return NextResponse.json(ResponseFactory.success(groupCoursesByYearAndTerm(courses)),{status: 200});
      }else{
        var courses = await AppDataSource
        .getRepository(Course)
        .createQueryBuilder("Course")
        .leftJoinAndSelect("Course.courseInstructors", "courseInstructor")        
        .where("courseInstructor.instructorId = :id", { id: jwt.id })        
        .getMany()
        return NextResponse.json(ResponseFactory.success(groupCoursesByYearAndTerm(courses)),{status: 200});
      }
    



  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }
}


function groupCoursesByYearAndTerm(courses: Course[]): GroupedCourse[] {
  const map = new Map<string, Course[]>();

  courses.forEach(course => {
      const key = `${course.academicYear}-${course.term}`;
      if (!map.has(key)) {
          map.set(key, []);
      }
      map.get(key)!.push(course);
  });

  const grouped: GroupedCourse[] = [];

  for (const [key, courseList] of map.entries()) {
      const [academicYear, term] = key.split('-');
      grouped.push(new GroupedCourse(academicYear, term as unknown as CourseTermEnum, courseList));
  }

  return grouped;
}
