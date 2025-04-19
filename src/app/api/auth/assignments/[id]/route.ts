import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { AssignmentSubmission } from "@/entities/AssignmentSubmission";
import { StudentGroup } from "@/entities/StudentGroup";
import { plainToInstance } from "class-transformer";
import { AssignmentSubmissionDto } from "@/dtos/Assignment/AssignmentSubmissionDto";
import { validate } from "class-validator";
import { headers } from "next/headers";
import { verifyToken } from "@/utils/verifyToken";
import { Assignment } from "@/entities/Assignment";
import { AssignmentDto } from "@/dtos/Assignment/AssignmentDto";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    
    const assignmentId = Number((await params).id);

    if (Number.isNaN(assignmentId)) {
      return NextResponse.json(ResponseFactory.error("Bad Request", 'Bad Request'), {status: 400});    
    }
    

    const authorization = (await headers()).get('authorization')      
    var jwt = verifyToken(authorization!);
    if(jwt == null){
      return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
    }
      
    await initializeDataSource();    

    const repo = AppDataSource.getRepository(Assignment);
    var assignment = await repo.findOne({
      where: {
        id: assignmentId,
      },
    });
    
    if (!assignment) {
      return NextResponse.json(ResponseFactory.error("No assignment found for the given assignment id","NOT_FOUND"),{status: 404});
    }

    let assignmentDTO = new AssignmentDto(assignment);

    return NextResponse.json(ResponseFactory.success(assignmentDTO),{status: 200 });
    
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error);
      return NextResponse.json(ResponseFactory.error(error.message, "INTERNAL_ERROR"),{status: 500});
    }
    console.error("Unknown Error:", error);
    return NextResponse.json(
      ResponseFactory.error("An unexpected error occurred", "UNKNOWN_ERROR"),{status: 500 });
  }
}
