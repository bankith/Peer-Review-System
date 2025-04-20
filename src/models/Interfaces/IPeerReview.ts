import { AssignmentSubmissionDto } from "@/dtos/Assignment/AssignmentSubmissionDto";
import { AddCommentDto } from "@/dtos/PeerReview/AddComment/AddNotificationDto";
import { AddCommentAndScoreDto } from "@/dtos/PeerReview/AddCommentAndScore/AddCommentAndScoreDto";
import { AxiosResponse } from "axios";

export interface IPeerReview {
    GetPeerReviewForReviewer(peerReviewSubmissionId: number): Promise<AxiosResponse>;
    AddCommentForPeerReviewer(peerReviewSubmissionId: number, comment: string): Promise<AxiosResponse>;
    AddCommentAndScore(peerReviewSubmissionId: number, comment: string, score: number): Promise<AxiosResponse>;    

    GetPeerReviewForReviewee(peerReviewId: number): Promise<AxiosResponse>;
    AddCommentForPeerReviewee(addCommentDto: AddCommentDto): Promise<AxiosResponse>;
}
