import { NotificationTypeEnum } from '@/entities/Notification';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class PeerReviewSubmissionSubmitCommentAndScoreDto {

    @IsNotEmpty()
    reviewScore: number;

    @Length(0, 1280)
    message: string;
}
