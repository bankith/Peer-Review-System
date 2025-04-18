import { NextRequest, NextResponse } from "next/server";
 import { ResponseFactory } from "@/utils/ResponseFactory";
 import { AppDataSource, initializeDataSource } from "@/data-source";
 import { PeerReviewSubmission } from "@/entities/PeerReviewSubmission";
 export async function POST(req: NextRequest) {
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
 
       // สร้างข้อมูล PeerReviewSubmission
       const peerReviewSubmissions = taskReviewerMapping.flatMap((task: any) => {
         return task.reviewers.map((reviewer: any) => {
          const isGroupAssignment = assignmentType === "Group";
           const isGroupReviewer = reviewerType === 1; // 1 = Group, 2 = Individual
 
           return repo.create({
             peerReviewId: peerReviewId,
             reviewee: isGroupAssignment ? 0 : { id: task.taskId }, // ถ้าเป็น Individual ใส่ taskId ที่ reviewee
             revieweeGroup: isGroupAssignment ? { id: task.taskId } : 0, // ถ้าเป็น Group ใส่ taskId ที่ revieweeGroup
             reviewer: isGroupReviewer ? 0 : { id: reviewer.reviewer.id }, // ถ้าเป็น Individual ใส่ reviewer
             reviewerGroup: isGroupReviewer ? { id: reviewer.reviewer.id } : 0, // ถ้าเป็น Group ใส่ reviewerGroup
             reviewScore: 0, // ค่าเริ่มต้นสำหรับ reviewScore
             isSubmit: false, // ค่าเริ่มต้นสำหรับ isSubmit
           });
         });
       });
 
       // บันทึกข้อมูลลงในฐานข้อมูล
       const savedSubmissions = await repo.save(peerReviewSubmissions);
 
       return NextResponse.json(
         ResponseFactory.success(
           savedSubmissions,     
         ),
         { status: 201 }
       );
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