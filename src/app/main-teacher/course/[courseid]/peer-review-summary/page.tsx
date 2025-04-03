"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PeerReviewTable } from "@/components/Tables/peer-review-table";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";

const PeerReviewSummary = () => {
  const params = useParams();
  const { courseid } = params;
  const [courseId, setCourseId] = useState(courseid);
  const [assignmentTable, setAssignmentTable] = useState<React.ReactNode>();
  const [peerReviewTable, setPeerReviewTable] = useState<React.ReactNode>();

  const getAssignmentData = async () => {
    try {
      const response = await fetch(
        `/api/teacher/assignments?courseId=${courseId}`
      );
      const data = await response.json();
      const assignmentData = data.data;

      if (!Array.isArray(assignmentData) || assignmentData.length === 0) {
        console.error("assignmentData is not a valid array:", assignmentData);
        setAssignmentTable(undefined);
        return;
      }

      const transformedData = assignmentData.map((item: any) => ({
        id: item.id.toString(),
        assignmentName: item.title,
        courseId: item.courseId,
        dueDate: item.outDate,
        createPeerReview: !item.isCreateReview,
      }));

      setAssignmentTable(
        <PeerReviewTable
          data={transformedData}
          isPeerReview={false}
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
        `/api/teacher/peerreviews?courseId=${courseId}`
      );
      const data = await response.json();
      const peerreviewData = data.data;

      if (!Array.isArray(peerreviewData) || peerreviewData.length === 0) {
        console.error("peerreviewData is not a valid array:", peerreviewData);
        setPeerReviewTable(undefined);
        return;
      }
      // console.log("peerreviewData", peerreviewData);
      const transformedData = peerreviewData.map((item: any) => ({
        id: item.id.toString(),
        assignmentName: item.name,
        courseId: item.__assignment__?.courseId || null,
        assignmentId: item.__assignment__?.id || null,
        dueDate: item.outDate,
        createPeerReview: !item.isCreateReview,
      }));

      setPeerReviewTable(
        <PeerReviewTable
          data={transformedData}
          isPeerReview={true}
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
      <BreadcrumbTeacher pageName="Summary" pageMain="Subject" />

      <div className="space-y-10">
        {assignmentTable}
        {peerReviewTable}
      </div>
    </>
  );
};

export default PeerReviewSummary;

