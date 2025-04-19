import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { AssignmentSubmission } from "@/entities/AssignmentSubmission";
import { headers } from "next/headers";
import { verifyToken } from "@/utils/verifyToken";

export async function GET(req: NextRequest) {
  try {
    const assignmentIdParam = req.nextUrl.searchParams.get("assignmentId");
    const courseIdParam = req.nextUrl.searchParams.get("courseId");
    if (!assignmentIdParam || !courseIdParam) {
      return NextResponse.json(
        ResponseFactory.error(
          "Missing assignmentId or courseId parameter",
          "BAD_REQUEST"
        ),
        { status: 400 }
      );
    }

    const authorization = (await headers()).get("authorization");
    var jwt = verifyToken(authorization!);
    if (jwt == null) {
      return NextResponse.json(
        ResponseFactory.error("Unauthorize access", "Unauthorize"),
        { status: 401 }
      );
    }

    const assignmentId = parseInt(assignmentIdParam);

    await initializeDataSource();

    const repo = AppDataSource.getRepository(AssignmentSubmission);

    // Query submissions พร้อมดึง username
    const submissions = await repo.find({
      where: {
        assignment: {
          id: assignmentId,
          courseId: parseInt(courseIdParam),
        },
      },
      relations: ["assignment", "user", "studentGroup", "grade"],
      select: {
        id: true,
        assignment: { id: true, title: true },
        user: { id: true, name: true },
        studentGroup: { id: true, name: true },
        grade: { id: true, score: true },
        fileLink: true,
        isSubmit: true,
        submittedAt: true,
        createdDate: true,
        updatedDate: true,
      },
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

    return NextResponse.json(ResponseFactory.success(submissions), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      ResponseFactory.error("An unexpected error occurred", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
