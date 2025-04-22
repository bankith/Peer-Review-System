import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { Assignment } from "@/entities/Assignment";

export async function GET(req: NextRequest) {
  try {
    const idParam = req?.nextUrl?.searchParams.get("courseId");
    if (idParam != null) {
      const courseId = parseInt(idParam);
      await initializeDataSource();

      const repo = AppDataSource.getRepository(Assignment);

      const assignments = await repo
        .createQueryBuilder("assignment")
        .leftJoinAndSelect("assignment.peerReview", "peerReview")
        .where("assignment.courseId = :courseId", { courseId })
        .select([
          "assignment.id",
          "assignment.title",
          "assignment.description",
          "assignment.courseId",
          "assignment.assignmentType",
          "assignment.outDate",
          "assignment.dueDate",
          "peerReview.id", 
        ])
        .getMany();

      // if (!assignments || assignments.length === 0) {
      //   return NextResponse.json(
      //     ResponseFactory.error(
      //       "No assignments found for the given courseId",
      //       "NOT_FOUND"
      //     ),
      //     { status: 404 }
      //   );
      // }

      return NextResponse.json(ResponseFactory.success(assignments), {
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
