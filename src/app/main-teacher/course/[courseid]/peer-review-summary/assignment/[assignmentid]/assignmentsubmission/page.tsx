"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AssignmentSubmissionTable } from "@/components/Tables/assignment-table";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";
import { InstructorModel } from "@/models/InstructorModel";
import { AssignmentConfigDto } from "@/dtos/Assignment/AssignmentConfig";

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
      const response = await InstructorModel.instance.GetAssignmentbyAssignmentId(Number(assignmentId));
      const assignmentData = response.data.data;
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
      if (!courseId || !assignmentId) {
        throw new Error("courseId or assignmentId is undefined");
      }
      const response = await InstructorModel.instance.GetAssignmentSubmissionDetail(courseId as string, assignmentId as string);
      const assignmentSubmissionData = response.data.data;
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

      const transformedData: AssignmentConfigDto[] = assignmentSubmissionData.map(
        (item: any) => new AssignmentConfigDto(item)
      );
      
      setAssignmentSubmissionTable(
        <AssignmentSubmissionTable
          data={transformedData}
          assignmentName={assignmentName}
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
        pageMainLink="/main-teacher"
        subMainPage="Assignment Sumbission"
        subMainPageLink={`/main-teacher/course/${courseId}/peer-review-summary/`}
        pageName={assignmentName}
      />

      <div className="space-y-10">{assignmentSubmissionTable}</div>
    </>
  );
};
export default AssignmentSubmission;
