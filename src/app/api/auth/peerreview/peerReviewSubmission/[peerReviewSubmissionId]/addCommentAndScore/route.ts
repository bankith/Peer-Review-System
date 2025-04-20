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

export async function POST(req: NextRequest, { params }: { params: { peerReviewSubmissionId: string } }) {
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

    const body = await req.json();
    const dto = plainToInstance(AddCommentAndScoreDto, body);  

    const errors = await validate(dto);
    if (errors.length > 0) {
        return NextResponse.json(ResponseFactory.error(errors.toString(), 'fail'), {status: 400});
    }
    await initializeDataSource();


    const currentPeerReviewSubmission = await AppDataSource.manager.findOneByOrFail(PeerReviewSubmission, { id: submissionId });
    currentPeerReviewSubmission.isSubmit = true;
    currentPeerReviewSubmission.reviewScore = dto.score;
    currentPeerReviewSubmission.updatedBy = jwt.userId;

    await AppDataSource.manager.save(currentPeerReviewSubmission);

    var peerReviewComment = new PeerReviewComment();
    peerReviewComment.comment = dto.message;
    peerReviewComment.peerReviewSubmissionId = submissionId;
    peerReviewComment.userId = jwt.userId;    
                
      const saveResult = await AppDataSource
        .getRepository(PeerReviewComment)
        .save(peerReviewComment);        
              
      return NextResponse.json(ResponseFactory.success(saveResult), {status: 200});
   

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
