import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { CourseEnrollment } from "@/entities/CourseEnrollment";
import { headers } from "next/headers";
import { verifyToken } from "@/utils/verifyToken";

export async function GET(req: NextRequest) {
  try {
    const idParam = req?.nextUrl?.searchParams.get("courseId");
    if (idParam != null) {
      const courseId = parseInt(idParam);
      const authorization = (await headers()).get("authorization");
      var jwt = verifyToken(authorization!);
      if (jwt == null) {
        return NextResponse.json(
          ResponseFactory.error("Unauthorize access", "Unauthorize"),
          { status: 401 }
        );
      }
      await initializeDataSource();

      const repo = AppDataSource.getRepository(CourseEnrollment);

      const enrollments = await repo
        .createQueryBuilder("courseEnrollment")
        .innerJoinAndSelect("courseEnrollment.course", "course") // JOIN กับ Course entity
        .innerJoinAndSelect("courseEnrollment.student", "student") // JOIN กับ User entity (student)
        .where("course.id = :courseId", { courseId }) // กรองด้วย courseId
        .getMany();

      if (!enrollments || enrollments.length === 0) {
        return NextResponse.json(
          ResponseFactory.error(
            "No enrollments found for the given courseId",
            "NOT_FOUND"
          ),
          { status: 404 }
        );
      }

      return NextResponse.json(ResponseFactory.success(enrollments), {
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
