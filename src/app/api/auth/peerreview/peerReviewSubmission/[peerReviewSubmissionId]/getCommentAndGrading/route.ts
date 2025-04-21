import { NextRequest, NextResponse } from "next/server";
import { User, UserRoleEnum } from "@/entities/User";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { PeerReviewSubmission } from "@/entities/PeerReviewSubmission";
import { verifyToken } from '@/utils/verifyToken';
import { headers } from 'next/headers';
import { Course, CourseTermEnum } from '@/entities/Course';
import GroupedCourse from '@/models/Response/GroupedCourseResponse';
import { Brackets } from "typeorm";
import { plainToInstance } from "class-transformer";
import { AddCommentDto } from "@/dtos/PeerReview/AddComment/AddNotificationDto";
import { validate } from "class-validator";
import { PeerReviewComment } from "@/entities/PeerReviewComment";
import { AddCommentAndScoreDto } from "@/dtos/PeerReview/AddCommentAndScore/AddCommentAndScoreDto";
import { PeerReviewGrading } from "@/entities/PeerReviewGrading";
import { PeerReviewCommentDto } from "@/dtos/PeerReview/Comment/PeerReviewCommentDto";

export async function GET(req: NextRequest, { params }: { params: { peerReviewSubmissionId: string } }) {
  try {
    
    const submissionId = Number((await params).peerReviewSubmissionId);
    if (Number.isNaN(submissionId)) {
      return NextResponse.json(ResponseFactory.error("Bad Request", 'Bad Request'), {status: 400});    
    }
    const authorization = (await headers()).get('authorization')
    var jwt = verifyToken(authorization!);
    if(jwt == null){
      return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
    }    
    
    await initializeDataSource();

    var peerReviewGrading = await AppDataSource.getRepository(PeerReviewGrading)
    .createQueryBuilder("PeerReviewGrading")
    .leftJoinAndSelect("PeerReviewGrading.gradedBy", "gradedBy")
    .leftJoinAndSelect("gradedBy.studentProfile", "studentProfile")
    .leftJoinAndSelect("gradedBy.instructorProfile", "instructorProfile")
    .leftJoinAndSelect("PeerReviewGrading.peerReviewSubmission", "peerReviewSubmission")
    .where("peerReviewSubmission.id = :id", {id: submissionId})
    .andWhere("gradedBy.id = :userId", {userId: jwt.userId})
    .getOne();

    var commentDto = new PeerReviewCommentDto();
    if(peerReviewGrading){      
      commentDto.score = peerReviewGrading.score;
      commentDto.comment = peerReviewGrading.comment;      
      commentDto.user = await peerReviewGrading.gradedBy;            
      commentDto.createdDate = peerReviewGrading.createdDate;
      if(commentDto.user.role == UserRoleEnum.student){
        commentDto.profilePictureUrl = (await peerReviewGrading.gradedBy).studentProfile.picture;
      }else{
        commentDto.profilePictureUrl = (await peerReviewGrading.gradedBy).instructorProfile.picture;
      }      
    }

    return NextResponse.json(ResponseFactory.success(commentDto), {status: 200});   
  } catch (error) {
    console.log(error)
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
