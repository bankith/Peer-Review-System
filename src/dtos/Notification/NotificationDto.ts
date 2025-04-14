import { NotificationTypeEnum, Notification } from '@/entities/Notification';
import { IsEmail, Length } from 'class-validator';

export class NotificationDto {
    
    message: string;
    
    senderId: number;

    senderName: string;

    userId: number;

    assignmentSubmissionId: number;

    peerReviewSubmissionId: number;

    notificationType: NotificationTypeEnum;

    senderPicture: string;

    isRead: boolean;

    public constructor(notification: Notification){
        this.message = notification.message;
        this.senderId = notification.senderId;
        this.senderName = notification.senderName;
        this.userId = notification.userId;
        this.assignmentSubmissionId = notification.assignmentSubmissionId;
        this.peerReviewSubmissionId = notification.peerReviewSubmissionId;
        this.notificationType = notification.notificationType;
        this.senderPicture = notification.senderPicture;
        this.isRead = notification.isRead;
    }
}
