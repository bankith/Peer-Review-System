import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { PeerReview } from "@/entities/PeerReview";
import { headers } from "next/headers";
import { verifyToken } from "@/utils/verifyToken";

export async function POST(req: NextRequest) {
  try {
    const authorization = (await headers()).get("authorization");
    var jwt = verifyToken(authorization!);
    if (jwt == null) {
      return NextResponse.json(
        ResponseFactory.error("Unauthorize access", "Unauthorize"),
        { status: 401 }
      );
    }

    // อ่านข้อมูลจาก request body
    const body = await req.json();

    const {
      assignmentId,
      peerReviewTitle,
      outDate,
      dueDate,
      numberOfReviewers,
      peerReviewType,
      reviewerType,
      reviewMethod,
      anonymousReviewer,
      anonymousReviewee,
    } = body;

    // ตรวจสอบว่าข้อมูลที่จำเป็นครบถ้วน
    if (
      !assignmentId ||
      !peerReviewTitle ||
      !outDate ||
      !dueDate ||
      numberOfReviewers === undefined ||
      peerReviewType === undefined ||
      reviewerType === undefined ||
      reviewMethod === undefined ||
      anonymousReviewer === undefined ||
      anonymousReviewee === undefined
    ) {
      return NextResponse.json(
        ResponseFactory.error("Missing required fields", "BAD_REQUEST"),
        { status: 400 }
      );
    }

    // Initialize DataSource
    await initializeDataSource();

    // สร้าง repository สำหรับ PeerReview
    const repo = AppDataSource.getRepository(PeerReview);

    // สร้าง entity ใหม่
    const newPeerReview = repo.create({
      assignmentId,
      name: peerReviewTitle,
      outDate: new Date(outDate),
      dueDate: new Date(dueDate),
      maxReviewer: numberOfReviewers,
      peerReviewType,
      reviewerType,
      reviewMethod,
      isReviewerAnonymous: anonymousReviewer,
      isRevieweeAnonymous: anonymousReviewee,
    });

    // บันทึกข้อมูลลงในฐานข้อมูล
    const savedPeerReview = await repo.save(newPeerReview);

    // ส่ง response กลับ
    return NextResponse.json(ResponseFactory.success(savedPeerReview), {
      status: 201,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error); // Log ข้อผิดพลาด
      return NextResponse.json(
        ResponseFactory.error(error.message, "INTERNAL_ERROR"),
        { status: 500 }
      );
    }
    console.error("Unknown Error:", error); // Log ข้อผิดพลาดที่ไม่รู้จัก
    return NextResponse.json(
      ResponseFactory.error("An unexpected error occurred", "UNKNOWN_ERROR"),
      { status: 500 }
    );
  }
}
