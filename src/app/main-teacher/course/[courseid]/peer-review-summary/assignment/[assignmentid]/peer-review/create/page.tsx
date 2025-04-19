"use client";
import { useEffect, useState, ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";
import DatePickerOneTeacher from "@/components/FormElements/DatePicker/DatePickerOneTeacher";
import InputGroup from "@/components/FormElements/InputGroup";
import { CheckboxTeacher } from "@/components/FormElements/CheckboxTeacher";
import { TeacherRadioInput } from "@/components/FormElements/RadioTeacher";
import { StudentModel } from "@/models/StudentModel";
import { InstructorModel } from "@/models/InstructorModel";
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
  setSelectedTasks,
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
  setSelectedTasks: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >;
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
              onChange={() => {
                const newState: Record<number, boolean> = {};
                const isSelectingAll = !Object.values(selectedTasks).every(
                  (value) => value
                ); // toggle select all state

                tasks.forEach((_, index) => {
                  newState[index] = isSelectingAll; // เลือกทั้งหมดหรือยกเลิกทั้งหมด
                });

                setSelectedTasks(newState); // อัปเดตสถานะของ selectedTasks
              }}
            />
          </TableHead>
          <TableHead>No.</TableHead>
          <TableHead>Tasks</TableHead>
          <TableHead>Reviewers</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tasks.map((item, index) => {
          const randomizedTask = randomizedGroups.find(
            (group) =>
              group.taskId ===
              (assignmentType === "Group" ? item.id : item.studentId)
          );

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
                      {selectedReviewers[index]
                        ?.map((reviewer) => reviewer.name)
                        .join(", ") || "No reviewers selected"}
                    </p>
                  </>
                ) : randomizedTask ? (
                  <p className="text-primary text-start mt-3">
                    {randomizedTask.reviewers
                      .map((reviewer) => reviewer.name)
                      .join(", ")}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    Reviewers will be shown after randomization
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

const CreatingPeerReviewPage = () => {
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
  const [selectedReviewers, setSelectedReviewers] = useState<
    Record<number, any[]>
  >({});
  const [tempSelectedReviewers, setTempSelectedReviewers] = useState<
    Record<number, { id: string | number; name: string }>
  >({});
  const [peerReviewType, setPeerReviewType] = useState(0);
  const [peerReviewTitle, setPeerReviewTitle] = useState("");
  const [peerReviewMethod, setPeerReviewMethod] = useState("");
  const [groupMemberData, setGroupMemberData] = useState<any[]>([]);
  const [anonymousReviewer, setAnonymousReviewer] = useState(false);
  const [anonymousReviewee, setAnonymousReviewee] = useState(false);
  // const [peerReviewTable, setPeerReviewTable] = useState<React.ReactNode>();

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
  const [randomizedGroups, setRandomizedGroups] = useState<any[]>([]); // เก็บผลลัพธ์การสุ่ม
  const [errorRandomMessage, setErrorRandomMessage] = useState<string>("");
  const handleReviewMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReviewMethod(event.target.value as ReviewMethod);
  };

  const handleTaskSelection = (index: number) => {
    setSelectedTasks((prev) => {
      const updated = { ...prev, [index]: !prev[index] };
      const allSelected = Object.values(updated).every((value) => value);
      setIsSelectAll(allSelected);
      return updated;
    });
  };
  const peerReviewTable = createReviewerTable({
    assignmentType,
    groupDetail,
    studentDetail,
    selectedTasks,
    setSelectedTasks,
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

  const handleReviewerTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReviewerType(event.target.value);
  };
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
    const allSelectedReviewers = Object.values(selectedReviewers).flat();
    if (reviewerType === "individual") {
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
    if (outDate && dueDate && outDate < new Date()) {
      setErrorMessage("Out date cannot be earlier than today.");
      return;
    }
    if (dueDate && dueDate < new Date()) {
      setErrorMessage("Due date cannot be earlier than today.");
      return;
    }
    if (!Object.values(selectedTasks).some((value) => value)) {
      setErrorMessage("Please select at least one task.");
      return;
    }

    const data = {
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
    try {
      const response = await InstructorModel.instance.PostPeerReviewConfiguration(data);
      const result = response.data;
      if (result.isError === false) {
        peerreviewId = result.data.id;
      } else {
        alert("Failed to create peer review.");
      }
    } catch (error) {
      console.error("Error creating peer review:", error);
    }
    try {
      const response2 = await InstructorModel.instance.PostPeerReviewSubmissionMatching(peerreviewId, data);
      const result2 = response2.data;
      if (result2.isError === false) {
        alert("Peer review created successfully.");
        router.push(`/main-teacher/course/${courseId}/peer-review-summary`);
      } else {
        alert("Failed to create peer review.");
      }
    } catch (error) {
      console.error("Error creating peer review:", error);
    }
  };

  const getAssignmentData = async () => {
    try {
      const response =
        await InstructorModel.instance.GetAssignmentbyAssignmentId(
          Number(assignmentId)
        );
      const assignmentData = response.data.data;
      setAssignmentName(assignmentData.title);
      if (assignmentData.assignmentType === 1) {
        setAssignmentType("Group");
      } else if (assignmentData.assignmentType === 2) {
        setAssignmentType("Individual");
      }
    } catch (error) {
      console.error("Error fetching assignment data:", error);
    }
  };
  const groupData = async () => {
    try {
      const response = await StudentModel.instance.GetAllGroupInCourse(
        Number(courseId)
      );
      const groupData = response.data.data;

      if (!groupData || !Array.isArray(groupData) || groupData.length === 0) {
        // console.log("groupData is not a valid array:", groupData);
        // setPeerReviewTable(undefined);
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
      console.log("studentData", studentData);

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
      setStudentDetail([]); // ตั้งค่าเป็น array ว่างในกรณีเกิดข้อผิดพลาด
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
        setGroupMemberData([]); // ตั้งค่าเป็น array ว่างในกรณีไม่มีข้อมูล
        return;
      }

      setGroupMemberData(groupMemberData);
    } catch (error) {
      console.error("Error fetching group member data:", error);
      setGroupMemberData([]); // ตั้งค่าเป็น array ว่างในกรณีเกิดข้อผิดพลาด
    }
  };

  const handleRandomize = () => {
    const tasks = assignmentType === "Group" ? groupDetail : studentDetail;
    const selectedTasksArray = tasks.filter((_, index) => selectedTasks[index]);

    if (selectedTasksArray.length === 0) {
      setErrorRandomMessage(
        "Please select at least one task before randomizing."
      );
      return;
    }

    setErrorRandomMessage("");
    const newRandomizedGroups: any[] = [];
    const newSelectedReviewers: Record<number, any[]> = {};

    const allReviewers =
      reviewerType === "individual" ? [...studentDetail] : [...groupDetail];
    let unusedReviewersPool = [...allReviewers];

    selectedTasksArray.forEach((task, index) => {
      const taskId = assignmentType === "Group" ? task.id : task.studentId;

      let validReviewers = unusedReviewersPool.filter((reviewer) => {
        if (reviewerType === "individual") {
          return reviewer.studentId !== taskId;
        } else if (reviewerType === "group") {
          return reviewer.id !== taskId;
        }
        return true;
      });

      if (validReviewers.length < numberOfReviewers) {
        unusedReviewersPool = [...allReviewers];
        validReviewers = unusedReviewersPool.filter((reviewer) => {
          if (reviewerType === "individual") {
            return reviewer.studentId !== taskId;
          } else if (reviewerType === "group") {
            return reviewer.id !== taskId;
          }
          return true;
        });
      }

      // สุ่ม reviewer จาก validReviewers
      const randomizedReviewers = [...validReviewers]
        .sort(() => Math.random() - 0.5)
        .slice(0, numberOfReviewers);

      // ลบ reviewer ที่ใช้แล้วออกจาก unusedReviewersPool
      randomizedReviewers.forEach((usedReviewer) => {
        unusedReviewersPool = unusedReviewersPool.filter((r) => {
          if (reviewerType === "individual") {
            return r.studentId !== usedReviewer.studentId;
          } else {
            return r.id !== usedReviewer.id;
          }
        });
      });

      const mappedReviewers = randomizedReviewers.map((reviewer) => ({
        id: reviewerType === "individual" ? reviewer.studentId : reviewer.id,
        name: reviewer.name,
      }));

      newRandomizedGroups.push({
        taskId: taskId,
        reviewers: mappedReviewers,
      });

      newSelectedReviewers[index] = mappedReviewers;
    });

    setRandomizedGroups(newRandomizedGroups);
    setSelectedReviewers(newSelectedReviewers);

    // console.log("Randomized Groups:", newRandomizedGroups);
    // console.log("Selected Reviewers:", newSelectedReviewers);
  };

  useEffect(() => {
    if (courseId) {
      getAssignmentData();
      groupData();
      studentData();
      getGroupMemberData();
    }
  }, []);

  useEffect(() => {
    const tasks = assignmentType === "Group" ? groupDetail : studentDetail;
    const initialSelectedTasks: Record<number, boolean> = {};
    tasks.forEach((_, index) => {
      initialSelectedTasks[index] = false;
    });
    // อัปเดต filteredReviewerByIndex เมื่อ reviewerType เปลี่ยน
    const updatedFilteredReviewerByIndex: Record<number, any[]> = {};
    tasks.forEach((task, idx) => {
      if (reviewerType === "individual") {
        // กรณี Reviewer Type เป็น Individual
        const membersInGroup = groupMemberData
          .filter((member) => member.__group__.id === Number(task.id))
          .map((member) => member.__user__.id);

        updatedFilteredReviewerByIndex[idx] = studentDetail.filter(
          (student) =>
            !membersInGroup.includes(Number(student.studentId)) && // ห้ามเป็นสมาชิกในกลุ่มเดียวกัน
            student.studentId !== task.studentId // ห้ามเลือกตัวเอง
        );
      } else if (reviewerType === "group") {
        // กรณี Reviewer Type เป็น Group
        updatedFilteredReviewerByIndex[idx] = groupDetail.filter(
          (group) => group.id !== task.id
        );
      }
    });

    setFilteredReviewerByIndex(updatedFilteredReviewerByIndex);
  }, [
    reviewerType,
    assignmentType,
    groupDetail,
    studentDetail,
    groupMemberData,
  ]);

  return (
    <>
      <BreadcrumbTeacher
        pageMain="Subject"
        pageMainLink="/main-teacher/course"
        subMainPage="Peer Review Summary"
        subMainPageLink={`/main-teacher/course/${courseId}/peer-review-summary/`}
        pageName="Create"
      />
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 rounded-lg">
        <h3 className="text-lg text-dark">
          To Create Peer Review fill in detail below
        </h3>
        <p className="text-gray-500 text-sm">Create peer review Page</p>
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
              checked={(peerReviewType & 1) !== 0} // ตรวจสอบว่าค่า Text Review ถูกเลือกหรือไม่
              onChange={() => handlePeerReviewTypeChange(1)} // ส่งค่า 1 สำหรับ Text Review
            />
            <CheckboxTeacher
              name="peerReviewType"
              label="Score Review (0-10)"
              withIcon="check"
              checked={(peerReviewType & 2) !== 0} // ตรวจสอบว่าค่า Score Review ถูกเลือกหรือไม่
              onChange={() => handlePeerReviewTypeChange(2)} // ส่งค่า 2 สำหรับ Score Review
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
            handleChange={(e) => setNumberOfReviewers(Number(e.target.value))}
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
              onChange={handleReviewerTypeChange}
            />
            <TeacherRadioInput
              name="reviewerType"
              label="Group"
              value="group"
              checked={reviewerType === "group"}
              onChange={handleReviewerTypeChange}
            />
            <p>Selected Reviewer Type: {reviewerType}</p>
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
              onChange={handleReviewMethodChange}
            />
            <TeacherRadioInput
              name="peerReviewMethod"
              label="Random"
              value="random"
              checked={reviewMethod === "random"}
              onChange={handleReviewMethodChange}
            />
            {reviewMethod === "random" && (
              <div className="mb-4">
                <button
                  className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary mt-2 hover:bg-primary/10"
                  onClick={handleRandomize}
                >
                  Random
                </button>
                {errorRandomMessage && (
                  <p className="text-red text-sm mt-2">{errorRandomMessage}</p>
                )}
              </div>
            )}
            <p>Selected Review Method: {reviewMethod}</p>
          </div>

          <div className="mb-4">
            <label className="text-body-sm font-medium text-dark dark:text-white">
              Select Group to be reviewed
              <span className="ml-1 select-none text-red">*</span>
            </label>
            <div>{peerReviewTable}</div>
          </div>
          <div className="mb-4">
            <label className="text-body-sm font-medium text-dark dark:text-white">
              Reviewer-Reviewee Anonymity Setting
              <span className="ml-1 select-none text-red">*</span>
            </label>
            <CheckboxTeacher
              name="Reviewer anonymous"
              label="Anonymous (Reviewer Name Hidden)"
              withIcon="check"
              checked={anonymousReviewer}
              onChange={() => setAnonymousReviewer(!anonymousReviewer)}
            />
            <CheckboxTeacher
              name="Reviewee anonymous"
              label="Anonymous (Reviewee Name Hidden)"
              withIcon="check"
              checked={anonymousReviewee}
              onChange={() => setAnonymousReviewee(!anonymousReviewee)}
            />
          </div>
          <p className="text-red">{errorMessage}</p>
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
            onClick={submitPeerReview}
          >
            Create Peer Review
          </button>
        </div>
      </div>
    </>
  );
};

export default CreatingPeerReviewPage;
