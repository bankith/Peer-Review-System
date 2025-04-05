import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { PeerReviewSubmission } from "@/entities/PeerReviewSubmission";

export async function GET(req: NextRequest) {
  try {
    const peerReviewIdParam = req?.nextUrl?.searchParams.get("peerReviewId");
    if (peerReviewIdParam != null) {
      const peerReviewId = parseInt(peerReviewIdParam);
      await initializeDataSource();

      const repo = AppDataSource.getRepository(PeerReviewSubmission);

      // Join กับ Assignment และกรองด้วย courseId
      const peerReviews = await repo
        .createQueryBuilder("PeerReviewSubmission")
        .getMany();

      if (!peerReviews || peerReviews.length === 0) {
        return NextResponse.json(
          ResponseFactory.error(
            "No Peer Reviews found for the given courseId",
            "NOT_FOUND"
          ),
          { status: 404 }
        );
      }

      return NextResponse.json(ResponseFactory.success(peerReviews), {
        status: 200,
      });
    }

    return NextResponse.json(
      ResponseFactory.error("Missing courseId or peerReviewId parameter", "BAD_REQUEST"),
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
