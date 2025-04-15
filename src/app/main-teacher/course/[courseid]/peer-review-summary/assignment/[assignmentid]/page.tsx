"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";
import DatePickerOneTeacher from "@/components/FormElements/DatePicker/DatePickerOneTeacher";
import InputGroup from "@/components/FormElements/InputGroup";
import { CheckboxTeacher } from "@/components/FormElements/CheckboxTeacher";
import { TeacherRadioInput } from "@/components/FormElements/RadioTeacher";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";

// Strategy Pattern Types and Classes
interface AssignmentData {
  title: string;
  type: AssignmentType;
  outDate: Date | null;
  dueDate: Date | null;
  question: string[];
  description: string | null;
  courseId: string | string[];
  assignmentId: string | string[];
}

type AssignmentType = "individual" | "group";

interface AssignmentStrategy {
  validate(data: AssignmentData): string | null;
  submit(data: AssignmentData): Promise<void>;
}

class IndividualAssignmentStrategy implements AssignmentStrategy {
  validate(data: AssignmentData): string | null {
    if (!data.title) return "Assignment name is required.";
    if (!data.outDate) return "Out Dates are required.";
    if (!data.dueDate) return "Due Dates are required.";
    if (!data.question || data.question.length === 0)
      return "At least one question is required.";
    if (data.outDate > data.dueDate)
      return "Out date cannot be after due date.";
    if (data.outDate < new Date()) return "Out date cannot be in the past.";
    if (data.dueDate < new Date()) return "Due date cannot be in the past.";
    return null;
  }

  async submit(data: AssignmentData): Promise<void> {
    const payload = {
      title: data.title,
      type: data.type,
      question: data.question,
      outDate: data.outDate?.toISOString(),
      dueDate: data.dueDate?.toISOString(),
      courseId: data.courseId,
      assignmentId: data.assignmentId,
      description: data.description,
    };
    await fetch("/api/teacher/assignment/editing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }
}

class GroupAssignmentStrategy extends IndividualAssignmentStrategy {
  // Add custom logic for group if needed later
}

const getAssignmentStrategy = (type: AssignmentType): AssignmentStrategy => {
  if (type === "group") return new GroupAssignmentStrategy();
  return new IndividualAssignmentStrategy();
};

const EditingAssignmentPage = () => {
  const params = useParams();
  const router = useRouter();
  const { courseid, assignmentid } = params;
  const [courseId, setCourseId] = useState(courseid);
  const [assignmentId, setAssignmentId] = useState(assignmentid);
  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentType, setAssignmentType] =
    useState<AssignmentType>("individual");
  const [outDate, setOutDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]); // เปลี่ยนเป็น array
  const [description, setDescription] = useState<string>("");

  // เพิ่มคำถามใหม่
  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  // ลบคำถาม
  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // อัปเดตคำถาม
  const updateQuestion = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  const submitAssignment = async () => {
    const data: AssignmentData = {
      title: assignmentName,
      type: assignmentType,
      outDate,
      dueDate,
      question: questions, // ส่งคำถามเป็น array
      courseId,
      assignmentId,
      description,
    };

    const strategy = getAssignmentStrategy(data.type);
    const error = strategy.validate(data);
    if (error) {
      setErrorMessage(error);
      return;
    }

    try {
      await strategy.submit(data);
      console.log("Assignment updated successfully.");
      router.push(`/main-teacher/course/${courseId}/peer-review-summary`);
    } catch (err) {
      console.error("Error submitting assignment:", err);
      setErrorMessage("Failed to update assignment.");
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

        setOutDate(new Date(assignmentData.outDate));
        setDueDate(new Date(assignmentData.dueDate));

        // แปลง question จาก object เป็น array
        setQuestions(Object.values(assignmentData.question || {}));

        setDescription(assignmentData.description);
      } else {
        console.error("Assignment data not found in response:", data);
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
        pageMainLink="/main-teacher/course"
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
            <TextAreaGroup
              label="Description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

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
                setAssignmentType(e.target.value as AssignmentType)
              }
            />
            <TeacherRadioInput
              name="assignmentType"
              label="Group"
              value="group"
              checked={assignmentType === "group"}
              onChange={(e) =>
                setAssignmentType(e.target.value as AssignmentType)
              }
            />
          </div>
          <div className="mb-4">
            <label className="text-body-sm font-medium text-dark dark:text-white">
              Questions
            </label>
            {questions.map((question, index) => (
              <div key={index} className="flex items-center mb-2">
                <InputGroup
                  className="flex-1"
                  label=""
                  placeholder={`Question ${index + 1}`}
                  type="text"
                  value={question}
                  handleChange={(e) => updateQuestion(index, e.target.value)}
                />
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => removeQuestion(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 text-primary"
              onClick={addQuestion}
            >
              + Add Question
            </button>
          </div>
          <div className="mb-4">
            <InputGroup
              type="file"
              fileStyleVariant="style1"
              label="Attach file"
              placeholder="Attach file"
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
