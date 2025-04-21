import { Assignment } from '@/entities/Assignment';
import { AssignmentSubmission } from '@/entities/AssignmentSubmission';
import { PeerReview } from '@/entities/PeerReview';
import { PeerReviewSubmission } from '@/entities/PeerReviewSubmission';
import { PeerReviewCommentDto } from '../Comment/PeerReviewCommentDto';
import { PeerReviewSubmissionDataDto } from './PeerReviewSubmissionDataDto';

export class PeerReviewSubmissionForReviewDto {
    
    assignment: Assignment;
    assignmentSubmission: AssignmentSubmission;
    assignmentGroupOwnerName: string;
    assignmentOwnerName: string;    
    peerReview: PeerReview;

    peerReviewSubmissionDataDtoList: PeerReviewSubmissionDataDto[] = [];
}
