import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { PeerReview } from "@/entities/PeerReview";

export async function GET(req: NextRequest) {
  try {
    const idParam = req?.nextUrl?.searchParams.get("id");
    if (idParam != null) {
      const peerReviewId = parseInt(idParam);
      await initializeDataSource();

      const repo = AppDataSource.getRepository(PeerReview);

      // Join กับ Assignment และกรองด้วย courseId
      const peerReview = await repo
        .createQueryBuilder("peerReview")
        .leftJoinAndSelect("peerReview.assignment", "assignment")
        .where("peerReview.id = :id", { id: peerReviewId }) // เปลี่ยนเงื่อนไขการกรอง
        .getOne();

      if (!peerReview) {
        return NextResponse.json(
          ResponseFactory.error(
            "No Peer Review found for the given id",
            "NOT_FOUND"
          ),
          { status: 404 }
        );
      }

      return NextResponse.json(ResponseFactory.success(peerReview), {
        status: 200,
      });
    }

    return NextResponse.json(
      ResponseFactory.error("Missing courseId parameter", "BAD_REQUEST"),
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
