import { Assignment } from '@/entities/Assignment';
import { AssignmentSubmission } from '@/entities/AssignmentSubmission';
import { NotificationTypeEnum } from '@/entities/Notification';
import { PeerReview } from '@/entities/PeerReview';
import { PeerReviewComment } from '@/entities/PeerReviewComment';
import { PeerReviewSubmission } from '@/entities/PeerReviewSubmission';
import { IsEmail, Length } from 'class-validator';

export class PeerReviewSubmissionForReviewerDto {
    
    assignment: Assignment;
    assignmentSubmission: AssignmentSubmission;
    peerReview: PeerReview;
    peerReviewSubmission: PeerReviewSubmission;
    comments: PeerReviewComment[];

}
