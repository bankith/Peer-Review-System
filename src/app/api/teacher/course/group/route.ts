import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { StudentGroup } from "@/entities/StudentGroup";
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

      const repo = AppDataSource.getRepository(StudentGroup);

      const group = await repo
        .createQueryBuilder("studentGroup")
        .innerJoinAndSelect("studentGroup.course", "course")
        .where("course.id = :courseId", { courseId })
        .getMany();

      if (!group || group.length === 0) {
        return NextResponse.json(
          ResponseFactory.error(
            "No group found for the given courseId",
            "NOT_FOUND"
          ),
          { status: 404 }
        );
      }

      return NextResponse.json(ResponseFactory.success(group), {
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
