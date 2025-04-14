import { NotificationTypeEnum } from '@/entities/Notification';
import { IsEmail, Length } from 'class-validator';

export class AddNotificationDto {
    @Length(1, 1280)
    message: string;
    
    senderId: number;

    assignmentSubmissionId: number;

    peerReviewSubmissionId: number;

    isSystem: boolean;

    isInstructor: boolean;

    isStudent: boolean;

    notificationType: NotificationTypeEnum;
}
