import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { PeerReviewSubmission } from "@/entities/PeerReviewSubmission";
import { User } from "@/entities/User";
import { StudentGroup } from "@/entities/StudentGroup";

export async function PUT(req: NextRequest) {
  try {
    const idParam = req?.nextUrl?.searchParams.get("peerReviewId");
    if (idParam != null) {
      const peerReviewId = parseInt(idParam);
      console.log("peerReviewId", peerReviewId);

      // อ่านข้อมูลจาก request body
      const body = await req.json();

      const { assignmentType, reviewerType, taskReviewerMapping } = body;

      // ตรวจสอบว่าข้อมูลที่จำเป็นครบถ้วน
      if (
        !peerReviewId ||
        !assignmentType ||
        !reviewerType ||
        !taskReviewerMapping
      ) {
        return NextResponse.json(
          ResponseFactory.error("Missing required fields", "BAD_REQUEST"),
          { status: 400 }
        );
      }

      // Initialize DataSource
      await initializeDataSource();

      // สร้าง repository สำหรับ PeerReviewSubmission
      const repo = AppDataSource.getRepository(PeerReviewSubmission);

      // อัปเดตข้อมูล PeerReviewSubmission
      const updatedSubmissions: PeerReviewSubmission[] = [];
      for (const task of taskReviewerMapping) {
        for (const reviewer of task.reviewers) {
          const isGroupAssignment = assignmentType === "Group";
          const isGroupReviewer = reviewerType === 1; // 1 = Group, 2 = Individual

          // ค้นหา PeerReviewSubmission ที่ตรงกับเงื่อนไข
          const existingSubmission = await repo.findOne({
            where: {
              peerReviewId: peerReviewId,
              ...(isGroupAssignment
                ? { revieweeGroup: { id: task.taskId } }
                : { reviewee: { id: task.taskId } }),
            },
            relations: [
              "reviewee",
              "revieweeGroup",
              "reviewer",
              "reviewerGroup",
            ],
          });

          if (existingSubmission) {
            // อัปเดตข้อมูลที่มีอยู่
            existingSubmission.reviewer = isGroupReviewer
              ? 0
              : await AppDataSource.getRepository(User).findOneBy({
                  id: reviewer.reviewer.id,
                });
            existingSubmission.reviewerGroup = isGroupReviewer
              ? await AppDataSource.getRepository(StudentGroup).findOneBy({
                  id: reviewer.reviewer.id,
                })
              : 0;

            updatedSubmissions.push(existingSubmission);
          } else {
            // สร้างข้อมูลใหม่หากไม่มีอยู่
            const newSubmission = repo.create({
              peerReviewId: peerReviewId,
              reviewee: isGroupAssignment
                ? 0
                : await AppDataSource.getRepository(User).findOneBy({
                    id: task.taskId,
                  }),
              revieweeGroup: isGroupAssignment
                ? await AppDataSource.getRepository(StudentGroup).findOneBy({
                    id: task.taskId,
                  })
                : 0,
              reviewer: isGroupReviewer
                ? 0
                : await AppDataSource.getRepository(User).findOneBy({
                    id: reviewer.reviewer.id,
                  }),
              reviewerGroup: isGroupReviewer
                ? await AppDataSource.getRepository(StudentGroup).findOneBy({
                    id: reviewer.reviewer.id,
                  })
                : 0,
              reviewScore: 0, // ค่าเริ่มต้นสำหรับ reviewScore
              isSubmit: false, // ค่าเริ่มต้นสำหรับ isSubmit
            });
            updatedSubmissions.push(newSubmission);
          }
        }
      }

      // บันทึกข้อมูลที่อัปเดตหรือสร้างใหม่ลงในฐานข้อมูล
      const savedSubmissions = await repo.save(updatedSubmissions);

      return NextResponse.json(ResponseFactory.success(savedSubmissions), {
        status: 200,
      });
    } else {
      return NextResponse.json(
        ResponseFactory.error("peerReviewId is missing", "BAD_REQUEST"),
        { status: 400 }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error);
      return NextResponse.json(
        ResponseFactory.error(error.message, "INTERNAL_ERROR"),
        { status: 500 }
      );
    }
    console.error("Unknown Error:", error);
    return NextResponse.json(
      ResponseFactory.error("An unexpected error occurred", "UNKNOWN_ERROR"),
      { status: 500 }
    );
  }
}
