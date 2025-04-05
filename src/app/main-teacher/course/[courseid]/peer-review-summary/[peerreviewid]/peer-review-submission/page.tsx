"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PeerReviewSubmissionTable } from "@/components/Tables/peer-review-submission-table";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";

const PeerReviewSubmissionSummary = () => {
  const params = useParams();
  const { courseid, peerreviewid } = params;
  const [courseId, setCourseId] = useState(courseid);
  const [peerReviewId, setPeerReviewId] = useState(peerreviewid);
  const [peerReviewSubmissionTable, setSubmissionTable] = useState<React.ReactNode>();

  const getPeerReviewSubmissionsData = async () => {
    try {
      const response = await fetch(
        `/api/teacher/peerreviewsubmissions?courseId=${courseId}&peerReviewId=${peerReviewId}`
      );
      const data = await response.json();
      const getPeerReviewSubmissionsData = data.data;

      if (!Array.isArray(getPeerReviewSubmissionsData) || getPeerReviewSubmissionsData.length === 0) {
        console.error("getPeerReviewSubmissionsData is not a valid array:", getPeerReviewSubmissionsData);
        setSubmissionTable(undefined);
        return;
      }

      const transformedData = getPeerReviewSubmissionsData.map((item: any) => ({
        id: item.id.toString(),
        assignmentName: item.name,
        courseId: item.__assignment__?.courseId || null,
        assignmentId: item.__assignment__?.id || null,
        dueDate: item.outDate,
        createPeerReview: !item.isCreateReview,
      }));

      setSubmissionTable(
        <PeerReviewSubmissionTable
          data={transformedData}
          courseId={courseid?.toString()}
          peerReviewId={peerreviewid?.toString()}
        />
      );
    } catch (error) {
      console.error("Error fetching peer review data:", error);
    }
  };

  useEffect(() => {
    if (courseId) {
      getPeerReviewSubmissionsData();
    }
  }, [courseId]);

  return (
    <>
      <BreadcrumbTeacher pageName="Summary" pageMain="Subject" />

      <div className="space-y-10">
        {peerReviewSubmissionTable}
      </div>
    </>
  );
};

export default PeerReviewSubmissionSummary;

