import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { Assignment } from "@/entities/Assignment";
import { GroupMember } from "@/entities/GroupMember";
import { verifyToken } from '@/utils/verifyToken';
import { headers } from 'next/headers';
import { Brackets } from "typeorm";

export async function GET(req: NextRequest) {
  try {
    const idParam = req?.nextUrl?.searchParams.get("courseId");
    if (idParam != null) {
      const authorization = (await headers()).get('authorization')
      console.log("authorization: " + authorization);
      var jwt = verifyToken(authorization!);
      console.log("jwt: " + jwt);
      if(jwt == null){
        return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
      }
      const courseId = parseInt(idParam);
      await initializeDataSource();

      const repo = AppDataSource.getRepository(Assignment);
      const repoGroupMember = AppDataSource.getRepository(GroupMember);

      const userId = jwt.userId;
      const userGroupId = await repoGroupMember
        .createQueryBuilder("groupMember")
        .where("groupMember.userId = :userId", { userId })
        .select("groupMember.groupId")
        .getMany();
      
      const userGroups = userGroupId.map(item => item.groupId);

      const assignments = await repo
        .createQueryBuilder("assignment")
        .leftJoinAndSelect("assignment.peerReview", "peerReview")
        .leftJoinAndSelect("assignment.submissions", "submissions")    
        .where("assignment.courseId = :courseId", { courseId })
        .andWhere("submissions.studentGroupId IN (:...userGroups)", { userGroups: userGroups })
        .select([
          "assignment.id",
          "assignment.title",
          "assignment.description",
          "assignment.courseId",
          "assignment.assignmentType",
          "assignment.outDate",
          "assignment.dueDate",
          "peerReview.id", 
          "submissions.isSubmit", 
        ])
        .getMany();

      if (!assignments || assignments.length === 0) {
        return NextResponse.json(
          ResponseFactory.error(
            "No assignments found for the given courseId of the user",
            "NOT_FOUND"
          ),
          { status: 404 }
        );
      }

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
