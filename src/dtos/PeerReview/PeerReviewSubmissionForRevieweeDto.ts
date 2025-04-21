import { Assignment } from '@/entities/Assignment';
import { AssignmentSubmission } from '@/entities/AssignmentSubmission';
import { NotificationTypeEnum } from '@/entities/Notification';
import { PeerReview } from '@/entities/PeerReview';
import { PeerReviewComment } from '@/entities/PeerReviewComment';
import { PeerReviewSubmission } from '@/entities/PeerReviewSubmission';
import { IsEmail, Length } from 'class-validator';
import { PeerReviewSubmissionForReviewDto } from './PeerReviewSubmission/PeerReviewSubmissionForReviewDto';

export class PeerReviewSubmissionForRevieweeDto {
    
    assignment: Assignment;
    assignmentSubmission: AssignmentSubmission;
    assignmentGroupOwnerName: string;
    assignmentOwnerName: string;

    peerReview: PeerReview;
    peerReviewSubmissions: PeerReviewSubmissionForReviewDto[];            
}
