import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { Assignment } from "@/entities/Assignment";
import { headers } from "next/headers";
import { verifyToken } from "@/utils/verifyToken";

export async function GET(req: NextRequest) {
  try {
    const idParam = req?.nextUrl?.searchParams.get("assignmentId");
    if (idParam != null) {
      const assignmentId = parseInt(idParam);
      const authorization = (await headers()).get("authorization");
      var jwt = verifyToken(authorization!);
      if (jwt == null) {
        return NextResponse.json(
          ResponseFactory.error("Unauthorize access", "Unauthorize"),
          { status: 401 }
        );
      }
      await initializeDataSource();

      const repo = AppDataSource.getRepository(Assignment);
      var assignment = await repo.findOne({
        where: {
          id: assignmentId,
        },
      });

      if (!assignment) {
        return NextResponse.json(
          ResponseFactory.error(
            "No assignment found for the given assignment id",
            "NOT_FOUND"
          ),
          { status: 404 }
        );
      }

      return NextResponse.json(ResponseFactory.success(assignment), {
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
