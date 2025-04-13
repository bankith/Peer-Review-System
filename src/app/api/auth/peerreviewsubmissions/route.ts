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

export async function GET(req: NextRequest) {
  try {
    const authorization = (await headers()).get('authorization')
    const peerReviewIdParam = req?.nextUrl?.searchParams.get("peerReviewId");
    console.log("authorization: " + authorization);
    var jwt = verifyToken(authorization!);
    if(jwt == null){
      return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
    }
    if (peerReviewIdParam == null) {
      return NextResponse.json(ResponseFactory.error("Missing peerReviewId parameter", "BAD_REQUEST"), { status: 400 });
    }
    
    await initializeDataSource();
    
    console.log(jwt)

    if(jwt.role == UserRoleEnum.student){
      const peerReviewId = parseInt(peerReviewIdParam);
      const userId = jwt.userId;
      const peerReviewSubmissions = await AppDataSource
        .getRepository(PeerReviewSubmission)
        .createQueryBuilder("PeerReviewSubmission")
        .leftJoinAndSelect("PeerReviewSubmission.peerReview", "peerReview")        
        .leftJoinAndSelect("PeerReviewSubmission.reviewer", "reviewer")        
        .leftJoinAndSelect("PeerReviewSubmission.reviewee", "reviewee")        
        .where("PeerReviewSubmission.peerReviewId = :peerReviewId", {peerReviewId: peerReviewId})
        .andWhere(new Brackets(qb => {
          qb.where("reviewer.id = :userId", { userId: userId })
            .orWhere("reviewee.id = :userId", { userId: userId });
        }))
        .getMany();
      if (!peerReviewSubmissions || peerReviewSubmissions.length === 0) {
        return NextResponse.json(ResponseFactory.success({peerReviewSubmissions}), {status: 200});
      }
      var peerReview = await peerReviewSubmissions[0].peerReview;
      return NextResponse.json(ResponseFactory.success({peerReviewSubmissions, peerReview}), {status: 200});
    }else{
      const peerReviewId = parseInt(peerReviewIdParam);
      const peerReviewSubmissions = await AppDataSource
        .getRepository(PeerReviewSubmission)
        .createQueryBuilder("PeerReviewSubmission")
        .leftJoinAndSelect("PeerReviewSubmission.peerReview", "peerReview")        
        .leftJoinAndSelect("PeerReviewSubmission.reviewer", "reviewer")        
        .leftJoinAndSelect("PeerReviewSubmission.reviewee", "reviewee")        
        .where("PeerReviewSubmission.peerReviewId = :peerReviewId", {peerReviewId: peerReviewId})
        .getMany();       
      var peerReview = await peerReviewSubmissions[0].peerReview;
      return NextResponse.json(ResponseFactory.success({peerReviewSubmissions, peerReview}), {status: 200});
    }

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
