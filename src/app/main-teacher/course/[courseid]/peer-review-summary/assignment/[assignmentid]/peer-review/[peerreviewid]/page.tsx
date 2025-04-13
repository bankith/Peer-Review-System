"use client";
import { useEffect, useState, ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { get } from "http";

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
  const [numberOfGroups, setNumberOfGroups] = useState(2); // จำนวนกลุ่มที่ต้องการสุ่ม
  const [randomizedGroups, setRandomizedGroups] = useState<any[]>([]); // เก็บผลลัพธ์การสุ่ม
  const [errorRandomMessage, setErrorRandomMessage] = useState<string>("");
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
    console.log("data", data);
    try {
      const response = await fetch(
        "/api/teacher/peerreviewconfigure/peerreview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      console.log("result", result);
      if (result.isError === false) {
        peerreviewId = result.data.id;
      } else {
        alert("Failed to create peer review.");
        router.push(`/main-teacher/course/${courseId}/peer-review-summary`);
      }
    } catch (error) {
      console.error("Error creating peer review:", error);
    }
    try {
      const response2 = await fetch(
        `/api/teacher/peerreviewconfigure/peerreviewsubmission?peerReviewId=${peerreviewId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result2 = await response2.json();
      console.log("result", result2);
      if (result2.isError === false) {
        alert("Peer review created successfully.");
        router;
      } else {
        alert("Failed to create peer review.");
      }
    } catch (error) {
      console.error("Error creating peer review:", error);
    }
  };

  const getPeerReviewData = async () => {
    try {
      const response = await fetch(
        `/api/teacher/course/peerreview?id=${peerReviewId}`
      );
      const data = await response.json();
      const peerReviewData = data.data;
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
      ); // ประเภท Assignment
      setCourseId(peerReviewData.__assignment__.courseId); // ID ของ Course
      setAssignmentId(peerReviewData.__assignment__.id); // ID ของ Assignment
    } catch (error) {
      console.error("Error fetching assignment data:", error);
    }
  };

  const getPeerReviewSubmissionData = async () => {
    try {
      const response = await fetch(
        `/api/teacher/course/peerreviewsubmissions?peerReviewId=${peerReviewId}`
      );
      const data = await response.json();
      const submissionData = data.data;

      console.log("peerReviewSubmissionData", submissionData);

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

      setPeerReviewSubmissionData(submissionData); // เก็บข้อมูลใน State
    } catch (error) {
      console.error("Error fetching peer review submission data:", error);
    }
  };

  const groupData = async () => {
    try {
      const response = await fetch(
        `/api/teacher/course/group?courseId=${courseId}`
      );
      const data = await response.json();
      const groupData = data.data;
      // console.log("groupData", groupData);
      if (!groupData || !Array.isArray(groupData) || groupData.length === 0) {
        // console.log("groupData is not a valid array:", groupData);
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
      // console.log("transformedData", transformedData);
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
      // console.log("studentData", studentData);
      if (
        !studentData ||
        !Array.isArray(studentData) ||
        studentData.length === 0
      ) {
        // console.log("studentData is not a valid array:", studentData);
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
      // console.log("transformedData", transformedData);
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
      // console.log("groupMemberData", groupMemberData);
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
    if (assignmentType === "Group" && reviewerType === "individual") {
      const membersInGroup = groupMemberData
        .filter((member) => member.__group__.id === Number(task.id))
        .map((member) => member.__user__.id);

      const filtered = studentDetail.filter(
        (student) => !membersInGroup.includes(Number(student.studentId))
      );
      setFilteredReviewerByIndex((prev) => ({
        ...prev,
        [index]: filtered,
      }));
    }
  };

  const handleRandomize = () => {
    const tasks = assignmentType === "Group" ? groupDetail : studentDetail;

    // กรองเฉพาะ Task ที่ถูกเลือก
    const selectedTasksArray = tasks.filter((_, index) => selectedTasks[index]);
    if (selectedTasksArray.length === 0) {
      // หากไม่มี Task ถูกเลือก
      setErrorRandomMessage(
        "Please select at least one task before randomizing."
      );
      return;
    }

    setErrorRandomMessage("");
    const newSelectedReviewers: Record<number, any[]> = {}; // เก็บ reviewers ที่สุ่มได้
    const newRandomizedGroups: any[] = []; // เก็บผลลัพธ์การสุ่ม

    // สุ่ม reviewers สำหรับแต่ละ task
    selectedTasksArray.forEach((task, index) => {
      const reviewers =
        reviewerType === "individual"
          ? studentDetail.filter((student) => {
              if (assignmentType === "Group") {
                // Reviewer ต้องไม่เป็นสมาชิกในกลุ่ม
                const membersInGroup = groupMemberData
                  .filter((member) => member.__group__.id === Number(task.id))
                  .map((member) => member.__user__.id);
                return !membersInGroup.includes(Number(student.studentId));
              } else {
                // Reviewer ต้องไม่ใช่ Student ที่อยู่ใน Task นี้
                return student.studentId !== task.studentId;
              }
            })
          : groupDetail.filter((group) => {
              if (assignmentType === "Group") {
                // Reviewer ต้องไม่อยู่ในกลุ่มที่เกี่ยวข้องกับ Task นี้
                return group.id !== task.id;
              } else {
                // Reviewer ต้องไม่อยู่ในกลุ่มที่ Student ใน Task นี้เป็นสมาชิก
                const studentGroupIds = groupMemberData
                  .filter(
                    (member) => member.__user__.id === Number(task.studentId)
                  )
                  .map((member) => member.__group__.id);
                return !studentGroupIds.includes(group.id);
              }
            });

      // สุ่ม Reviewer
      const randomizedReviewers = [...reviewers]
        .sort(() => Math.random() - 0.5)
        .slice(0, numberOfReviewers);

      // เก็บ reviewers ที่สุ่มได้ใน selectedReviewers
      newSelectedReviewers[index] = randomizedReviewers.map((reviewer) => ({
        id: reviewerType === "individual" ? reviewer.studentId : reviewer.id,
        name: reviewer.name,
      }));

      // เก็บผลลัพธ์การสุ่มใน randomizedGroups
      newRandomizedGroups.push({
        taskId: task.id,
        reviewers: randomizedReviewers.map((reviewer) => ({
          id: reviewerType === "individual" ? reviewer.studentId : reviewer.id,
          name: reviewer.name,
        })),
      });
    });

    setSelectedReviewers((prev) => ({
      ...prev,
      ...newSelectedReviewers,
    })); // อัปเดต selectedReviewers

    setRandomizedGroups(newRandomizedGroups); // อัปเดต randomizedGroups

    console.log("Randomized Groups:", newRandomizedGroups); // ตรวจสอบผลลัพธ์การสุ่ม
  };
 

  useEffect(() => {
    const fetchData = async () => {
      if (courseId) {
        try {
          // ดึงข้อมูลพื้นฐานก่อน
          await groupData(); // ดึงข้อมูลกลุ่ม
          await studentData(); // ดึงข้อมูลนักเรียน
          await getGroupMemberData(); // ดึงข้อมูลสมาชิกในกลุ่ม

          // ดึงข้อมูล Peer Review หลังจากข้อมูลพื้นฐานพร้อมแล้ว
          await getPeerReviewData();

          // ดึงข้อมูล Peer Review Submission หลังจากข้อมูลทั้งหมดพร้อม
          await getPeerReviewSubmissionData();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [courseId]);

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

    const updatedFilteredReviewerByIndex: Record<number, any[]> = {};
    tasks.forEach((task, idx) => {
      if (reviewerType === "individual") {
        // กรณี Reviewer Type เป็น Individual
        const membersInGroup = groupMemberData
          .filter((member) => member.__group__.id === Number(task.id))
          .map((member) => member.__user__.id);

        updatedFilteredReviewerByIndex[idx] = studentDetail.filter(
          (student) => !membersInGroup.includes(Number(student.studentId))
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

  useEffect(() => {
    if (peerReviewSubmissionData && peerReviewSubmissionData.length > 0) {
      const newSelectedTasks: Record<number, boolean> = {};
      const newSelectedReviewers: Record<number, any[]> = {};

      // Map peerReviewSubmissionData กับ task ทั้งหมด
      (assignmentType === "Group" ? groupDetail : studentDetail).forEach(
        (task, index) => {
          const relatedSubmissions = peerReviewSubmissionData.filter(
            (submission) => {
              if (assignmentType === "Group") {
                return submission.__revieweeGroup__?.id === task.id;
              } else {
                return submission.__reviewee__?.id === task.studentId;
              }
            }
          );

          // ตั้งค่า checked สำหรับ Task
          newSelectedTasks[index] = relatedSubmissions.length > 0;

          // ตั้งค่า Reviewer สำหรับ Task
          newSelectedReviewers[index] = relatedSubmissions.map(
            (submission) => ({
              id:
                reviewerType === "individual"
                  ? submission.__reviewer__?.id
                  : submission.__reviewerGroup__?.id,
              name:
                reviewerType === "individual"
                  ? submission.__reviewer__?.name
                  : submission.__reviewerGroup__?.name,
            })
          );
        }
      );

      setSelectedTasks(newSelectedTasks); // อัปเดต selectedTasks
      setSelectedReviewers(Object.values(newSelectedReviewers)); // อัปเดต selectedReviewers
    }
  }, [
    peerReviewSubmissionData,
    assignmentType,
    groupDetail,
    studentDetail,
    reviewerType,
  ]);

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
                  (item, index) => {
                    const reviewers = selectedReviewers[index] || []; // ดึง reviewers จาก selectedReviewers

                    return (
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
                              checked={!!selectedTasks[index]} // ใช้ selectedTasks เพื่อตั้งค่า checked
                              onChange={() => handleTaskSelection(index)} // toggle ค่าเมื่อคลิก
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <p>{index + 1}</p> {/* ลำดับของ task */}
                        </TableCell>
                        <TableCell>
                          <p>{item.name}</p> {/* ชื่อ task */}
                        </TableCell>
                        <TableCell>
                          {reviewMethod === "manual" ? (
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <Select
                                  label=""
                                  items={[
                                    { label: "Select Reviewer", value: "" }, // ตัวเลือกเริ่มต้น
                                    ...(
                                      filteredReviewerByIndex[index] || []
                                    ).map((reviewer, idx) => ({
                                      key: `${reviewerType}-${reviewer.id}-${idx}`,
                                      label: reviewer.name,
                                      value:
                                        reviewerType === "individual"
                                          ? reviewer.studentId?.toString()
                                          : reviewer.id?.toString(),
                                    })),
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
                                  const tempReviewer =
                                    tempSelectedReviewers[index];
                                  if (!tempReviewer) {
                                    alert(
                                      "Please select a reviewer before adding."
                                    );
                                    return;
                                  }

                                  setSelectedReviewers((prev) => {
                                    const currentReviewers = prev[index] || [];
                                    if (
                                      currentReviewers.length <
                                      numberOfReviewers
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
                          ) : (
                            <p className="text-primary text-start mt-3">
                              {reviewers
                                .map((reviewer) => reviewer.name)
                                .join(", ")}
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }
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
          <div className="flex justify-start">
            <button className="rounded-lg border border-red px-4 py-2 text-sm font-semibold text-red hover:bg-red/10">
              Delete Peer Review
            </button>
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
