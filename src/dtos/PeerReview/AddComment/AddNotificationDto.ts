import { NotificationTypeEnum } from '@/entities/Notification';
import { IsEmail, Length } from 'class-validator';

export class AddCommentDto {
    @Length(1, 1280)
    message: string;    
}
