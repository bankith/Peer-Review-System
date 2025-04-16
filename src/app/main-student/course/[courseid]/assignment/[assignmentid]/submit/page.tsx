"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";

interface ValidationStrategy {
  validate(questions: string[], answers: string[]): string | null;
}

class AnswerValidationStrategy implements ValidationStrategy {
  validate(questions: string[], answers: string[]): string | null {
    const unansweredQuestions = questions
      .map((_, index) => (answers[index] ? null : index + 1))
      .filter((q) => q !== null);

    if (unansweredQuestions.length > 0) {
      return `Please answer the following questions: ${unansweredQuestions.join(
        ", "
      )}`;
    }

    return null;
  }
}

const SubmittingAssignmentPage = () => {
  const params = useParams();
  const router = useRouter();
  const { courseid, assignmentid } = params;
  const [courseId] = useState(courseid);
  const [assignmentId] = useState(assignmentid);
  const [assignmentName, setAssignmentName] = useState<string>("");
  const [assignmentType, setAssignmentType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [groupMemberId, setGroupMemberId] = useState<number | null>(null);

  const submitAssignment = async () => {
    const validationStrategy = new AnswerValidationStrategy();
    const error = validationStrategy.validate(questions, answer);

    if (error) {
      setErrorMessage(error);
      return;
    }

    const payload = {
      userId: "12", // แทนด้วย userId จริงจากระบบ Authentication
      courseId,
      assignmentId,
      answer,
      groupMemberId: groupMemberId || 0,
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

  const getGroupMember = async () => {
    let userId = "12"; // แทนด้วย userId จริงจากระบบ Authentication
    try {
      const response = await fetch(`/api/student/groupmember?userId=${userId}`);
      const data = await response.json();
      if (!data) {
        throw new Error("Invalid data from API");
      }
      const groupMemberData = data.data;
      if (groupMemberData) {
        setGroupMemberId(groupMemberData);
      } else {
        console.error("Group member data not found in response:", data);
      }
    } catch (error) {
      console.error("Error fetching group member data:", error);
    }
  };

  const getAssignmentData = async () => {
    try {
      const response = await fetch(
        `/api/teacher/assignment?assignmentId=${assignmentId}`
      );
      const data = await response.json();
      if (!data) {
        throw new Error("Invalid data from API");
      }
      const assignmentData = data.data;
      if (assignmentData) {
        setAssignmentName(assignmentData.title);
        if (assignmentData.assignmentType === 1) {
          setAssignmentType("group");
        } else if (assignmentData.assignmentType === 2) {
          setAssignmentType("individual");
        }
        setDescription(assignmentData.description);
        setDueDate(new Date(assignmentData.dueDate));
        setQuestions(Object.values(assignmentData.question || {}));
      } else {
        console.error("Assignment data not found in response:", data);
      }
    } catch (error) {
      console.error("Error fetching assignment data:", error);
    }
  };
  const getSubmissionData = async () => {
    const userId = "12"; // แทนด้วย userId จริงจากระบบ Authentication
    try {
      const response = await fetch(
        `/api/student/assignment/submission/detail?userId=${userId}&assignmentId=${assignmentId}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to fetch assignment data: ${response.status}`);
      }
      const submission = data.data;
      // console.log("submission", submission);
      if (submission.answer) {
        setAnswer(Object.values(submission.answer));
      }
    } catch (error) {
      console.error("Error fetching submission data:", error);
    }
  };

  useEffect(() => {
    if (courseId && assignmentId) {
      getAssignmentData();
      getGroupMember();
      getSubmissionData();
    }
  }, [courseId, assignmentId]);

  return (
    <>
      <BreadcrumbTeacher
        pageMain="Subject"
        pageMainLink="/main-student/course"
        subMainPage="Assignment Summary"
        subMainPageLink={`/main-student/course/${courseId}/assignment-summary`}
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
            Due: {dueDate ? dueDate.toLocaleDateString() : "Not set"}
          </p>
          <p className="text-primary mb-4">{assignmentType}</p>
          <p className="text-gray-500 mb-4">{description}</p>
          <div className="mb-4">
            <label className="text-body-sm font-medium text-dark dark:text-white">
              Questions
            </label>
            {questions.map((question, index) => (
              <div key={index} className="mb-4">
                {/* แสดงคำถาม */}
                <p className="mb-2 text-gray-700 dark:text-gray-300">
                  {index + 1}. {question}
                </p>
                {/* กล่องตอบคำถาม */}
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder={`Answer for Question ${index + 1}`}
                  value={answer[index] || ""}
                  onChange={(e) => {
                    const updatedAnswers = [...answer];
                    updatedAnswers[index] = e.target.value;
                    setAnswer(updatedAnswers);
                  }}
                />
              </div>
            ))}
          </div>

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
