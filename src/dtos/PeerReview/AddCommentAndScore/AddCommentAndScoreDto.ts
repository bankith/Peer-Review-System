import { NotificationTypeEnum } from '@/entities/Notification';
import { IsEmail, Length } from 'class-validator';

export class AddCommentAndScoreDto {
        
    message: string;    
    
    score: number;
}
