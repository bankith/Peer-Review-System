"use client";
import { useEffect, useState, ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";
import DatePickerOneTeacher from "@/components/FormElements/DatePicker/DatePickerOneTeacher";
import InputGroup from "@/components/FormElements/InputGroup";
import { CheckboxTeacher } from "@/components/FormElements/CheckboxTeacher";
import { StudentModel } from "@/models/StudentModel";
import { InstructorModel } from "@/models/InstructorModel";
import { TeacherRadioInput } from "@/components/FormElements/RadioTeacher";
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

export function createReviewerTable({
  assignmentType,
  groupDetail,
  studentDetail,
  selectedTasks,
  handleTaskSelection,
  reviewMethod,
  reviewerType,
  filteredReviewerByIndex,
  selectedReviewers,
  setSelectedReviewers,
  tempSelectedReviewers,
  setTempSelectedReviewers,
  numberOfReviewers,
  randomizedGroups,
}: {
  assignmentType: string;
  groupDetail: any[];
  studentDetail: any[];
  selectedTasks: Record<number, boolean>;
  handleTaskSelection: (index: number) => void;
  reviewMethod: "manual" | "random";
  reviewerType: "individual" | "group";
  filteredReviewerByIndex: Record<number, any[]>;
  selectedReviewers: Record<number, any[]>;
  setSelectedReviewers: React.Dispatch<React.SetStateAction<any[]>>;
  tempSelectedReviewers: Record<number, { id: string | number; name: string }>;
  setTempSelectedReviewers: React.Dispatch<
    React.SetStateAction<Record<number, { id: string | number; name: string }>>
  >;
  numberOfReviewers: number;
  randomizedGroups: any[];
}): React.ReactNode {
  const tasks = assignmentType === "Group" ? groupDetail : studentDetail;

  return (
    <Table className="border">
      <TableHeader>
        <TableRow className="border bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
          <TableHead>
            <CheckboxTeacher
              name="selectAll"
              label=""
              withIcon="check"
              checked={Object.values(selectedTasks).every((value) => value)}
              disabled={true} 
            />
          </TableHead>
          <TableHead>No.</TableHead>
          <TableHead>Tasks</TableHead>
          <TableHead>Reviewers</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tasks.map((item, index) => {
          const reviewers = selectedReviewers[index] || [];

          return (
            <TableRow key={index} className="border-[#eee] dark:border-dark-3">
              <TableCell>
                <div>
                  <CheckboxTeacher
                    name={`taskSelected-${index}`}
                    label=""
                    withIcon="check"
                    checked={!!selectedTasks[index]}
                    onChange={() => handleTaskSelection(index)}
                  />
                </div>
              </TableCell>
              <TableCell>
                <p>{index + 1}</p>
              </TableCell>
              <TableCell>
                <p>{item.name}</p>
              </TableCell>
              <TableCell>
                {reviewMethod === "manual" ? (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <Select
                          label=""
                          items={[
                            { label: "Select Reviewer", value: "" },
                            ...(filteredReviewerByIndex[index] || []).map(
                              (reviewer, idx) => ({
                                key: `${reviewerType}-${reviewer.id}-${idx}`,
                                label: reviewer.name,
                                value:
                                  reviewerType === "individual"
                                    ? reviewer.studentId?.toString()
                                    : reviewer.id?.toString(),
                              })
                            ),
                          ]}
                          defaultValue=""
                          onSelectChange={(value: string) => {
                            const selectedId = value;
                            const selectedName =
                              reviewerType === "individual"
                                ? studentDetail.find(
                                    (student) =>
                                      student.studentId.toString() ===
                                      selectedId
                                  )?.name
                                : groupDetail.find(
                                    (group) =>
                                      group.id.toString() === selectedId
                                  )?.name;

                            setTempSelectedReviewers((prev) => ({
                              ...prev,
                              [index]: {
                                id: selectedId,
                                name: selectedName || "",
                              },
                            }));
                          }}
                          disabled={true}
                        />
                      </div>
                      <AddCircleOutlineIcon
                        className="h-5 w-5 text-primary ml-2 cursor-pointer"
                        onClick={() => {
                          const tempReviewer = tempSelectedReviewers[index];
                          if (!tempReviewer) {
                            alert("Please select a reviewer before adding.");
                            return;
                          }

                          setSelectedReviewers((prev) => {
                            const currentReviewers = prev[index] || [];
                            if (currentReviewers.length < numberOfReviewers) {
                              return {
                                ...prev,
                                [index]: [...currentReviewers, tempReviewer],
                              };
                            } else {
                              alert(
                                `You can only select up to ${numberOfReviewers} reviewers for this task.`
                              );
                              return prev;
                            }
                          });

                          setTempSelectedReviewers((prev) => {
                            const updated = { ...prev };
                            delete updated[index];
                            return updated;
                          });
                        }}
                      />
                    </div>
                    <p className="text-primary text-start mt-3">
                      {reviewers.map((reviewer) => reviewer.name).join(", ") ||
                        "No reviewers selected"}
                    </p>
                  </>
                ) : (
                  <p className="text-primary text-start mt-3">
                    {reviewers.map((reviewer) => reviewer.name).join(", ") ||
                      "No reviewers selected"}
                  </p>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

const EditingPeerReviewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { courseid, assignmentid, peerreviewid } = params;
  const [courseId, setCourseId] = useState(courseid);
  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentType, setAssignmentType] = useState("");
  const [studentDetail, setStudentDetail] = useState<any[]>([]);
  const [groupDetail, setGroupDetail] = useState<any[]>([]);
  const [reviewTitle, setReviewTitle] = useState("");
  const [outDate, setOutDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [assignmentId, setAssignmentId] = useState(assignmentid);
  const [numberOfReviewers, setNumberOfReviewers] = useState(1);
  const [selectedReviewers, setSelectedReviewers] = useState<any[]>([]);
  const [tempSelectedReviewers, setTempSelectedReviewers] = useState<
    Record<number, { id: string | number; name: string }>
  >({});
  const [peerReviewId, setPeerReviewId] = useState(peerreviewid);
  const [peerReviewType, setPeerReviewType] = useState(0);
  const [peerReviewTitle, setPeerReviewTitle] = useState("");
  const [peerReviewMethod, setPeerReviewMethod] = useState("");
  const [peerReviewSubmissionData, setPeerReviewSubmissionData] = useState<
    any[]
  >([]);
  const [groupMemberData, setGroupMemberData] = useState<any[]>([]);
  const [anonymousReviewer, setAnonymousReviewer] = useState(false);
  const [anonymousReviewee, setAnonymousReviewee] = useState(false);
  const [assignmentTable, setAssignmentTable] = useState<React.ReactNode>();
  const [reviewMethod, setReviewMethod] = useState<ReviewMethod>("manual");
  const [reviewerType, setReviewerType] = useState<string>("individual");
  const [selectedTasks, setSelectedTasks] = useState<Record<number, boolean>>(
    {}
  );
  const [filteredReviewer, setFilteredReviewer] = useState<any[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [filteredReviewerByIndex, setFilteredReviewerByIndex] = useState<
    Record<number, any[]>
  >({});
  const [numberOfGroups, setNumberOfGroups] = useState(2); // จำนวนกลุ่มที่ต้องการสุ่ม
  const [randomizedGroups, setRandomizedGroups] = useState<any[]>([]); // เก็บผลลัพธ์การสุ่ม
  const [errorRandomMessage, setErrorRandomMessage] = useState<string>("");
  const handleReviewMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReviewMethod(event.target.value as ReviewMethod);
  };
  const handleTaskSelection = (index: number) => {
    setSelectedTasks((prev) => {
      const updated = { ...prev, [index]: !prev[index] }; // toggle ค่า checkbox ของแถวที่เลือก
      const allSelected = Object.values(updated).every((value) => value); // ตรวจสอบว่าเลือกทั้งหมดหรือไม่
      setIsSelectAll(allSelected); // อัปเดตสถานะ select all
      return updated;
    });
  };
  // ==== Factory Method ====
  const peerReviewTable = createReviewerTable({
    assignmentType,
    groupDetail,
    studentDetail,
    selectedTasks,
    handleTaskSelection,
    reviewMethod,
    reviewerType,
    filteredReviewerByIndex,
    selectedReviewers,
    setSelectedReviewers,
    tempSelectedReviewers,
    setTempSelectedReviewers,
    numberOfReviewers,
    randomizedGroups,
  });

  const handlePeerReviewTypeChange = (type: number) => {
    setPeerReviewType((prev) => {
      // ใช้ XOR เพื่อ toggle ค่า
      const updatedValue = prev ^ type;
      return updatedValue;
    });
  };

  const submitPeerReview = async () => {
    setErrorMessage("");
    const selectedIndexes = Object.entries(selectedTasks)
      .filter(([_, isSelected]) => isSelected)
      .map(([index]) => Number(index)); // แปลง key เป็นตัวเลข

    console.log("Selected Tasks Indexes:", selectedIndexes); // แสดง index ของ task ที่ถูกเลือก
    console.log("Selected Reviewers:", selectedReviewers); // แสดง reviewer ที่ถูกเลือก

    // สร้างโครงสร้างข้อมูลในรูปแบบที่ต้องการ
    const taskReviewerMapping = selectedIndexes.map((index) => {
      const taskId =
        assignmentType === "Group"
          ? groupDetail[index]?.id
          : studentDetail[index]?.studentId;

      const reviewers = selectedReviewers[index]?.map((reviewer: any) => ({
        reviewer: { id: reviewer.id },
      }));

      return {
        taskId,
        reviewers: reviewers || [],
      };
    });

    console.log("Task-Reviewer Mapping:", taskReviewerMapping); // แสดงโครงสร้างข้อมูลที่สร้างขึ้น
    // ตรวจสอบว่ามี task ใดที่ยังไม่มี reviewer
    const missingReviewers = taskReviewerMapping.filter(
      (task) => task.reviewers.length === 0
    );

    if (missingReviewers.length > 0) {
      const missingTaskNames = missingReviewers
        .map((task) =>
          assignmentType === "Group"
            ? groupDetail.find((group) => group.id === task.taskId)?.name
            : studentDetail.find((student) => student.studentId === task.taskId)
                ?.name
        )
        .join(", ");

      setErrorMessage(
        `The following tasks do not have reviewers assigned: ${missingTaskNames}`
      );
      return;
    }
    // ตรวจสอบว่า student หรือ group ทั้งหมดถูกเลือกเป็น reviewer
    const allSelectedReviewers = Object.values(selectedReviewers).flat(); // รวม reviewer ทั้งหมด
    console.log("All Selected Reviewers:", allSelectedReviewers); // แสดง reviewer ทั้งหมดที่ถูกเลือก
    if (reviewerType === "individual") {
      // กรณี reviewer เป็นบุคคล
      const unselectedStudents = studentDetail.filter(
        (student) =>
          !allSelectedReviewers.some(
            (reviewer) =>
              reviewer.id.toString() === student.studentId.toString()
          )
      );

      if (unselectedStudents.length > 0) {
        const unselectedNames = unselectedStudents
          .map((student) => student.name)
          .join(", ");
        setErrorMessage(
          `The following students have not been assigned as reviewers: ${unselectedNames}`
        );
        return;
      }
    } else if (reviewerType === "group") {
      // กรณี reviewer เป็นกลุ่ม
      const unselectedGroups = groupDetail.filter(
        (group) =>
          !allSelectedReviewers.some(
            (reviewer) => reviewer.id.toString() === group.id.toString()
          )
      );

      if (unselectedGroups.length > 0) {
        const unselectedNames = unselectedGroups
          .map((group) => group.name)
          .join(", ");
        setErrorMessage(
          `The following groups have not been assigned as reviewers: ${unselectedNames}`
        );
        return;
      }
    }

    let reviewerTypeId = 0;
    let reviewMethodId = 0;
    if (reviewerType === "group") {
      reviewerTypeId = 1;
    } else if (reviewerType === "individual") {
      reviewerTypeId = 2;
    }
    if (reviewMethod === "manual") {
      reviewMethodId = 1;
    } else if (reviewMethod === "random") {
      reviewMethodId = 2;
    }
    if (!peerReviewTitle) {
      setErrorMessage("Please enter a peer review title.");
      return;
    }
    if (!outDate) {
      setErrorMessage("Please select an out date.");
      return;
    }
    if (!dueDate) {
      setErrorMessage("Please select a due date.");
      return;
    }
    if (outDate > dueDate) {
      setErrorMessage("Out date cannot be later than due date.");
      return;
    }
    if (numberOfReviewers <= 0) {
      setErrorMessage("Please enter a valid number of reviewers.");
      return;
    }

    if (peerReviewType === 0) {
      setErrorMessage("Please select at least one peer review type.");
      return;
    }
    if (outDate && dueDate && outDate > dueDate) {
      setErrorMessage("Out date cannot be later than due date.");
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
    if (!Object.values(selectedTasks).some((value) => value)) {
      setErrorMessage("Please select at least one task.");
      return;
    }

    const data = {
      peerReviewId: peerReviewId,
      courseId: courseId,
      assignmentId: assignmentId,
      assignmentType: assignmentType,
      peerReviewTitle: peerReviewTitle,
      outDate: outDate,
      dueDate: dueDate,
      numberOfReviewers: numberOfReviewers,
      peerReviewType: peerReviewType,
      peerReviewMethod: peerReviewMethod,
      reviewerType: reviewerTypeId,
      reviewMethod: reviewMethodId,
      anonymousReviewer: anonymousReviewer,
      anonymousReviewee: anonymousReviewee,
      taskSelected: selectedTasks,
      selectedReviewers: selectedReviewers,
      taskReviewerMapping: taskReviewerMapping,
    };
    let peerreviewId = 0;
    console.log("data", data);
    try {
      const response = await InstructorModel.instance.UpdatePeerReview(data);
      const result = response.data;
      if (result.isError === false) {
        peerreviewId = result.data.id;
      } else {
        alert("Failed to create peer review.");
        router.push(`/main-teacher/course/${courseId}/peer-review-summary`);
      }
    } catch (error) {
      console.error("Error creating peer review:", error);
    }
    alert("Peer review updated successfully.");
    router.push(`/main-teacher/course/${courseId}/peer-review-summary`);
  };

  const getPeerReviewData = async () => {
    try {
      const response = await InstructorModel.instance.GetPeerReviewById(Number(peerReviewId));
      const peerReviewData = response.data.data;
      console.log("peerReviewData", peerReviewData);
      setPeerReviewTitle(peerReviewData.name);
      setNumberOfReviewers(peerReviewData.maxReviewer);
      setOutDate(new Date(peerReviewData.outDate));
      setDueDate(new Date(peerReviewData.dueDate));
      setPeerReviewType(peerReviewData.peerReviewType);
      setReviewerType(
        peerReviewData.reviewerType === 1 ? "group" : "individual"
      );
      setReviewMethod(peerReviewData.reviewMethod === 1 ? "manual" : "random");
      setAnonymousReviewer(peerReviewData.isReviewerAnonymous === 1);
      setAnonymousReviewee(peerReviewData.isRevieweeAnonymous === 1);
      setAssignmentName(peerReviewData.__assignment__.title);
      setAssignmentType(
        peerReviewData.__assignment__.assignmentType === 1
          ? "Group"
          : "Individual"
      );
      setCourseId(peerReviewData.__assignment__.courseId);
      setAssignmentId(peerReviewData.__assignment__.id);
    } catch (error) {
      console.error("Error fetching assignment data:", error);
    }
  };

  const getPeerReviewSubmissionData = async () => {
    try {
      const response = await InstructorModel.instance.GetPeerReviewSubmissions(Number(peerReviewId));
      const submissionData = response.data.data;

      if (
        !submissionData ||
        !Array.isArray(submissionData) ||
        submissionData.length === 0
      ) {
        console.log(
          "peerReviewSubmissionData is not a valid array:",
          submissionData
        );
        setPeerReviewSubmissionData([]);
        return;
      }

      // อัปเดต selectedTasks และ selectedReviewers
      const newSelectedTasks: Record<number, boolean> = {};
      const newSelectedReviewers: Record<number, any[]> = {};

      const tasks = assignmentType === "Group" ? groupDetail : studentDetail;

      tasks.forEach((task, index) => {
        const taskId =
          assignmentType === "Group" ? Number(task.id) : Number(task.studentId);

        // ดึง submission ที่ตรงกับ task นี้
        const matchedSubmissions = submissionData.filter((submission) => {
          if (assignmentType === "Group") {
            return submission.__revieweeGroup__?.id === taskId;
          } else {
            return submission.__reviewee__?.id === taskId;
          }
        });

        // ถ้ามี reviewer สำหรับ task นี้
        if (matchedSubmissions.length > 0) {
          newSelectedTasks[index] = true;
          newSelectedReviewers[index] = matchedSubmissions.map((submission) => {
            const reviewer =
              reviewerType === "individual"
                ? submission.__reviewer__
                : submission.__reviewerGroup__;

            return {
              id: reviewer?.id,
              name: reviewer?.name,
            };
          });
        }
      });

      setSelectedTasks(newSelectedTasks);
      setSelectedReviewers(newSelectedReviewers);
      setPeerReviewSubmissionData(submissionData); // เก็บข้อมูลใน State
    } catch (error) {
      console.error("Error fetching peer review submission data:", error);
    }
  };

  const groupData = async () => {
    try {
      const response = await StudentModel.instance.GetAllGroupInCourse(
        Number(courseId)
      );
      const groupData = response.data.data;

      if (!groupData || !Array.isArray(groupData) || groupData.length === 0) {
        return;
      }
      //get name and id from groupData and set to setGroupDetail
      const transformedData = groupData.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        courseId: item.courseId,
        groupId: item.groupId,
      }));
      // console.log("transformedData", transformedData);
      setGroupDetail(transformedData);
    } catch (error) {
      console.error("Error fetching group data:", error);
    }
  };

  const studentData = async () => {
    try {
      const response = await StudentModel.instance.GetAllStudentInCourse(
        Number(courseId)
      );
      const studentData = response.data.data;

      if (
        !studentData ||
        !Array.isArray(studentData) ||
        studentData.length === 0
      ) {
        console.warn("No valid student data found.");
        setStudentDetail([]);
        return;
      }

      // แปลงข้อมูลให้เหมาะสมกับการใช้งาน
      const transformedData = studentData.map((item: any) => ({
        name: item.__student__?.name || "Unknown",
        studentId: item.studentId,
      }));

      setStudentDetail(transformedData);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setStudentDetail([]);
    }
  };

  const getGroupMemberData = async () => {
    try {
      const response = await StudentModel.instance.GetAllGroupMemberInCourse(
        Number(courseId)
      );
      const groupMemberData = response.data.data;
      console.log("groupMemberData", groupMemberData);
      if (
        !groupMemberData ||
        !Array.isArray(groupMemberData) ||
        groupMemberData.length === 0
      ) {
        console.warn("No valid group member data found.");
        setGroupMemberData([]);
        return;
      }

      setGroupMemberData(groupMemberData);
    } catch (error) {
      console.error("Error fetching group member data:", error);
      setGroupMemberData([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (courseId) {
        try {
          await groupData();
          await studentData();
          await getGroupMemberData();
          await getPeerReviewData();
          await getPeerReviewSubmissionData();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [courseId]);


  return (
    <>
      <BreadcrumbTeacher
        pageMain="Courses"
        pageMainLink="/main-teacher"
        subMainPage="Peer Review Summary"
        subMainPageLink={`/main-teacher/course/${courseId}/peer-review-summary/`}
        pageName="Edit"
      />
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 rounded-lg">
        <h3 className="text-lg text-dark">
          To Edit Peer Review fill in detail below
        </h3>
        <p className="text-gray-500 text-sm">Edit Peer Review Page</p>
      </div>
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 grid grid-cols-1 rounded-lg">
        <div>
          <InputGroup
            className="mb-4"
            label="Review Title"
            placeholder="Review Title"
            type="text"
            required={true}
            value={peerReviewTitle}
            handleChange={(e) => setPeerReviewTitle(e.target.value)}
          />
          <InputGroup
            className="mb-4"
            label="Assignment"
            placeholder=""
            type="text"
            value={assignmentName}
            disabled={true}
          />
          <InputGroup
            className="mb-4"
            label="Assignment Type"
            placeholder=""
            type="text"
            value={assignmentType}
            disabled={true}
          />
          <div className="mb-4">
            <label className="text-body-sm font-medium text-dark dark:text-white">
              Review Method
              <span className="ml-1 select-none text-red">*</span>
            </label>
            <CheckboxTeacher
              name="peerReviewType"
              label="Text Review"
              withIcon="check"
              checked={(peerReviewType & 1) !== 0}
              onChange={() => handlePeerReviewTypeChange(1)}
            />
            <CheckboxTeacher
              name="peerReviewType"
              label="Score Review (0-10)"
              withIcon="check"
              checked={(peerReviewType & 2) !== 0}
              onChange={() => handlePeerReviewTypeChange(2)}
            />
          </div>
          <InputGroup
            className="mb-4"
            label="Number of Reviewers Per Assignment"
            placeholder="1"
            subtitle={`(Limited to ${Math.min(
              assignmentType === "Group"
                ? groupDetail.length
                : studentDetail.length,
              5
            )} People/Groups)`}
            min={1}
            max={Math.min(
              assignmentType === "Group"
                ? groupDetail.length
                : studentDetail.length,
              5
            )}
            type="number"
            value={numberOfReviewers.toString()}
            // handleChange={(e) => setNumberOfReviewers(Number(e.target.value))}]
            disabled={true}
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
              Reviewer Type
              <span className="ml-1 select-none text-red">*</span>
            </label>
            <TeacherRadioInput
              name="reviewerType"
              label="Individual"
              value="individual"
              checked={reviewerType === "individual"}
              disabled={true}
            />
            <TeacherRadioInput
              name="reviewerType"
              label="Group"
              value="group"
              checked={reviewerType === "group"}
              disabled={true}
            />
          </div>
          <div className="mb-4">
            <label className="text-body-sm font-medium text-dark dark:text-white">
              Review Method
              <span className="ml-1 select-none text-red">*</span>
            </label>
            <TeacherRadioInput
              name="peerReviewMethod"
              label="Manual"
              value="manual"
              checked={reviewMethod === "manual"}
              disabled={true}
            />
            <TeacherRadioInput
              name="peerReviewMethod"
              label="Random"
              value="random"
              checked={reviewMethod === "random"}
              disabled={true}
            />
          </div>
          <div className="mb-4">
            <label className="text-body-sm font-medium text-dark dark:text-white">
              Select Group to be reviewed
              <span className="ml-1 select-none text-red">*</span>
            </label>
            <div>{peerReviewTable}</div>
          </div>
          <p className="text-red">{errorMessage}</p>
          <div className="flex justify-start">
            <button
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white ml-3"
              onClick={submitPeerReview}
            >
              Edit Peer Review
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditingPeerReviewPage;
