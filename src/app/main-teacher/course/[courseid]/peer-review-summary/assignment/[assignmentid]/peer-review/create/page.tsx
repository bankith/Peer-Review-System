"use client";
import { useEffect, useState, ReactNode } from "react";
import { useParams } from "next/navigation";
import { PeerReviewTable } from "@/components/Tables/peer-review-table";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";
import DatePickerOneTeacher from "@/components/FormElements/DatePicker/DatePickerOneTeacher";
import InputGroup from "@/components/FormElements/InputGroup";
import { CheckboxTeacher } from "@/components/FormElements/CheckboxTeacher";
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
// import { TableManualGroup } from "@/components/Tables/TableManualGroup";
// import { TableManualIndividual } from "@/components/Tables/TableManualIndividual";
// import { TableRandomGroup } from "@/components/Tables/TableRandomGroup";
// import { TableRandomIndividual } from "@/components/Tables/TableRandomIndividual";

const CreatingPeerReviewPage = () => {
  const params = useParams();
  const { courseid, assignmentid } = params;
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
  const [peerReviewType, setPeerReviewType] = useState(0);
  const [peerReviewTitle, setPeerReviewTitle] = useState("");
  const [peerReviewMethod, setPeerReviewMethod] = useState("");
  const [groupMemberData, setGroupMemberData] = useState<any[]>([]);
  const [anonymousReviewer, setAnonymousReviewer] = useState(false);
  const [anonymousReviewee, setAnonymousReviewee] = useState(false);
  const [assignmentTable, setAssignmentTable] = useState<React.ReactNode>();
  const [peerReviewTable, setPeerReviewTable] = useState<React.ReactNode>();
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

  const handleReviewMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReviewMethod(event.target.value as ReviewMethod);
  };

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
    let reviewerTypeId = 0;
    let reviewMethodId = 0;
    if (reviewerType === "group") {
      reviewerTypeId = 1;
    } else if (reviewerType === "individual") {
      reviewerTypeId = 2;
    }
    if (reviewMethod === "manual") {
      reviewMethodId = 1;
    }
    else if (reviewMethod === "random") {
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
    // if (!Object.values(selectedTasks).some((value) => value)) {
    //   setErrorMessage("Please select at least one task.");
    //   return;
    // }


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
    }
    console.log("data", data);
    try {
      const response = await fetch("/api/teacher/peerreviewconfigure/peerreview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("result", result);
      if (result.status === 200) {
        alert("Peer review created successfully.");
      } else {
        alert("Failed to create peer review.");
      }
    } catch (error) {
      console.error("Error creating peer review:", error);
    }
  }

  const getAssignmentData = async () => {
    try {
      const response = await fetch(
        `/api/teacher/assignment?assignmentId=${assignmentId}`
      );
      const data = await response.json();
      const assignmentData = data.data;
      console.log("assignmentData", data.data);
      setAssignmentName(assignmentData.title);
      if (assignmentData.assignmentType === 1) {
        setAssignmentType("Group");
      } else if (assignmentData.assignmentType === 2) {
        setAssignmentType("Individual");
      }

      console.log("assignmentData", assignmentData);
    } catch (error) {
      console.error("Error fetching assignment data:", error);
    }
  };
  const groupData = async () => {
    try {
      const response = await fetch(
        `/api/teacher/course/group?courseId=${courseId}`
      );
      const data = await response.json();
      const groupData = data.data;
      console.log("groupData", groupData);
      if (!groupData || !Array.isArray(groupData) || groupData.length === 0) {
        console.log("groupData is not a valid array:", groupData);
        setPeerReviewTable(undefined);
        return;
      }
      //get name and id from groupData and set to setGroupDetail
      const transformedData = groupData.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        courseId: item.courseId,
        groupId: item.groupId,
      }));
      console.log("transformedData", transformedData);
      setGroupDetail(transformedData);
    } catch (error) {
      console.error("Error fetching group data:", error);
    }
  };

  const studentData = async () => {
    try {
      const response = await fetch(
        `/api/teacher/course/student?courseId=${courseId}`
      );
      const data = await response.json();
      const studentData = data.data;
      console.log("studentData", studentData);
      if (
        !studentData ||
        !Array.isArray(studentData) ||
        studentData.length === 0
      ) {
        console.log("studentData is not a valid array:", studentData);
        setPeerReviewTable(undefined);
        return;
      }
      //get name and id from studentData and set to setStudentDetail
      const transformedData = studentData.map((item: any) => ({
        // id: item.studentId,
        name: item.__student__?.name,
        studentId: item.studentId,
        // groupId: item.groupId,
      }));
      console.log("transformedData", transformedData);
      setStudentDetail(transformedData);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const getGroupMemberData = async () => {
    try {
      const response = await fetch(
        `/api/teacher/course/group/groupmember?courseId=${courseId}`
      );
      const data = await response.json();
      const groupMemberData = data.data;
      console.log("groupMemberData", groupMemberData);
      setGroupMemberData(groupMemberData);
    } catch (error) {
      console.error("Error fetching group member data:", error);
    }
  };
  // ประเภท reviewer
  type ReviewerType = "group" | "individual";
  type ReviewMethod = "manual" | "random";

  // อินเทอร์เฟซสำหรับ Factory
  interface ReviewerTable {
    renderTable(): ReactNode;
  }
  // ==== Concrete Products ====
  class RandomIndividualTable implements ReviewerTable {
    renderTable(): ReactNode {
      return <div>TableRandomIndividual</div>; // ตัวอย่างการคืนค่า ReactNode
    }
  }

  class RandomGroupTable implements ReviewerTable {
    renderTable(): ReactNode {
      return <div>TableRandomGroup</div>; // ตัวอย่างการคืนค่า ReactNode
    }
  }

  class ManualIndividualTable implements ReviewerTable {
    renderTable(): ReactNode {
      return <div>TableManualIndividual</div>; // ตัวอย่างการคืนค่า ReactNode
    }
  }

  class ManualGroupTable implements ReviewerTable {
    renderTable(): ReactNode {
      return <div>TableManualGroup</div>; // ตัวอย่างการคืนค่า ReactNode
    }
  }

  // ==== Factory Method ====
  function createReviewerTable(
    reviewerType: ReviewerType,
    method: ReviewMethod
  ): ReviewerTable {
    if (method === "manual" && reviewerType === "group") {
      return new ManualGroupTable();
    }
    if (method === "manual" && reviewerType === "individual") {
      return new ManualIndividualTable();
    }
    if (method === "random" && reviewerType === "group") {
      return new RandomGroupTable();
    }
    return new RandomIndividualTable();
  }

  // const handleAddReviewer = (
  //   index: number,
  //   id: string | number,
  //   name: string
  // ) => {
  //   setSelectedReviewers((prev) => {
  //     const currentReviewers = prev[index] || [];
  //     console.log("currentReviewers", currentReviewers);
  //     if (currentReviewers.length < numberOfReviewers) {
  //       return {
  //         ...prev,
  //         [index]: [...currentReviewers, { id, name }],
  //       };
  //     } else {
  //       alert(
  //         `You can only select up to ${numberOfReviewers} reviewers for this task.`
  //       );
  //       return prev;
  //     }
  //   });
  // };

  const handleSelectAll = () => {
    const newState: Record<number, boolean> = {};
    const isSelectingAll = !isSelectAll; // toggle select all state

    (assignmentType === "Group" ? groupDetail : studentDetail).forEach(
      (_, index) => {
        newState[index] = isSelectingAll; // ตั้งค่า true หรือ false สำหรับทุกแถว
      }
    );

    setSelectedTasks(newState);
    setIsSelectAll(isSelectingAll); // อัปเดตสถานะ select all
  };

  const handleTaskSelection = (index: number) => {
    setSelectedTasks((prev) => {
      const updated = { ...prev, [index]: !prev[index] }; // toggle ค่า checkbox ของแถวที่เลือก
      const allSelected = Object.values(updated).every((value) => value); // ตรวจสอบว่าเลือกทั้งหมดหรือไม่
      setIsSelectAll(allSelected); // อัปเดตสถานะ select all
      return updated;
    });
  };
  const filterReviewersForTask = (task: any, index: number) => {
    let filtered: any[] = [];
    console.log("filterReviewersForTask", task, index);
    console.log("groupMemberData:", groupMemberData);
    if (assignmentType === "Group" && reviewerType === "individual") {
      const membersInGroup = groupMemberData
        .filter((member) => member.__group__.id === Number(task.id))
        .map((member) => member.__user__.id);

      console.log(
        `👥 Group ${task.name} (id: ${task.id}) has members:`,
        membersInGroup
      );

      const filtered = studentDetail.filter(
        (student) => !membersInGroup.includes(Number(student.studentId)) // แปลง student.studentId เป็น number
      );

      console.log(`✅ Filtered reviewers for index ${index}:`, filtered);
      setFilteredReviewerByIndex((prev) => ({
        ...prev,
        [index]: filtered,
      }));
    }
    
  };


  // const filterReviewers = (task: any) => {
  //   let filtered: any[] = [];

  //   if (assignmentType === "Group") {
  //     if (reviewerType === "individual") {
  //       // ✅ หาสมาชิกในกลุ่ม task.id
  //       const membersInGroup = groupMemberData
  //         .filter((member) => member.__group__.id === task.id)
  //         .map((member) => member.__user__.id);

  //       // ✅ filter student ที่ไม่อยู่ในกลุ่มนั้น
  //       filtered = studentDetail.filter(
  //         (student) => !membersInGroup.includes(student.studentId)
  //       );
  //     } else {
  //       // ถ้า reviewerType เป็น group → แสดงกลุ่มอื่นที่ไม่ใช่ task group
  //       filtered = groupDetail.filter((group) => group.id !== task.id);
  //     }
  //   }

  //   // รองรับ assignmentType === "Individual" ได้ในภายหลัง
  //   console.log("Filtered Reviewers:", filtered);
  //   setFilteredReviewer(filtered);
  // };

  useEffect(() => {
    if (courseId) {
      // getAssignmentData();
      // groupData();
      // studentData();
      // getGroupMemberData();
    }
  }, []);

  useEffect(() => {
    // เรียกใช้ Factory Method เพื่อสร้างตารางตามค่าที่เลือก
    const table = createReviewerTable(
      reviewerType as ReviewerType,
      reviewMethod
    );
    setPeerReviewTable(table.renderTable());
  }, [reviewMethod, reviewerType]);

 useEffect(() => {
   const tasks = assignmentType === "Group" ? groupDetail : studentDetail;
   tasks.forEach((task, idx) => {
     filterReviewersForTask(task, idx);
   });
 }, [assignmentType, reviewerType, groupMemberData]);


  return (
    <>
      <BreadcrumbTeacher pageName="Create" pageMain="Peer Review" />
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 rounded-lg">
        <h3 className="text-lg text-dark">
          To Create Peer Review fill in detail below
        </h3>
        <p className="text-gray-500 text-sm">Create peer review Page</p>
      </div>
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 grid grid-cols-2 rounded-lg">
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
            type="number"
            value={numberOfReviewers.toString()}
            handleChange={(e) => setNumberOfReviewers(Number(e.target.value))}
          />
          <DatePickerOneTeacher
            title="Out Date"
            value={outDate}
            onChange={(date: Date) => setOutDate(date)}
          />
          <DatePickerOneTeacher
            title="Due Date"
            value={dueDate}
            onChange={(date: Date) => setDueDate(date)}
          />
          <div className="mb-4">
            <label className="text-body-sm font-medium text-dark dark:text-white">
              Review Method
              <span className="ml-1 select-none text-red">*</span>
            </label>
            <TeacherRadioInput
              name="peerReviewMethod"
              label="Manual"
              label2="(Limited to 5 Groups)"
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
            <p>Selected Review Method: {reviewMethod}</p>
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
              Select Group to be reviewed
              <span className="ml-1 select-none text-red">*</span>
            </label>
            <div>{peerReviewTable}</div>

            <Table className="border">
              <TableHeader>
                <TableRow className="border bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                  <TableHead>
                    <CheckboxTeacher
                      name="selectAll"
                      label=""
                      withIcon="check"
                      checked={isSelectAll}
                      onChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>No.</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead>Reviewers</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {(assignmentType === "Group" ? groupDetail : studentDetail).map(
                  (item, index) => (
                    <TableRow
                      key={index}
                      className="border-[#eee] dark:border-dark-3"
                    >
                      <TableCell>
                        <div>
                          <CheckboxTeacher
                            name={`taskSelected-${index}`}
                            label=""
                            withIcon="check"
                            checked={!!selectedTasks[index]} // ใช้ state selectedTasks
                            onChange={() => handleTaskSelection(index)} // เรียก handleTaskSelection เมื่อคลิก
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p>{index + 1}</p> {/* ไล่ลำดับจาก index */}
                      </TableCell>
                      <TableCell>
                        <p>{item.name}</p> {/* ช่อง Task แสดงชื่อ */}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <Select
                              label=""
                              items={(filteredReviewerByIndex[index] || []).map(
                                (reviewer) => ({
                                  label: reviewer.name,
                                  value:
                                    reviewerType === "individual"
                                      ? reviewer.studentId?.toString()
                                      : reviewer.id?.toString(),
                                })
                              )}
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
                                alert(
                                  "Please select a reviewer before adding."
                                );
                                return;
                              }

                              setSelectedReviewers((prev) => {
                                const currentReviewers = prev[index] || [];
                                if (
                                  currentReviewers.length < numberOfReviewers
                                ) {
                                  return {
                                    ...prev,
                                    [index]: [
                                      ...currentReviewers,
                                      tempReviewer,
                                    ],
                                  };
                                } else {
                                  alert(
                                    `You can only select up to ${numberOfReviewers} reviewers for this task.`
                                  );
                                  return prev;
                                }
                              });

                              // ล้างค่าชั่วคราวหลังจากเพิ่ม
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
                            ?.map(
                              (reviewer: {
                                id: string | number;
                                name: string;
                              }) => reviewer.name
                            )
                            .join(", ")}
                        </p>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
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
