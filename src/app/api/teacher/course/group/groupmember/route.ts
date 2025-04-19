import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { GroupMember } from "@/entities/GroupMember";
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

      const repo = AppDataSource.getRepository(GroupMember);

      const groupMembers = await repo
        .createQueryBuilder("groupMember")
        .innerJoinAndSelect("groupMember.group", "studentGroup") // Join กับ StudentGroup
        .innerJoinAndSelect("studentGroup.course", "course") // Join กับ Course
        .innerJoinAndSelect("groupMember.user", "user") // Join กับ User
        .where("course.id = :courseId", { courseId }) // กรองด้วย courseId
        .getMany();
      if (!groupMembers || groupMembers.length === 0) {
        return NextResponse.json(
          ResponseFactory.error(
            "No groupMembers found for the given courseId",
            "NOT_FOUND"
          ),
          { status: 404 }
        );
      }

      return NextResponse.json(ResponseFactory.success(groupMembers), {
        status: 200,
      });
    }

    return NextResponse.json(
      ResponseFactory.error("Missing courseId parameter", "BAD_REQUEST"),
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error); // เพิ่มการ log ข้อผิดพลาด
      return NextResponse.json(
        ResponseFactory.error(error.message, "INTERNAL_ERROR"),
        { status: 500 }
      );
    }
    console.error("Unknown Error:", error); // เพิ่มการ log ข้อผิดพลาดที่ไม่รู้จัก
    return NextResponse.json(
      ResponseFactory.error("An unexpected error occurred", "UNKNOWN_ERROR"),
      { status: 500 }
    );
  }
}
