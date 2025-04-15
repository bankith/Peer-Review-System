import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { GroupMember } from "@/entities/GroupMember";

export async function GET(req: NextRequest) {
  try {
    const userIdParam = req?.nextUrl?.searchParams.get("userId");
    if (userIdParam != null) {
      const userId = parseInt(userIdParam);
      await initializeDataSource();

      const repo = AppDataSource.getRepository(GroupMember);

      const groupMember = await repo.findOne({
        where: {
          user: { id: userId },
        },
      });

      // หากไม่พบ groupMember ให้ส่ง 0
      if (!groupMember) {
        return NextResponse.json(
          ResponseFactory.success(0),
          { status: 200 }
        );
      }

      // ส่ง groupMemberId กลับ
      return NextResponse.json(
        ResponseFactory.success(groupMember.id),
        { status: 200 }
      );
    }

    return NextResponse.json(
      ResponseFactory.error("Missing userId parameter", "BAD_REQUEST"),
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
