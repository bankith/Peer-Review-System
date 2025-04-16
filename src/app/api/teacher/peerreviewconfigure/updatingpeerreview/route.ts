import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { PeerReview } from "@/entities/PeerReview";

export async function PUT(req: NextRequest) {
  try {
    // อ่านข้อมูลจาก request body
    const body = await req.json();

    const {
      peerReviewId, // เพิ่ม peerReviewId สำหรับการอัปเดต
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
      !peerReviewId || // ตรวจสอบ peerReviewId
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

    // ค้นหา PeerReview ที่ต้องการอัปเดต
    const existingPeerReview = await repo.findOneBy({ id: peerReviewId });

    if (!existingPeerReview) {
      return NextResponse.json(
        ResponseFactory.error("PeerReview not found", "NOT_FOUND"),
        { status: 404 }
      );
    }

    // อัปเดตข้อมูลใน entity
    repo.merge(existingPeerReview, {
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

    // บันทึกข้อมูลที่อัปเดตลงในฐานข้อมูล
    const updatedPeerReview = await repo.save(existingPeerReview);

    // ส่ง response กลับ
    return NextResponse.json(ResponseFactory.success(updatedPeerReview), {
      status: 200,
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
