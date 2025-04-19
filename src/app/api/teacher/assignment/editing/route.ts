import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { Assignment } from "@/entities/Assignment";
import { headers } from "next/headers";
import { verifyToken } from "@/utils/verifyToken";

export async function PUT(req: NextRequest) {
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
      title,
      courseId,
      type,
      description,
      outDate,
      dueDate,
      question,
      assignmentId,
    } = body;
    let assignmentType = 0;
    if (type == "group") {
      assignmentType = 1;
    } else if (type == "individual") {
      assignmentType = 2;
    } else {
      assignmentType = type;
    }
    if (
      !title ||
      !outDate ||
      !dueDate ||
      !question ||
      !courseId ||
      !description ||
      !assignmentType ||
      !assignmentId
    ) {
      return NextResponse.json(
        ResponseFactory.error("Missing required fields", "BAD_REQUEST"),
        { status: 400 }
      );
    }

    // Initialize DataSource
    await initializeDataSource();

    // สร้าง repository สำหรับ Assignment
    const repo = AppDataSource.getRepository(Assignment);

    // ค้นหา Assignment ที่ต้องการอัปเดต
    const assignment = await repo.findOne({
      where: {
        id: parseInt(assignmentId),
        courseId: parseInt(courseId),
      },
    });

    if (!assignment) {
      return NextResponse.json(
        ResponseFactory.error("Assignment not found", "NOT_FOUND"),
        { status: 404 }
      );
    }

    // อัปเดตข้อมูลใน Assignment
    // อัปเดตข้อมูลใน Assignment
    assignment.title = title;
    assignment.description = description;
    assignment.courseId = parseInt(courseId);
    assignment.assignmentType = assignmentType;
    assignment.outDate = new Date(outDate);
    assignment.dueDate = new Date(dueDate);
    assignment.question = question.reduce(
      (acc: any, curr: string, index: number) => {
        acc[`q${index + 1}`] = curr;
        return acc;
      },
      {}
    );

    // บันทึกข้อมูลที่อัปเดต
    const updatedAssignment = await repo.save(assignment);

    return NextResponse.json(ResponseFactory.success(updatedAssignment), {
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
