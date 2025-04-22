"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";
import DatePickerOneTeacher from "@/components/FormElements/DatePicker/DatePickerOneTeacher";
import InputGroup from "@/components/FormElements/InputGroup";
import { TeacherRadioInput } from "@/components/FormElements/RadioTeacher";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { InstructorModel } from "@/models/InstructorModel";

const EditingAssignmentPage = () => {
  const params = useParams();
  const router = useRouter();
  const { courseid, assignmentid } = params;
  const [courseId, setCourseId] = useState(courseid);
  const [assignmentId, setAssignmentId] = useState(assignmentid);
  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentType, setAssignmentType] = useState<"individual" | "group">(
    "individual"
  );
  const [outDate, setOutDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [question, setQuestion] = useState<string>(""); // ใช้คำถามเพียงข้อเดียว
  const [description, setDescription] = useState<string>("");

  const submitAssignment = async () => {
    // ตรวจสอบข้อมูลก่อนส่ง
    if (!assignmentName) {
      setErrorMessage("Assignment name is required.");
      return;
    }
    if (!outDate) {
      setErrorMessage("Out Dates are required.");
      return;
    }
    if (!dueDate) {
      setErrorMessage("Due Dates are required.");
      return;
    }
    if (!question) {
      setErrorMessage("A question is required.");
      return;
    }
    if (outDate > dueDate) {
      setErrorMessage("Out date cannot be after due date.");
      return;
    }
    if (outDate && outDate.getTime() < new Date().setHours(0, 0, 0, 0)) {
      setErrorMessage("Out date cannot be in the past.");
      return;
    }
    if (dueDate && dueDate.getTime() < new Date().setHours(0, 0, 0, 0)) {
      setErrorMessage("Due date cannot be in the past.");
      return;
    }

    const payload = {
      title: assignmentName,
      type: assignmentType,
      question: [question],
      outDate: outDate?.toISOString(),
      dueDate: dueDate?.toISOString(),
      courseId,
      assignmentId,
      description,
    };

    try {
      const response = await InstructorModel.instance.UpdateAssignment(payload);
      console.log("Assignment updated successfully:", response.data);
      router.push(`/main-teacher/course/${courseId}/peer-review-summary`);
    } catch (err) {
      console.error("Error submitting assignment:", err);
      setErrorMessage("Failed to update assignment.");
    }
  };

  const getAssignmentData = async () => {
    try {
      const response =
        await InstructorModel.instance.GetAssignmentbyAssignmentId(
          Number(assignmentId)
        );
      const assignmentData = response.data.data;
      if (assignmentData) {
        setAssignmentName(assignmentData.title);
        if (assignmentData.assignmentType === 1) {
          setAssignmentType("group");
        } else if (assignmentData.assignmentType === 2) {
          setAssignmentType("individual");
        }
        setOutDate(new Date(assignmentData.outDate));
        setDueDate(new Date(assignmentData.dueDate));
        setQuestion(assignmentData.question?.q1 || "");
        setDescription(assignmentData.description);
      } else {
        console.error("Assignment data not found in response:", assignmentData);
      }
    } catch (error) {
      console.error("Error fetching assignment data:", error);
    }
  };

  useEffect(() => {
    if (courseId && assignmentId) {
      getAssignmentData();
    }
  }, [courseId, assignmentId]);

  return (
    <>
      <BreadcrumbTeacher
        pageMain="Subject"
        pageMainLink="/main-teacher"
        subMainPage="Assignment Summary"
        subMainPageLink={`/main-teacher/course/${courseId}/peer-review-summary/`}
        pageName="Edit"
      />
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 rounded-lg">
        <h3 className="text-lg text-dark">
          To Edit Assignment fill in detail below
        </h3>
        <p className="text-gray-500 text-sm">Edit assignment Page</p>
      </div>
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 grid grid-cols-2 rounded-lg">
        <div>
          <InputGroup
            className="mb-4"
            label="Assignment Title"
            placeholder="Assignment Title"
            type="text"
            required={true}
            value={assignmentName}
            handleChange={(e) => setAssignmentName(e.target.value)}
          />

          <div className="mb-4">
            <DatePickerOneTeacher
              title="Out Date"
              value={outDate}
              onChange={(date: Date) => setOutDate(date)}
            />
          </div>
          <div className="mb-4">
            <DatePickerOneTeacher
              title="Due Date"
              value={dueDate}
              onChange={(date: Date) => setDueDate(date)}
            />
          </div>
          <div className="mb-4">
            <label className="text-body-sm font-medium text-dark dark:text-white">
              Assignment Type
              <span className="ml-1 select-none text-red">*</span>
            </label>
            <TeacherRadioInput
              name="assignmentType"
              label="Individual"
              value="individual"
              checked={assignmentType === "individual"}
              onChange={(e) =>
                setAssignmentType(e.target.value as "individual" | "group")
              }
            />
            <TeacherRadioInput
              name="assignmentType"
              label="Group"
              value="group"
              checked={assignmentType === "group"}
              onChange={(e) =>
                setAssignmentType(e.target.value as "individual" | "group")
              }
            />
          </div>

          <div className="mb-4">
            <TextAreaGroup
              label="Question"
              placeholder="Enter your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <TextAreaGroup
              label="Description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <p className="text-red">{errorMessage}</p>
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white mt-4"
            onClick={submitAssignment}
          >
            Edit Assignment
          </button>
        </div>
      </div>
    </>
  );
};

export default EditingAssignmentPage;
