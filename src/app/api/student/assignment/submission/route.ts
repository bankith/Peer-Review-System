import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { AssignmentSubmission } from "@/entities/AssignmentSubmission";
import { StudentGroup } from "@/entities/StudentGroup";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      courseId,
      assignmentId,
      answer,
      groupMemberId,
      submittedAt,
    } = body;

    if (!userId || !courseId || !assignmentId || !answer || !submittedAt) {
      return NextResponse.json(
        ResponseFactory.error("Missing required fields", "BAD_REQUEST"),
        { status: 400 }
      );
    }

    await initializeDataSource();

    const submissionRepo = AppDataSource.getRepository(AssignmentSubmission);
    const groupRepo = AppDataSource.getRepository(StudentGroup);

    // ตรวจสอบว่ามี AssignmentSubmission อยู่แล้วหรือไม่
    const existingSubmission = await submissionRepo.findOne({
      where: {
        assignment: { id: assignmentId },
        user: { id: userId },
      },
    });

    // โหลด StudentGroup จาก groupMemberId
    const studentGroup = groupMemberId
      ? await groupRepo.findOne({ where: { id: groupMemberId } })
      : null;

    if (existingSubmission) {
      // หากมีข้อมูลอยู่แล้ว ให้ทำการอัปเดต
      existingSubmission.answer = answer.reduce(
        (acc: any, curr: string, index: number) => {
          acc[`q${index + 1}`] = curr;
          return acc;
        },
        {}
      );
      existingSubmission.studentGroup = studentGroup || null;
      existingSubmission.submittedAt = new Date(submittedAt);

      // บันทึกการอัปเดต
      const updatedSubmission = await submissionRepo.save(existingSubmission);

      return NextResponse.json(
        ResponseFactory.success(
          updatedSubmission,
          "Submission updated successfully"
        ),
        { status: 200 }
      );
    } else {
      // หากไม่มีข้อมูล ให้ทำการสร้างใหม่
      const newSubmission = submissionRepo.create({
        user: { id: userId },
        courseId: courseId,
        assignment: { id: assignmentId },
        answer: answer.reduce((acc: any, curr: string, index: number) => {
          acc[`q${index + 1}`] = curr;
          return acc;
        }, {}),
        studentGroup: studentGroup || null,
        submittedAt: new Date(submittedAt),
      });

      // บันทึกข้อมูลใหม่
      const savedSubmission = await submissionRepo.save(newSubmission);

      return NextResponse.json(
        ResponseFactory.success(
          savedSubmission,
          "Submission created successfully"
        ),
        { status: 201 }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error);
      return NextResponse.json(
        ResponseFactory.error(error.message, "INTERNAL_ERROR"),
        { status: 500 }
      );
    }
    console.error("Unknown Error:", error);
    return NextResponse.json(
      ResponseFactory.error("An unexpected error occurred", "UNKNOWN_ERROR"),
      { status: 500 }
    );
  }
}
