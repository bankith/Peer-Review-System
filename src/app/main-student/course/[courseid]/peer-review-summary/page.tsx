"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PeerReviewTable } from "@/components/Tables/peer-review-table";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";
import { StudentModel } from "@/models/StudentModel";
import { AssignmentTableStudent } from "@/components/Tables/assignment-table-student";

const PeerReviewSummary = () => {
  const params = useParams();
  const { courseid } = params;
  const [courseId, setCourseId] = useState(courseid);
  const [assignmentTable, setAssignmentTable] = useState<React.ReactNode>();
  const [peerReviewTable, setPeerReviewTable] = useState<React.ReactNode>();

  const getAssignmentData = async () => {
    try {
      // const response = await fetch(
      //   `/api/student/assignments?courseId=${courseId}`
      // );
      const response = await StudentModel.instance.GetAssignmentByCourse(courseId + "");
      const assignmentData = response.data.data;
      console.log("assignmentData", assignmentData);
      if (!assignmentData || !Array.isArray(assignmentData) || assignmentData.length === 0) {
        console.log("assignmentData is not a valid array:", assignmentData);
        setAssignmentTable(undefined);
        return;
      }

      const transformedData = assignmentData.map((item: any) => ({
        id: item.id.toString(),
        assignmentName: item.title,
        assignmentId: item.id || null,
        courseId: item.courseId,
        peerReviewId: item.peerReview.id || null,
        dueDate: item.dueDate,
        createPeerReview: item.peerReview ? true : false,
        submitAssignment: item.submissions[0]?.isSubmit || null,
      }));
      console.log("transformedData", transformedData);
      setAssignmentTable(
        <AssignmentTableStudent
          data={transformedData}
          isPeerReview={false}
          isStudent={true}
          courseId={courseid?.toString()}
        />
      );
    } catch (error) {
      console.error("Error fetching assignment data:", error);
    }
  };
  const getPeerReviewSubmissionsData = async () => {
    try {
      const response = await StudentModel.instance.GetPeerReviewByCourse(parseInt(courseId + ""));
      const peerReviewSubmissionsData = response.data.data.peerReviewSubmissions;
      // console.log("peerreviewData", peerreviewData);
      
      if (!Array.isArray(peerReviewSubmissionsData) || peerReviewSubmissionsData.length === 0) {
        console.error("getPeerReviewSubmissionsData is not a valid array:", peerReviewSubmissionsData);
        setPeerReviewTable(undefined);
        return;
      }
      // console.log("peerreviewData", peerreviewData);
      const transformedData = peerReviewSubmissionsData.map((item: any) => ({
        id: item.id.toString(),
        assignmentName: item.__peerReview__.name,
        courseId: item.__peerReview__.__assignment__?.courseId || null,
        assignmentId: item.__peerReview__.__assignment__?.id || null,
        peerReviewId: item.__peerReview__.id || null,
        dueDate: item.__peerReview__.dueDate,
        createPeerReview: !item.__peerReview__.__assignment__.isCreateReview,
        submitPeerReview: item.isSubmit,
      }));

      setPeerReviewTable(
        <PeerReviewTable
          data={transformedData}
          isPeerReview={true}
          isStudent={true}
          courseId={courseid?.toString()}
        />
      );
    } catch (error) {
      console.error("Error fetching peer review data:", error);
    }
  };

  useEffect(() => {
    if (courseId) {
      getAssignmentData();
      getPeerReviewSubmissionsData();
    }
  }, [courseId]);

  return (
    <>
      <BreadcrumbTeacher
        pageMain="Course"
        pageMainLink="/main-student"
        pageName="Summary"
      />

      <div className="space-y-10">
        {assignmentTable}
        {peerReviewTable}
      </div>
    </>
  );
};

export default PeerReviewSummary;

