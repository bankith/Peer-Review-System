import { NextRequest, NextResponse } from 'next/server';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { User, UserRoleEnum } from "@/entities/User";
import { UserSignupDto } from "@/dtos/User/UserDto";
import bcrypt from 'bcryptjs';
import { ResponseFactory } from '@/utils/ResponseFactory';
import { AppDataSource, initializeDataSource } from '@/data-source';
import { StudentProfile, StudentProfileLevelEnum } from '@/entities/StudentProfile';
import { Course, CourseLevelEnum, CourseTermEnum } from '@/entities/Course';
import { CourseEnrollment } from '@/entities/CourseEnrollment';
import { CourseInstructor } from '@/entities/CourseInstructor';
import { StudentGroup } from '@/entities/StudentGroup';
import { GroupMember } from '@/entities/GroupMember';
import { Assignment, AssignmentTypeEnum } from '@/entities/Assignment';
import { AssignmentSubmission } from '@/entities/AssignmentSubmission';
import { PeerReview } from '@/entities/PeerReview';
import { AssignmentGrading } from '@/entities/AssignmentGrading';
import { PeerReviewSubmission } from '@/entities/PeerReviewSubmission';


export async function POST(req: NextRequest) {

  // Validate
  const body = await req.json();
  const dto = plainToInstance(UserSignupDto, body);  

  const errors = await validate(dto);
  if (errors.length > 0) {
      return NextResponse.json(ResponseFactory.error(errors.toString(), 'Validation failed'), {status: 400});
  }

  // Init Database Connection
  await initializeDataSource();
  
  // Save User to database
  try {                  
    
      const { email, password } = dto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User();
      user.email = email;
      user.passwordHash = hashedPassword;
      user.role = UserRoleEnum.student      
      user.name = "เทสไทย"
      // user.studentProfile = s;
      await AppDataSource.manager.save(user);

      const s = new StudentProfile();
      s.user = Promise.resolve(user);
      s.department = "Software Engineerning";
      s.faculty = "Engineering";
      s.level = StudentProfileLevelEnum.Graduate;
      s.createdBy = user.id;
      // await AppDataSource.manager.save(s);

      

      const course = new Course();
      course.courseName = "Universal homogeneous projection";
      course.term = CourseTermEnum.First;
      course.level = CourseLevelEnum.Graduate;
      course.academicYear = "2025";
      const courseEnrollment = new CourseEnrollment();
      courseEnrollment.student = Promise.resolve(user);
      courseEnrollment.course = Promise.resolve(course);
      course.courseEnrollments = [courseEnrollment];

      const courseInstructor = new CourseInstructor();
      courseInstructor.instructor = Promise.resolve(user);
      courseInstructor.course = Promise.resolve(course);
      course.courseInstructors = [courseInstructor]

      const studentGroup = new StudentGroup();
      studentGroup.name =  "test";
      const groupMember = new GroupMember();
      groupMember.group = Promise.resolve(studentGroup);
      groupMember.user = Promise.resolve(user);
      await AppDataSource.manager.save(groupMember);

      studentGroup.groupMembers = Promise.resolve([groupMember]);
      await AppDataSource.manager.save(studentGroup);
      course.groups = [studentGroup];
      
      await AppDataSource.manager.save(course);

      const assignment = new Assignment();
      assignment.title = "test";
      assignment.course = Promise.resolve(course);
      assignment.outDate = new Date();
      assignment.dueDate = new Date();      
      assignment.isCreateReview = false;
      assignment.question = {q1: "tesst"}
      assignment.assignmentType = AssignmentTypeEnum.group;

      await AppDataSource.manager.save(assignment);

      const assignmentSubmissions = new AssignmentSubmission();
      assignmentSubmissions.assignment = Promise.resolve(assignment);
      assignmentSubmissions.studentGroup = Promise.resolve(studentGroup);
      assignmentSubmissions.user = Promise.resolve(user);
      assignmentSubmissions.answer = {q1: "tesst"}
      await AppDataSource.manager.save(assignmentSubmissions);

      const assignmentGrading = new AssignmentGrading();
      assignmentGrading.score = 10;
      assignmentGrading.gradedBy = user.id;
      assignmentGrading.submission = Promise.resolve(assignmentSubmissions);
      await AppDataSource.manager.save(assignmentGrading);

      const peerReview = new PeerReview();
      peerReview.assignment = Promise.resolve(assignment);
      peerReview.name = "testt";
      peerReview.outDate = new Date();
      peerReview.dueDate = new Date();    
      await AppDataSource.manager.save(peerReview);


      const peerReviewSubmission = new PeerReviewSubmission();
      peerReviewSubmission.peerReview = Promise.resolve(peerReview);
      peerReviewSubmission.submittedAt = new Date();
      peerReviewSubmission.reviewer = Promise.resolve(user);
      peerReviewSubmission.reviewee = Promise.resolve(user);
      peerReviewSubmission.updatedBy = user.id;
      await AppDataSource.manager.save(peerReviewSubmission);

      const userRepository = AppDataSource.getRepository(User)
      var allUser = await userRepository.find();

      const courseRepository = AppDataSource.getRepository(Course)
      var allCourse = await courseRepository.find();

      const assignmentRepository = AppDataSource.getRepository(AssignmentSubmission)
      var allAssignment = await assignmentRepository.find();

      const peerReviewRepository = AppDataSource.getRepository(PeerReview)
      var allPeerReview = await peerReviewRepository.find();
            
      return NextResponse.json(ResponseFactory.success(allPeerReview),{status: 201});
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }

}