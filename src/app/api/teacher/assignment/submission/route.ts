import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { Assignment } from "@/entities/Assignment";

export async function POST(req: NextRequest) {
  try {
    // อ่านข้อมูลจาก request body
    const body = await req.json();
    const {
      title,
      courseId,
      type,
      description,
      outDate,
      dueDate,
      question,
    } = body;

    if (!title || !outDate || !dueDate || !question || !courseId || !description || !type) {
      return NextResponse.json(
        ResponseFactory.error("Missing required fields", "BAD_REQUEST"),
        { status: 400 }
      );
    }

    // Initialize DataSource
    await initializeDataSource();

    // สร้าง repository สำหรับ PeerReview
    const repo = AppDataSource.getRepository(Assignment);

    // สร้าง entity ใหม่
    const newAssignment = repo.create({
      title,
      description,
      courseId,
      assignmentType: type,
      outDate: new Date(outDate),
      dueDate: new Date(dueDate),
      question: question,
    });
   
     const savedAssignment = await repo.save(newAssignment);
    return NextResponse.json(
      ResponseFactory.success(
        savedAssignment,     
      ),
      { status: 201 }
    );
    
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
