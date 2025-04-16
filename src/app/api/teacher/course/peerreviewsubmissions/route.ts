import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { PeerReviewSubmission } from "@/entities/PeerReviewSubmission";

export async function GET(req: NextRequest) {
  try {
    const idParam = req?.nextUrl?.searchParams.get("peerReviewId");
    if (idParam != null) {
      const peerReviewId = parseInt(idParam);
      await initializeDataSource();

      const repo = AppDataSource.getRepository(PeerReviewSubmission);

      const peerReviewSubmissions = await repo
        .createQueryBuilder("peerReviewSubmission")
        .leftJoinAndSelect("peerReviewSubmission.peerReview", "peerReview")
        .leftJoinAndSelect("peerReviewSubmission.reviewer", "reviewer")
        .leftJoinAndSelect("peerReviewSubmission.reviewee", "reviewee")
        .leftJoinAndSelect(
          "peerReviewSubmission.reviewerGroup",
          "reviewerGroup"
        )
        .leftJoinAndSelect(
          "peerReviewSubmission.revieweeGroup",
          "revieweeGroup"
        )
        .leftJoinAndSelect("peerReviewSubmission.comments", "comments")
        .leftJoinAndSelect("peerReviewSubmission.grade", "grade")
        .where("peerReviewSubmission.peerReviewId = :peerReviewId", {
          peerReviewId,
        })
        .getMany();

      if (!peerReviewSubmissions || peerReviewSubmissions.length === 0) {
        return NextResponse.json(
          ResponseFactory.error(
            "No Peer Review Submissions found for the given peerReviewId",
            "NOT_FOUND"
          ),
          { status: 404 }
        );
      }

      return NextResponse.json(ResponseFactory.success(peerReviewSubmissions), {
        status: 200,
      });
    }

    return NextResponse.json(
      ResponseFactory.error("Missing peerReviewId parameter", "BAD_REQUEST"),
      { status: 400 }
    );
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
