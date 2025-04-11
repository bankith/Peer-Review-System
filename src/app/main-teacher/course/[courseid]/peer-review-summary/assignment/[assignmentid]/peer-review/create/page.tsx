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
  const [dueDate, setDueDate] = useState();
  const [outDate, setOutDate] = useState();
  const [reviewTitle, setReviewTitle] = useState("");
  const [assignmentId, setAssignmentId] = useState(assignmentid);
  const [assignmentTable, setAssignmentTable] = useState<React.ReactNode>();
  const [peerReviewTable, setPeerReviewTable] = useState<React.ReactNode>();
  const [reviewMethod, setReviewMethod] = useState<ReviewMethod>("manual");
  const [reviewerType, setReviewerType] = useState<string>("individual");
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
  }

  const studentData = async () => {
    try {
      const response = await fetch(
        `/api/teacher/course/student?courseId=${courseId}`
      );
      const data = await response.json();
      const studentData = data.data;
      console.log("studentData", studentData);
      if (!studentData || !Array.isArray(studentData) || studentData.length === 0) {
        console.log("studentData is not a valid array:", studentData);
        setPeerReviewTable(undefined);
        return;
      }
      //get name and id from studentData and set to setStudentDetail
      const transformedData = studentData.map((item: any) => ({
        // id: item.studentId,
        name: item.__student__?.name,
        courseId: item.courseId,
        // groupId: item.groupId,
      }));
      console.log("transformedData", transformedData);
      setStudentDetail(transformedData);

    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  }
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

  useEffect(() => {
    if (courseId) {
        getAssignmentData();
        groupData();
        studentData();
    }
  }, [courseId]);

    useEffect(() => {
      // เรียกใช้ Factory Method เพื่อสร้างตารางตามค่าที่เลือก
      const table = createReviewerTable(
        reviewerType as ReviewerType,
        reviewMethod
      );
      setPeerReviewTable(table.renderTable());
    }, [reviewMethod, reviewerType]);

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
            />
            <CheckboxTeacher
              name="peerReviewType"
              label="Score Review (0-10)"
              withIcon="check"
            />
          </div>
          <InputGroup
            className="mb-4"
            label="Number of Reviewers Per Assignment"
            placeholder="1"
            type="number"
          />
          <div className="mb-4">
            <DatePickerOneTeacher title="Out Date" />
          </div>
          <div className="mb-4">
            <DatePickerOneTeacher title="Due Date" />
          </div>
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
              onChange={handleReviewMethodChange}
            />
            <TeacherRadioInput
              name="peerReviewMethod"
              label="Random"
              value="random"
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
              onChange={handleReviewerTypeChange}
            />
            <TeacherRadioInput
              name="reviewerType"
              label="Group"
              value="group"
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
                      name="taskSelected"
                      label=""
                      withIcon="check"
                    />
                  </TableHead>
                  <TableHead>No.</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead>Reviewers</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow className="border-[#eee] dark:border-dark-3">
                  <TableCell>
                    <div>
                      <CheckboxTeacher
                        name="taskSelected"
                        label=""
                        withIcon="check"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>1</p>
                  </TableCell>
                  <TableCell>
                    <p>Group A</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <Select
                          label=""
                          items={[
                            { label: "Group A", value: "1" },
                            { label: "Group B", value: "2" },
                            { label: "Group C", value: "3" },
                          ]}
                          defaultValue="1"
                        />
                      </div>

                      <AddCircleOutlineIcon className="h-5 w-5 text-primary ml-2 cursor-pointer" />
                    </div>
                    <p className="text-primary text-start mt-3">
                      Group B,Group C
                    </p>
                  </TableCell>
                </TableRow>
                <TableRow className="border-[#eee] dark:border-dark-3">
                  <TableCell>
                    <div>
                      <CheckboxTeacher
                        name="taskSelected"
                        label=""
                        withIcon="check"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>1</p>
                  </TableCell>
                  <TableCell>
                    <p>Group A</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <Select
                          label=""
                          items={[
                            { label: "Group A", value: "1" },
                            { label: "Group B", value: "2" },
                            { label: "Group C", value: "3" },
                          ]}
                          defaultValue="1"
                        />
                      </div>

                      <AddCircleOutlineIcon className="h-5 w-5 text-primary ml-2 cursor-pointer" />
                    </div>
                    <p className="text-primary text-start mt-3">
                      Group B,Group C
                    </p>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="mb-4">
            <label className="text-body-sm font-medium text-dark dark:text-white">
              Reviewer-Reviewee Anonymity Setting
              <span className="ml-1 select-none text-red">*</span>
            </label>
            <CheckboxTeacher
              name="anonymous"
              label="Anonymous (Reviewer Name Hidden)"
              withIcon="check"
            />
            <CheckboxTeacher
              name="anonymous"
              label="Anonymous (Reviewee Name Hidden)"
              withIcon="check"
            />
          </div>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
            Create Peer Review
          </button>
        </div>
      </div>
    </>
  );
};

export default CreatingPeerReviewPage;
