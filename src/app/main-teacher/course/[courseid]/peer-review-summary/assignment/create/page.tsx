"use client";
import { useEffect, useState, ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";
import DatePickerOneTeacher from "@/components/FormElements/DatePicker/DatePickerOneTeacher";
import InputGroup from "@/components/FormElements/InputGroup";
import { CheckboxTeacher } from "@/components/FormElements/CheckboxTeacher";
import { TeacherRadioInput } from "@/components/FormElements/RadioTeacher";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select } from "@/components/FormElements/select";
import { AddCircleOutlineIcon } from "@/assets/icons";

const CreatingAssignmentPage = () => {
  const params = useParams();
  const router = useRouter();
  const { courseid, assignmentid } = params;
  const [courseId, setCourseId] = useState(courseid);
  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentType, setAssignmentType] = useState("");
  const [studentDetail, setStudentDetail] = useState<any[]>([]);
  const [groupDetail, setGroupDetail] = useState<any[]>([]);
  const [outDate, setOutDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [assignmentId, setAssignmentId] = useState(assignmentid);
  const [numberOfReviewers, setNumberOfReviewers] = useState(1);
  const [selectedReviewers, setSelectedReviewers] = useState<any[]>([]);
  const [tempSelectedReviewers, setTempSelectedReviewers] = useState<
    Record<number, { id: string | number; name: string }>
  >({});
  const [peerReviewType, setPeerReviewType] = useState(0);
  const [peerReviewTitle, setPeerReviewTitle] = useState("");
  const [peerReviewMethod, setPeerReviewMethod] = useState("");
  const [groupMemberData, setGroupMemberData] = useState<any[]>([]);
  const [anonymousReviewer, setAnonymousReviewer] = useState(false);
  const [anonymousReviewee, setAnonymousReviewee] = useState(false);
  const [peerReviewTable, setPeerReviewTable] = useState<React.ReactNode>();
  const [reviewMethod, setReviewMethod] = useState<ReviewMethod>("manual");
  const [reviewerType, setReviewerType] = useState<string>("individual");
  const [selectedTasks, setSelectedTasks] = useState<Record<number, boolean>>(
    {}
  );
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [filteredReviewerByIndex, setFilteredReviewerByIndex] = useState<
    Record<number, any[]>
  >({});
  const [randomizedGroups, setRandomizedGroups] = useState<any[]>([]);
  const [errorRandomMessage, setErrorRandomMessage] = useState<string>("");

  return (
    <>
      <BreadcrumbTeacher pageName="Create" pageMain="Assignments" />
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 rounded-lg">
        <h3 className="text-lg text-dark">
          To Create Assignment fill in detail below
        </h3>
        <p className="text-gray-500 text-sm">Create assignment Page</p>
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
          {/* Question text area */}
          <div className="mb-4">
            <TextAreaGroup label="Question" placeholder="Question" />
          </div>
          <div className="mb-4">
            <InputGroup
              type="file"
              fileStyleVariant="style1"
              label="Attach file"
              placeholder="Attach file"
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
              checked={reviewerType === "individual"}
              //   onChange={handleAssignmentTypeChange}
            />
            <TeacherRadioInput
              name="assignmentType"
              label="Group"
              value="group"
              checked={reviewerType === "group"}
              //   onChange={handleAssignmentTypeChange}
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

          <p className="text-red">{errorMessage}</p>
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white mt-4"
            // onClick={submitAssignment}
          >
            Create Assignment
          </button>
        </div>
      </div>
    </>
  );
};

export default CreatingAssignmentPage;
