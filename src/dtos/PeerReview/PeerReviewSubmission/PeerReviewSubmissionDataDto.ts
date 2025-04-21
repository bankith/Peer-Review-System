import { PeerReviewSubmission } from '@/entities/PeerReviewSubmission';
import { PeerReviewCommentDto } from '../Comment/PeerReviewCommentDto';

export class PeerReviewSubmissionDataDto {
    
    reviewerName: string;
    reviewerGroupName: string;
    peerReviewSubmission: PeerReviewSubmission;
    commentsDto: PeerReviewCommentDto[];

}
