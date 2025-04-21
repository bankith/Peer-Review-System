import { NextRequest, NextResponse } from "next/server";
import { User, UserRoleEnum } from "@/entities/User";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { PeerReviewSubmission } from "@/entities/PeerReviewSubmission";
import { verifyToken } from '@/utils/verifyToken';
import { headers } from 'next/headers';
import { PeerReviewSubmissionForReviewerDto } from "@/dtos/PeerReview/PeerReviewSubmission/PeerReviewSubmissionForReviewerDto";
import { PeerReviewSubmissionForRevieweeDto } from "@/dtos/PeerReview/PeerReviewSubmissionForRevieweeDto";
import { GroupMember } from "@/entities/GroupMember";

export async function GET(req: NextRequest) {
  try {
    console.log("GET peerReviewSubmission")
    const courseId = req?.nextUrl?.searchParams.get("courseId");
    console.log("courseId: " + courseId);
    const isReviewer = req?.nextUrl?.searchParams.get("isReviewer");
    if (courseId == null || isReviewer == null) {
      return NextResponse.json(ResponseFactory.error("Bad Request", 'Bad Request'), {status: 400});
    }
    const authorization = (await headers()).get('authorization')
    var jwt = verifyToken(authorization!);
    if(jwt == null){
      return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
    }    
    await initializeDataSource();

    const userId = await AppDataSource.manager.findOneBy(User, { id: jwt.userId });
    if (!userId) {
        return NextResponse.json(ResponseFactory.error('No user found', 'NO_USER_FOUND'), {status: 401});        
    }
    
    console.log("userId: " + userId.id);
    var peerReviewSubmissions: PeerReviewSubmission[];
    const userGroupId = await AppDataSource.getRepository(GroupMember)
      .createQueryBuilder("groupMember")
      .where("groupMember.userId = :userId", { userId: userId.id })
      .getMany();  
    const userGroups = userGroupId.map(item => item.groupId);

    console.log("userGroups: " + userGroups);
    
    if(isReviewer == 'true'){
      console.log("GET Reviewer")
      peerReviewSubmissions = await AppDataSource
      .getRepository(PeerReviewSubmission)
      .createQueryBuilder("PeerReviewSubmission")
      .leftJoinAndSelect("PeerReviewSubmission.peerReview", "peerReview")
      .leftJoinAndSelect("PeerReviewSubmission.reviewer", "reviewer")        
      .leftJoinAndSelect("PeerReviewSubmission.reviewerGroup", "reviewerGroup")
      .leftJoinAndSelect("peerReview.assignment", "assignment")
      .where("reviewer.id = :reviewerId", {reviewerId: userId.id})
      .orWhere("reviewerGroup.id IN (:...userGroups)", { userGroups: userGroups })
      .getMany();
    }else{
      console.log("GET Reviewee")
      peerReviewSubmissions = await AppDataSource
      .getRepository(PeerReviewSubmission)
      .createQueryBuilder("PeerReviewSubmission")
      .leftJoinAndSelect("PeerReviewSubmission.peerReview", "peerReview")
      .leftJoinAndSelect("PeerReviewSubmission.reviewee", "reviewee")        
      .leftJoinAndSelect("PeerReviewSubmission.revieweeGroup", "revieweeGroup")
      .leftJoinAndSelect("peerReview.assignment", "assignment")
      .where("reviewee.id = :revieweeId", {revieweeId: userId.id})
      .orWhere("revieweeGroup.id IN (:...userGroups)", { userGroups: userGroups })
      .getMany();
    }
                
    
    console.log("peerReviewSubmissions: " + peerReviewSubmissions);
    if (!peerReviewSubmissions) {
      return NextResponse.json([]);    
    }

    return NextResponse.json(ResponseFactory.success({peerReviewSubmissions}), {status: 200});
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        ResponseFactory.error(error.message, "INTERNAL_ERROR"),
        { status: 500 }
      );
    }
    return NextResponse.json(
      ResponseFactory.error("An unexpected error occurred", "UNKNOWN_ERROR"),
      { status: 500 }
    );
  }
}
