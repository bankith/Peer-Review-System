"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";
import { StudentModel } from "@/models/StudentModel";
import { AssignmentDto } from "@/dtos/Assignment/AssignmentDto";
import { AssignmentTypeEnum } from "@/entities/Assignment";


const SubmittingAssignmentPage = () => {
  const params = useParams<{ courseid: string; assignmentid: string }>();
  const router = useRouter();
  const { courseid, assignmentid } = params;
  const [loading, setLoading] = useState(false);
  
  
  const [assignmentName, setAssignmentName] = useState<string>("");
  const [assignmentType, setAssignmentType] = useState<AssignmentTypeEnum>();
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date>();
  const [question, setQuestion] = useState<string>();
  const [answer, setAnswer] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const submitAssignment = async () => {
    
    const payload = {
      userId: "12", // แทนด้วย userId จริงจากระบบ Authentication
      // courseId,
      // assignmentId,
      answer,
      // groupMemberId: groupMemberId || 0,
      submittedAt: new Date().toISOString(),
    };

    try {
      await fetch("/api/student/assignment/submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("Assignment submitted successfully.");
      // router.push(`/main-student/course/${courseId}/assignment-summary`);
    } catch (err) {
      console.error("Error submitting assignment:", err);
      setErrorMessage("Failed to submit assignment.");
    }
  };

  const getAssignmentData = async (assignmentid: Number) => {
    setLoading(true);
    StudentModel.instance.GetAssignment(assignmentid).then(response => {      
      setLoading(false);
      const assignmentDto = response.data.data as AssignmentDto;
      if (assignmentDto) {
        setAssignmentName(assignmentDto.title);
        setAssignmentType(assignmentDto.assignmentType);        
        setDescription(assignmentDto.description);
        setDueDate(assignmentDto.dueDate);
        if(assignmentDto.question){ setQuestion(assignmentDto.question.q1);}
      }
    })    
    .catch(err => {
      setLoading(false);
    }); 
  };

  // const getSubmissionData = async () => {
  //   const userId = "12"; // แทนด้วย userId จริงจากระบบ Authentication
  //   try {
  //     const response = await fetch(
  //       `/api/student/assignment/submission/detail?userId=${userId}&assignmentId=${assignmentId}`
  //     );
  //     const data = await response.json();
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch assignment data: ${response.status}`);
  //     }
  //     const submission = data.data;
  //     // console.log("submission", submission);
  //     if (submission.answer) {
  //       setAnswer(Object.values(submission.answer));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching submission data:", error);
  //   }
  // };

  useEffect(() => {
    if (assignmentid) {
      getAssignmentData(parseInt(assignmentid));      
      // getSubmissionData();
    }
  }, []);

  return (
    <>
      <BreadcrumbTeacher
        pageMain="Subject"
        pageMainLink="/main-student/course"
        subMainPage="Assignment Summary"
        subMainPageLink={`/main-student/course/${courseid}/assignment-summary`}
        pageName="Submit"
      />
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 rounded-lg">
        <h3 className="text-lg text-dark">
          To Submit Assignment fill in detail below
        </h3>
        <p className="text-gray-500 text-sm">Submit assignment Page</p>
      </div>
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 grid grid-cols-2 rounded-lg">
        <div>
          <p className="text-lg font-bold">{assignmentName}</p>
          <p className="text-primary">
            Due: {dueDate ? new Date(dueDate).toLocaleDateString() : "Not set"}
          </p>
          <p className="text-primary mb-4">{assignmentType == AssignmentTypeEnum.group ? "Group" : "Individual"}</p>
          <p className="text-gray-500 mb-4">{description}</p>
          <div className="mb-4">
            <label className="text-body-sm font-medium text-dark dark:text-white">
              Questions 
            </label>            
            <h5>{question}</h5>
          </div>
          
          <InputGroup
              type="file"
              fileStyleVariant="style1"
              label="Attach file"
              placeholder="Attach file"
            />
          

          <p className="text-red">{errorMessage}</p>
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white mt-4"
            onClick={submitAssignment}
          >
            Submit Assignment
          </button>
        </div>
      </div>
    </>
  );
};

export default SubmittingAssignmentPage;
