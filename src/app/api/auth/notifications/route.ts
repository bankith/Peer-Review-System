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
import { plainToInstance } from 'class-transformer';
import { AddNotificationDto } from '@/dtos/Notification/AddNotificationDto';
import { validate } from 'class-validator';
import { Notification, NotificationTypeEnum } from '@/entities/Notification';
import { NotificationBuilder } from '@/app/builders/NotificationBuilder';
import { NotificationDto } from '@/dtos/Notification/NotificationDto';

export async function GET(req: NextRequest) {
  try {    
      const authorization = (await headers()).get('authorization')      
      var jwt = verifyToken(authorization!);
      if(jwt == null){
        return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
      }
      
      await initializeDataSource();            


      const notifications = await AppDataSource.manager.find(Notification, {      
        where: { 
            userId: jwt.userId,
        },
        order: {
          createdDate: 'DESC',
        },
      });    

      var noti: NotificationDto[] = [];
      notifications.forEach(notification => {
        noti.push(new NotificationDto(notification));
      });
      
      return NextResponse.json(ResponseFactory.success(noti),{status: 200});
    



  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }
}

export async function POST(req: NextRequest) {
  try {    
      const authorization = (await headers()).get('authorization')      
      var jwt = verifyToken(authorization!);
      if(jwt == null){
        return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
      }

      const body = await req.json();
      const dto = plainToInstance(AddNotificationDto, body);  

      const errors = await validate(dto);
      if (errors.length > 0) {
          return NextResponse.json(ResponseFactory.error(errors.toString(), 'fail'), {status: 400});
      }
      
      await initializeDataSource();   

      let notification = new Notification();

      if(dto.notificationType == NotificationTypeEnum.AssignAssignmentSubmission){
        var instructorProfile = await AppDataSource
        .getRepository(InstructorProfile)
        .createQueryBuilder("InstructorProfile")
        .leftJoinAndSelect("InstructorProfile.user", "user")
        .where("user.id = :id", { id: dto.senderId })        
        .getOne();
        if(instructorProfile == null){
          return NextResponse.json(ResponseFactory.error("Instructor Profile is not found", 'PROFILE_NOT_FOUND'), {status: 404});
        }

        notification = NotificationBuilder
        .fromUser(dto.senderId, instructorProfile.picture)
        .forUserId(jwt.userId)
        .withNotificationType(dto.notificationType)
        .withMessage((await instructorProfile.user).name + " " + dto.message)
        .forAssignmentSubmission(dto.assignmentSubmissionId)
        .build();        
      }
      else if(dto.notificationType == NotificationTypeEnum.SubmitAssignmentSubmission){
        notification = NotificationBuilder
        .fromSystem()
        .forUserId(jwt.userId)
        .withNotificationType(dto.notificationType)
        .withMessage(dto.message)
        .forAssignmentSubmission(dto.assignmentSubmissionId)
        .build();        
      }
      else if(dto.notificationType == NotificationTypeEnum.WarningDeadline){
        notification = NotificationBuilder
        .fromSystem()
        .forUserId(jwt.userId)
        .withNotificationType(dto.notificationType)
        .withMessage(dto.message)
        .forAssignmentSubmission(dto.assignmentSubmissionId)
        .build();        
      }else{
        notification = NotificationBuilder
        .fromSystem()
        .forUserId(jwt.userId)
        .withNotificationType(dto.notificationType)
        .withMessage(dto.message)
        .forAssignmentSubmission(dto.assignmentSubmissionId)
        .build();   
      }
           
      

      var noti = await AppDataSource.manager.save(notification);
            
      return NextResponse.json(ResponseFactory.success(noti),{status: 200});
    
    



  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }
}