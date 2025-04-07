"use client";
import { useEffect, useState } from "react";
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

const CreatingPeerReviewPage = () => {
  const params = useParams();
  const { courseid, assignmentid } = params;
  const [courseId, setCourseId] = useState(courseid);
  const [assignmentId, setAssignmentId] = useState(assignmentid);
  const [assignmentTable, setAssignmentTable] = useState<React.ReactNode>();
  const [peerReviewTable, setPeerReviewTable] = useState<React.ReactNode>();

  //   const getAssignmentData = async () => {
  //     try {
  //       const response = await fetch(
  //         `/api/teacher/assignments?courseId=${courseId}`
  //       );
  //       const data = await response.json();
  //       const assignmentData = data.data;

  //       if (!Array.isArray(assignmentData) || assignmentData.length === 0) {
  //         console.error("assignmentData is not a valid array:", assignmentData);
  //         setAssignmentTable(undefined);
  //         return;
  //       }

  //       const transformedData = assignmentData.map((item: any) => ({
  //         id: item.id.toString(),
  //         assignmentName: item.title,
  //         courseId: item.courseId,
  //         dueDate: item.outDate,
  //         createPeerReview: !item.isCreateReview,
  //       }));

  //       setAssignmentTable(
  //         <PeerReviewTable
  //           data={transformedData}
  //           isPeerReview={false}
  //           courseId={courseid?.toString()}
  //         />
  //       );
  //     } catch (error) {
  //       console.error("Error fetching assignment data:", error);
  //     }
  //   };
  //   const getPeerreviewData = async () => {
  //     try {
  //       const response = await fetch(
  //         `/api/teacher/peerreviews?courseId=${courseId}`
  //       );
  //       const data = await response.json();
  //       const peerreviewData = data.data;

  //       if (!Array.isArray(peerreviewData) || peerreviewData.length === 0) {
  //         console.error("peerreviewData is not a valid array:", peerreviewData);
  //         setPeerReviewTable(undefined);
  //         return;
  //       }
  //       // console.log("peerreviewData", peerreviewData);
  //       const transformedData = peerreviewData.map((item: any) => ({
  //         id: item.id.toString(),
  //         assignmentName: item.name,
  //         courseId: item.__assignment__?.courseId || null,
  //         assignmentId: item.__assignment__?.id || null,
  //         dueDate: item.outDate,
  //         createPeerReview: !item.isCreateReview,
  //       }));

  //       setPeerReviewTable(
  //         <PeerReviewTable
  //           data={transformedData}
  //           isPeerReview={true}
  //           courseId={courseid?.toString()}
  //         />
  //       );
  //     } catch (error) {
  //       console.error("Error fetching peer review data:", error);
  //     }
  //   };

  useEffect(() => {
    if (courseId) {
      //   getAssignmentData();
      //   getPeerreviewData();
    }
  }, [courseId]);

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
            placeholder="Assignment 3"
            type="text"
            disabled={true}
          />
          <InputGroup
            className="mb-4"
            label="Assignment Type"
            placeholder="Group"
            type="text"
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
            />
            <TeacherRadioInput name="peerReviewMethod" label="Random" />
          </div>
          <div className="mb-4">
            <label className="text-body-sm font-medium text-dark dark:text-white">
              Reviewer Type
              <span className="ml-1 select-none text-red">*</span>
            </label>
            <TeacherRadioInput name="reviewerType" label="Individual" />
            <TeacherRadioInput name="reviewerType" label="Group" />
          </div>

          <div className="mb-4">
            <label className="text-body-sm font-medium text-dark dark:text-white">
              Select Group to be reviewed
              <span className="ml-1 select-none text-red">*</span>
            </label>

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
