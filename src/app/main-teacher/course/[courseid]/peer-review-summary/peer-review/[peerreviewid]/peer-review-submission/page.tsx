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
        `/api/teacher/peerreviewsubmissions?peerReviewId=${peerReviewId}`
      );
      const data = await response.json();
      const getPeerReviewSubmissionsData = data.data.peerReviewSubmissions;
      const getPeerReviewName = data.data.peerReview.name;
      const getPeerReviewId = data.data.peerReview.id;
      const getReviewerType = data.data.peerReview.reviewerType;

      if (!Array.isArray(getPeerReviewSubmissionsData) || getPeerReviewSubmissionsData.length === 0) {
        console.log("getPeerReviewSubmissionsData is not a valid array:", getPeerReviewSubmissionsData);
        setSubmissionTable(undefined);
        return;
      }

      const transformedData = getPeerReviewSubmissionsData.map((item: any) => ({
        id: item.id.toString(),
        reviewer: item.__reviewerGroup__ != null && item.__peerReview__.reviewerType === 1
          ? item.__reviewerGroup__.name
          : item.__reviewer__ != null
            ? item.__reviewer__.name
            : null,
        reviewee: item.__revieweeGroup__ != null && item.__peerReview__.reviewerType === 1
          ? item.__revieweeGroup__.name
          : item.__reviewee__ != null
            ? item.__reviewee__.name
            : null,
        updatedDate: item.updatedDate,
        submitPeerReview: item.isSubmit,
      }));
      console.log("transformedData:", transformedData);
      setSubmissionTable(
        <PeerReviewSubmissionTable
          courseId={courseid + ""}
          data={transformedData}
          peerReviewId={getPeerReviewId}
          peerReviewName={getPeerReviewName}
          reviewerType={getReviewerType}
        />
      );
    } catch (error) {
      console.error("Error fetching peer review data:", error);
    }
  };

  useEffect(() => {
    if (peerReviewId) {
      getPeerReviewSubmissionsData();
    }
  }, [peerReviewId]);

  return (
    <>
      <BreadcrumbTeacher pageName="Peer Review Submission Summary" pageMain="Peer-Review" pageMainLink={`/main-teacher/course/${courseid}/peer-review-summary`} />

      <div className="space-y-10">
        {peerReviewSubmissionTable}
      </div>
    </>
  );
};

export default PeerReviewSubmissionSummary;

