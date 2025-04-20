import { NotificationTypeEnum } from '@/entities/Notification';
import { User } from '@/entities/User';
import { IsEmail, Length } from 'class-validator';

export class PeerReviewCommentDto {
    commentId: number;    
    user: User;
    profilePictureUrl: string;
    groupId: number;
    groupName: string;
    comment: string;
    createdDate: Date;
}
