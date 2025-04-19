import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { Assignment } from "@/entities/Assignment";
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
    const { title, courseId, type, description, outDate, dueDate, question } =
      body;

    if (
      !title ||
      !outDate ||
      !dueDate ||
      !question ||
      !courseId ||
      !description ||
      !type
    ) {
      return NextResponse.json(
        ResponseFactory.error("Missing required fields", "BAD_REQUEST"),
        { status: 400 }
      );
    }

    // Initialize DataSource
    await initializeDataSource();

    // สร้าง repository สำหรับ PeerReview
    const repo = AppDataSource.getRepository(Assignment);
    let assignmentType = 0;
    if (type == "group") {
      assignmentType = 1;
    } else if (type == "individual") {
      assignmentType = 2;
    } else {
      assignmentType = type;
    }
    // สร้าง entity ใหม่
    const newAssignment = repo.create({
      title,
      description,
      courseId,
      assignmentType: assignmentType,
      outDate: new Date(outDate),
      dueDate: new Date(dueDate),
      question: question.reduce((acc: any, curr: string, index: number) => {
        acc[`q${index + 1}`] = curr;
        return acc;
      }, {}),
    });

    const savedAssignment = await repo.save(newAssignment);
    return NextResponse.json(ResponseFactory.success(savedAssignment), {
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
