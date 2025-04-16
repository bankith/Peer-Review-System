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
            isRead: false,
        },
      });    

      
      notifications.forEach(notification => {
        notification.isRead = true;        
      });
      await AppDataSource.manager.save(notifications);

      return NextResponse.json(ResponseFactory.success(null),{status: 200});
    



  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(ResponseFactory.error(error.message, 'INTERNAL_ERROR'), {status: 500});
    }    
      return NextResponse.json(ResponseFactory.error("An unexpected error occurred", 'UNKNOWN_ERROR'), {status: 500});
  }
}
