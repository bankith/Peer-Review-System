"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PeerReviewTable } from "@/components/Tables/peer-review-table";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";
import { StudentModel } from "@/models/StudentModel";

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
      const response = await StudentModel.instance.GetAssignmentByCourse(courseId);
      const assignmentData = response.data.data;
      // console.log("assignmentData", assignmentData);
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
        dueDate: item.dueDate,
        createPeerReview: item.peerReview ? true : false,
      }));

      setAssignmentTable(
        <PeerReviewTable
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
  const getPeerreviewData = async () => {
    try {
      const response = await fetch(
        `/api/student/peerreviews?courseId=${courseId}`
      );
      const data = await response.json();
      const peerreviewData = data.data;
      // console.log("peerreviewData", peerreviewData);
      if (
        !peerreviewData ||
        !Array.isArray(peerreviewData) ||
        peerreviewData.length === 0
      ) {
        console.log("peerreviewData is not a valid array:", peerreviewData);
        setPeerReviewTable(undefined);
        return;
      }
      // console.log("peerreviewData", peerreviewData);
      const transformedData = peerreviewData.map((item: any) => ({
        id: item.id.toString(),
        assignmentName: item.name,
        courseId: item.__assignment__?.courseId || null,
        assignmentId: item.__assignment__?.id || null,
        dueDate: item.dueDate,
        createPeerReview: !item.isCreateReview,
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
      getPeerreviewData();
    }
  }, [courseId]);

  return (
    <>
      <BreadcrumbTeacher
        pageMain="Course"
        pageMainLink="/main-student/course"
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

