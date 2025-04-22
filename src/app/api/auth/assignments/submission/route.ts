import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { AssignmentSubmission } from "@/entities/AssignmentSubmission";
import { StudentGroup } from "@/entities/StudentGroup";
import { plainToInstance } from "class-transformer";
import { AssignmentSubmissionDto } from "@/dtos/Assignment/AssignmentSubmissionDto";
import { validate } from "class-validator";
import { headers } from "next/headers";
import { verifyToken } from "@/utils/verifyToken";
import { User } from "@/entities/User";
import { Assignment } from "@/entities/Assignment";
import { GroupMember } from "@/entities/GroupMember";
import { NotificationBuilder } from "@/app/builders/NotificationBuilder";
import { NotificationTypeEnum } from "@/entities/Notification";

export async function POST(req: NextRequest) {
  try {
    const authorization = (await headers()).get('authorization')      
    var jwt = verifyToken(authorization!);
    if(jwt == null){
      return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
    }

    const body = await req.json();
    const dto = plainToInstance(AssignmentSubmissionDto, body);  

    const errors = await validate(dto);
    if (errors.length > 0) {
        return NextResponse.json(ResponseFactory.error(errors.toString(), 'fail'), {status: 400});
    }
    await initializeDataSource();

    const user = await AppDataSource.manager.findOneBy(User, { id: jwt.userId });
    if(!user){
      return NextResponse.json(ResponseFactory.error("No User found", 'Unauthorize'), {status: 401});
    }

    const submissionRepo = AppDataSource.getRepository(AssignmentSubmission);
         
    const existingSubmission = await submissionRepo.findOne({
      where: {
        assignment: { id: dto.assignmentId },
        user: { id: jwt.userId },
      },
    });

    if(existingSubmission)
    {
      return NextResponse.json(ResponseFactory.error("Already Submited", 'Already Submited'), {status: 400});    
    }   

    const assignment = await AppDataSource.getRepository(Assignment).findOneOrFail({
      where: {
        id: dto.assignmentId        
      },
    });
  
      var group = await AppDataSource
      .getRepository(GroupMember)
      .createQueryBuilder("GroupMember")
      .leftJoinAndSelect("GroupMember.group", "studentGroup")        
      .where("GroupMember.userId = :id", { id: jwt.userId })
      .andWhere("studentGroup.courseId = :courseId", { courseId: assignment.courseId })
      .getOne()      

      let newSubmission = new AssignmentSubmission();
      newSubmission.isSubmit = true;
      newSubmission.userId = user.id;
      newSubmission.assignmentId = dto.assignmentId;
      newSubmission.answer = {q1: dto.answer};      
      if(group) {newSubmission.studentGroupId = group.groupId;}
      newSubmission.fileLink = dto.fileLink;

      const savedSubmission = await submissionRepo.save(newSubmission);
      

      var notification = await NotificationBuilder
        .fromSystem()
        .forUserId(jwt.userId)
        .withNotificationType(NotificationTypeEnum.SubmitAssignmentSubmission)
        .withMessage("Assingment " + assignment.title + " has been submitted")
        .forAssignment(dto.assignmentId)
        .withSendEmail(jwt.email)
        .build();
      await AppDataSource.manager.save(notification);      

      return NextResponse.json(ResponseFactory.success(savedSubmission),{status: 201 });
    
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error);
      return NextResponse.json(
        ResponseFactory.error(error.message, "INTERNAL_ERROR"),
        { status: 500 }
      );
    }
    console.error("Unknown Error:", error);
    return NextResponse.json(
      ResponseFactory.error("An unexpected error occurred", "UNKNOWN_ERROR"),
      { status: 500 }
    );
  }
}
