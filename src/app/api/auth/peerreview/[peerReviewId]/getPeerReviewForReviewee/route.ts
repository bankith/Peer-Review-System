import { NextRequest, NextResponse } from "next/server";
import { User, UserRoleEnum } from "@/entities/User";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { PeerReviewSubmission } from "@/entities/PeerReviewSubmission";
import { verifyToken } from '@/utils/verifyToken';
import { headers } from 'next/headers';
import { Course, CourseTermEnum } from '@/entities/Course';
import GroupedCourse from '@/models/Response/GroupedCourseResponse';
import { Brackets } from "typeorm";
import { PeerReviewSubmissionForReviewDto } from "@/dtos/PeerReview/PeerReviewSubmission/PeerReviewSubmissionForReviewDto";
import { AssignmentSubmission } from "@/entities/AssignmentSubmission";
import { AssignmentTypeEnum } from "@/entities/Assignment";
import { PeerReview, PeerReviewTypeEnum, ReviewerTypeEnum } from "@/entities/PeerReview";
import { PeerReviewSubmissionForRevieweeDto } from "@/dtos/PeerReview/PeerReviewSubmissionForRevieweeDto";
import { StudentProfile } from "@/entities/StudentProfile";
import { StudentGroup } from "@/entities/StudentGroup";
import { GroupMember } from "@/entities/GroupMember";
import { PeerReviewSubmissionDataDto } from "@/dtos/PeerReview/PeerReviewSubmission/PeerReviewSubmissionDataDto";
import { PeerReviewComment } from "@/entities/PeerReviewComment";
import { PeerReviewCommentDto } from "@/dtos/PeerReview/Comment/PeerReviewCommentDto";

