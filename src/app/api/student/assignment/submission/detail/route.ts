import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { AssignmentSubmission } from "@/entities/AssignmentSubmission";

export async function GET(req: NextRequest) {
  try {
    const userIdParam = req.nextUrl.searchParams.get("userId");
    const assignmentIdParam = req.nextUrl.searchParams.get("assignmentId");
    console.log("userIdParam", userIdParam);
    console.log("assignmentIdParam", assignmentIdParam);
    if (!userIdParam || !assignmentIdParam) {
      return NextResponse.json(
        ResponseFactory.error("Missing required parameters", "BAD_REQUEST"),
        { status: 400 }
      );
    }

    const userId = parseInt(userIdParam);
    const assignmentId = parseInt(assignmentIdParam);

    await initializeDataSource();

    const repo = AppDataSource.getRepository(AssignmentSubmission);

    const submission = await repo.findOne({
      where: {
        user: { id: userId },
        assignment: { id: assignmentId },
      },
    });

    if (!submission) {
      return NextResponse.json(
        ResponseFactory.success(null),
        { status: 200 }
      );
    }

    return NextResponse.json(
      ResponseFactory.success(submission),
      { status: 200 }
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
