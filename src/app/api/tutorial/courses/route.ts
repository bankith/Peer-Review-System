import { NextRequest, NextResponse } from 'next/server';
import { User, UserRoleEnum } from "@/entities/User";
import { ResponseFactory } from '@/utils/ResponseFactory';
import { AppDataSource, initializeDataSource } from '@/data-source';
import { Course, CourseLevelEnum, CourseTermEnum } from '@/entities/Course';
import { CourseEnrollment } from '@/entities/CourseEnrollment';
import { CourseInstructor } from '@/entities/CourseInstructor';
import { StudentGroup } from '@/entities/StudentGroup';
import { GroupMember } from '@/entities/GroupMember';

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

// Assign Course
export async function POST(req: NextRequest) {
  try {          
      await initializeDataSource();

      const student = await AppDataSource.manager.findOneBy(User, { email: "6770243521@student.chula.ac.th" });
      const instructor = await AppDataSource.manager.findOneBy(User, { email: "6770243521@instructor.chula.ac.th" });
      if(student == null){
        return NextResponse.json(ResponseFactory.error('Not found student', 'NO_USER_FOUND'), {status: 401});        
      }
      if(instructor == null){
        return NextResponse.json(ResponseFactory.error('Not found instructor', 'NO_USER_FOUND'), {status: 401});        
      }

      // const course = new Course();
      // course.courseName = "SOFTWARE DESIGN AND DEVELOPMENT";
      // course.term = CourseTermEnum.First;
      // course.level = CourseLevelEnum.Graduate;
      // course.academicYear = "2025";
      // await AppDataSource.manager.save(course);

      const course = await AppDataSource.manager.findOneBy(Course, { courseName: "SOFTWARE DESIGN AND DEVELOPMENT" });
      if(course == null){
        return NextResponse.json(ResponseFactory.error('Not found class', 'NO_CLASS_FOUND'), {status: 401});        
      }

      // const courseInstructor = new CourseInstructor();
      // courseInstructor.instructor = Promise.resolve(instructor);
      // courseInstructor.course = Promise.resolve(course);
      // await AppDataSource.manager.save(courseInstructor);
      // course.courseInstructors = [courseInstructor]

      // const courseEnrollment = new CourseEnrollment();
      // courseEnrollment.student = Promise.resolve(student);
      // courseEnrollment.course = Promise.resolve(course);
      // await AppDataSource.manager.save(courseEnrollment);

      
      // const studentGroup = new StudentGroup();
      // studentGroup.name =  "Group name";
      // studentGroup.course = Promise.resolve(course);
      // const groupMember = new GroupMember();
      // groupMember.group = Promise.resolve(studentGroup);
      // groupMember.user = Promise.resolve(student);      
      // await AppDataSource.manager.save(studentGroup);

      // studentGroup.groupMembers = Promise.resolve([groupMember]);
      // await AppDataSource.manager.save(studentGroup);
      
      
      
      return NextResponse.json(ResponseFactory.success(course),{status: 201});

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }
}
