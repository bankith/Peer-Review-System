import { AssignmentSubmissionDto } from "@/dtos/Assignment/AssignmentSubmissionDto";
import { AddCommentDto } from "@/dtos/PeerReview/AddComment/AddNotificationDto";
import { AddCommentAndScoreDto } from "@/dtos/PeerReview/AddCommentAndScore/AddCommentAndScoreDto";
import { AxiosResponse } from "axios";

export interface IPeerReviewGrading {
    GetCommentAndGrading(peerReviewSubmissionId: number): Promise<AxiosResponse>;    
    AddCommentAndGrading(peerReviewSubmissionId: number, comment: string, score: number): Promise<AxiosResponse>;    
}
