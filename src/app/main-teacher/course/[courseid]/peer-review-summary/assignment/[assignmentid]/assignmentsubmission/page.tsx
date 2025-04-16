"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AssignmentSubmissionTable } from "@/components/Tables/assignment-table";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";

const AssignmentSubmission = () => {
  const params = useParams();
  const { courseid, assignmentid } = params;
  const [courseId, setCourseId] = useState(courseid);
  const [assignmentId, setAssignmentId] = useState(assignmentid);
  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentSubmissionTable, setAssignmentSubmissionTable] =
    useState<React.ReactNode>();

  const getAssignmentTitle = async () => {
    try {
      const response = await fetch(
        `/api/teacher/assignment?assignmentId=${assignmentId}`
      );
      const data = await response.json();
      const assignmentData = data.data;
      console.log("assignmentData", assignmentData);
      if (!assignmentData || !assignmentData.title) {
        console.log("Assignment title not found:", assignmentData);
        setAssignmentName("");
        return;
      }
      setAssignmentName(assignmentData.title);
    }
    catch (error) {
      console.error("Error fetching assignment title:", error);
    }
  }
  const getAssignmentData = async () => {
    try {
      const response = await fetch(
        `/api/teacher/assignment/submission/detail?courseId=${courseId}&assignmentId=${assignmentId}`
      );
      const data = await response.json();
      const assignmentSubmissionData = data.data;
      console.log("assignmentSubmissionData", assignmentSubmissionData);
      if (
        !assignmentSubmissionData ||
        !Array.isArray(assignmentSubmissionData) ||
        assignmentSubmissionData.length === 0
      ) {
        console.log(
          "assignmentSubmissionData is not a valid array:",
          assignmentSubmissionData
        );
        setAssignmentSubmissionTable(undefined);
        return;
      }
      // setAssignmentName(assignmentSubmissionData[0].__assignment__.title);

      const transformedData = assignmentSubmissionData.map((item: any) => ({
        id: item.id.toString(),
        name:
          item.__assignment__.assignmentType === 1
            ? item.__studentGroup__.name
            : item.__user__.name,
        sumbitAccountId:
          item.__assignment__.assignmentType === 1
            ? item.__studentGroup__.id
            : item.__user__.id,
        assignmentId: assignmentId,
        assignmentName: item.__assignment__.title,
        courseId: courseId,
        submitDate: item.submittedAt,
      }));

      setAssignmentSubmissionTable(
        <AssignmentSubmissionTable
          data={transformedData}
        />
      );
    } catch (error) {
      console.error("Error fetching assignment data:", error);
    }
  };
  useEffect(() => {
    if (courseId) {
      getAssignmentTitle();
      getAssignmentData();
    }
  }, [courseId]);

  return (
    <>
      <BreadcrumbTeacher
        pageMain="Subject"
        pageMainLink="/main-teacher/course"
        subMainPage="Assignment Sumbission"
        subMainPageLink={`/main-teacher/course/${courseId}/peer-review-summary/`}
        pageName={assignmentName}
      />

      <div className="space-y-10">{assignmentSubmissionTable}</div>
    </>
  );
};
export default AssignmentSubmission;