export async function GET(req: NextRequest, { params }: { params: { peerReviewId: string } }) {
  try {
    
    const peerReviewId = Number((await params).peerReviewId);
    if (Number.isNaN(peerReviewId)) {
      return NextResponse.json(ResponseFactory.error("Bad Request", 'Bad Request'), {status: 400});
    }
    const authorization = (await headers()).get('authorization')
    var jwt = verifyToken(authorization!);
    if(jwt == null){
      return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
    }    
    await initializeDataSource();

    const user = await AppDataSource.manager.findOneBy(User, { id: jwt.userId });
    if (!user) {
        return NextResponse.json(ResponseFactory.error('No user found', 'NO_USER_FOUND'), {status: 401});        
    }

    const currentPeerReview = await AppDataSource.manager.findOneByOrFail(PeerReview, { id: peerReviewId });
    
    var peerReviewSubmissions: PeerReviewSubmission[];
    if(currentPeerReview.reviewerType == ReviewerTypeEnum.Individual){
      peerReviewSubmissions = await AppDataSource
      .getRepository(PeerReviewSubmission)
      .createQueryBuilder("PeerReviewSubmission")
        .leftJoinAndSelect("PeerReviewSubmission.peerReview", "peerReview")
        .leftJoinAndSelect("PeerReviewSubmission.reviewer", "reviewer")        
        .leftJoinAndSelect("PeerReviewSubmission.reviewee", "reviewee")        
        .leftJoinAndSelect("PeerReviewSubmission.reviewerGroup", "reviewerGroup")
        .leftJoinAndSelect("PeerReviewSubmission.revieweeGroup", "revieweeGroup")
        .leftJoinAndSelect("PeerReviewSubmission.comments", "comments")
        .leftJoinAndSelect("comments.user", "user")
        .leftJoinAndSelect("user.groupMembers", "groupMember")
        .leftJoinAndSelect("groupMember.group", "group")
        .leftJoinAndSelect("user.studentProfile", "studentProfile")
        .leftJoinAndSelect("user.instructorProfile", "instructorProfile")
        .leftJoinAndSelect("peerReview.assignment", "assignment")
      .where("peerReview.id = :id", {id: peerReviewId})
      .andWhere("reviewee.id = :revieweeId", {revieweeId: jwt.userId})
      .getMany();
    }else{
      var group = await AppDataSource
      .getRepository(GroupMember)
      .createQueryBuilder("GroupMember")
      .leftJoinAndSelect("GroupMember.group", "studentGroup")        
      .where("GroupMember.userId = :id", { id: jwt.userId })
      .andWhere("studentGroup.courseId = :courseId", { courseId: (await currentPeerReview.assignment).courseId })
      .getOneOrFail()      
      var studentGroup = await group.group;
      
      peerReviewSubmissions = await AppDataSource
      .getRepository(PeerReviewSubmission)
      .createQueryBuilder("PeerReviewSubmission")
        .leftJoinAndSelect("PeerReviewSubmission.peerReview", "peerReview")
        .leftJoinAndSelect("PeerReviewSubmission.reviewer", "reviewer")        
        .leftJoinAndSelect("PeerReviewSubmission.reviewee", "reviewee")        
        .leftJoinAndSelect("PeerReviewSubmission.reviewerGroup", "reviewerGroup")
        .leftJoinAndSelect("PeerReviewSubmission.revieweeGroup", "revieweeGroup")
        .leftJoinAndSelect("PeerReviewSubmission.comments", "comments")
        .leftJoinAndSelect("comments.user", "user")
        .leftJoinAndSelect("user.groupMembers", "groupMember")
        .leftJoinAndSelect("groupMember.group", "group")
        .leftJoinAndSelect("user.studentProfile", "studentProfile")
        .leftJoinAndSelect("user.instructorProfile", "instructorProfile")
        .leftJoinAndSelect("peerReview.assignment", "assignment")
      .where("peerReview.id = :id", {id: peerReviewId})
      .andWhere("revieweeGroup.id = :revieweeGroupId", {revieweeGroupId: studentGroup.id})
      .getMany();
    }
                
    
    if (!peerReviewSubmissions || peerReviewSubmissions.length == 0) {
      return NextResponse.json(ResponseFactory.error("Not found this peerReviewSubmissions for this user", 'Not found'), {status: 500});    
    }

    var data = new PeerReviewSubmissionForReviewDto();
    data.peerReview = currentPeerReview;
    data.assignment = await data.peerReview.assignment;

    var reviewee = await peerReviewSubmissions[0].reviewee;
    var revieweeGroup = await peerReviewSubmissions[0].revieweeGroup;

    var assignmentSubmission = null;
    if(data.assignment.assignmentType == AssignmentTypeEnum.group){
      assignmentSubmission = await AppDataSource.getRepository(AssignmentSubmission)
      .createQueryBuilder("AssignmentSubmission")
      .leftJoinAndSelect("AssignmentSubmission.studentGroup", "studentGroup")
      .where("AssignmentSubmission.assignmentId = :id", {id: data.assignment.id})
      .andWhere("AssignmentSubmission.studentGroupId = :studentGroupId", {studentGroupId: revieweeGroup.id})
      .getOne();
    }else{
      assignmentSubmission = await AppDataSource.getRepository(AssignmentSubmission)
      .createQueryBuilder("AssignmentSubmission")
      .leftJoinAndSelect("AssignmentSubmission.user", "user")
      .where("AssignmentSubmission.assignmentId = :id", {id: data.assignment.id})
      .andWhere("AssignmentSubmission.userId = :userId", {userId: reviewee.id})
      .getOne();      
    }
    if(assignmentSubmission){
      data.assignmentSubmission = assignmentSubmission;
      if(data.assignment.assignmentType == AssignmentTypeEnum.group){
        data.assignmentGroupOwnerName = (await assignmentSubmission.studentGroup).name;
      }else{
        data.assignmentOwnerName = (await assignmentSubmission.user).name;
      }
    }
        
    for (let i = 0; i < peerReviewSubmissions.length; i++) {
      const peerReviewSubmission = peerReviewSubmissions[i];
      const peerReviewSubmissionDataDto: PeerReviewSubmissionDataDto = new PeerReviewSubmissionDataDto(); 
      peerReviewSubmissionDataDto.peerReviewSubmission = peerReviewSubmission;
      peerReviewSubmissionDataDto.reviewerGroupName = (await peerReviewSubmission.revieweeGroup)?.name;
      peerReviewSubmissionDataDto.reviewerName = (await peerReviewSubmission.reviewer)?.name;

      var comments = await peerReviewSubmission.comments;
      peerReviewSubmissionDataDto.commentsDto = [];
      for (let i = 0; i < comments.length; i++) {
        const comment: PeerReviewComment = comments[i];        
        var commentDto = new PeerReviewCommentDto();
        commentDto.comment = comment.comment;
        commentDto.commentId = comment.id;      
        commentDto.user = await comment.user;
        let gs: GroupMember[] = (await (await comment.user).groupMembers);
        var groupM = gs.find(async g => (await g.group).courseId == data.assignment.courseId);
        if(groupM){ 
          commentDto.groupId = (await groupM.group).id;
          commentDto.groupName = (await groupM.group).name;
        }
        
        commentDto.createdDate = comment.createdDate;
        if(commentDto.user.role == UserRoleEnum.student){
          commentDto.profilePictureUrl = (await comment.user).studentProfile.picture;
        }else{
          commentDto.profilePictureUrl = (await comment.user).instructorProfile.picture;
        }
        peerReviewSubmissionDataDto.commentsDto.push(commentDto);
      }
      data.peerReviewSubmissionDataDtoList.push(peerReviewSubmissionDataDto);      
    }
    
    return NextResponse.json(ResponseFactory.success(data), {status: 200});   
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
