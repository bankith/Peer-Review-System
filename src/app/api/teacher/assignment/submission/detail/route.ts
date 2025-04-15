import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { AssignmentSubmission } from "@/entities/AssignmentSubmission";

export async function GET(req: NextRequest) {
  try {
    const assignmentIdParam = req.nextUrl.searchParams.get("assignmentId");

    if (!assignmentIdParam) {
      return NextResponse.json(
        ResponseFactory.error("Missing assignmentId parameter", "BAD_REQUEST"),
        { status: 400 }
      );
    }

    const assignmentId = parseInt(assignmentIdParam);

    await initializeDataSource();

    const repo = AppDataSource.getRepository(AssignmentSubmission);

    const submissions = await repo.find({
      where: {
        assignment: { id: assignmentId },
      },
      relations: ["assignment", "user", "studentGroup", "grade"], // ดึงข้อมูล relations ที่เกี่ยวข้อง
    });

    if (!submissions || submissions.length === 0) {
      return NextResponse.json(
        ResponseFactory.error(
          "No submissions found for the given assignmentId",
          "NOT_FOUND"
        ),
        { status: 404 }
      );
    }

    return NextResponse.json(
      ResponseFactory.success(
        submissions,
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      ResponseFactory.error("An unexpected error occurred", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}