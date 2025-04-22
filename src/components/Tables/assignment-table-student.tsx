import { TrashIcon, PencilSquareIcon, AddCircleOutlineIcon } from "@/assets/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PeerReviewItem {
  id: string;
  assignmentName: string;
  assignmentId?: string;
  peerReviewId?: string;
  courseId: string;
  dueDate: string;
  createPeerReview?: boolean;
  submitAssignment?: boolean;
  submitPeerReview?: boolean;
}

interface AssignmentTableStudentProps {
  data: PeerReviewItem[];
  isPeerReview: boolean;
  isStudent: boolean;
  courseId?: string;  
}

export function AssignmentTableStudent(props: AssignmentTableStudentProps) {
  const data = props.data;
  const isPeerReview = props.isPeerReview;
  const isStudent = props.isStudent;
  const courseId = props.courseId;
  const router = useRouter();

  return (
    <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          {isPeerReview ? "Peer Review Summary" : "Assignment Summary"}
        </h2>
        {!isPeerReview && !isStudent ? (
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
            onClick={() => {
              router.push(
                `/main-teacher/course/${courseId}/peer-review-summary/assignment/create`
              );
            }}
          >
            Create Assignment
          </button>
        ) : (
          <></>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead>ID</TableHead>
            <TableHead>{!isPeerReview ? "ASSIGNMENT NAME" : "PEER-REVIEW NAME"}</TableHead>
            <TableHead className="text-center">DUE DATE</TableHead>
            {isStudent && !isPeerReview ? <TableHead className="text-center">STATUS</TableHead> : <></>}
            <TableHead className="text-center">{isStudent ? "VIEW ASSIGNMENT" : "VIEW DETAIL"}</TableHead>
            <TableHead className="text-center">
              {isStudent ? "VIEW PEER-REVIEW"
                :isPeerReview ? "EDIT PEER-REVIEW" : "EDIT ASSIGNMENT"}
            </TableHead>
            {!isPeerReview && !isStudent ? (
              <TableHead className="text-center">CREATE PEER-REVIEW</TableHead>
            ) : (
              <TableHead className="text-center"></TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className="border-[#eee] dark:border-dark-3">
              <TableCell>
                <h5 className="text-dark dark:text-white">{index + 1}</h5>
              </TableCell>
              <TableCell>
                <h5 className="text-dark dark:text-white">
                  {item.assignmentName}
                </h5>
              </TableCell>
              <TableCell>
                <p className="text-dark dark:text-white text-center">
                  {dayjs(item.dueDate).format("DD MMM YYYY")}
                </p>
              </TableCell>
              {isStudent && !isPeerReview
                ? (<TableCell className="text-center">
                  {!item.submitAssignment ? (
                    <h5 className="text-[#D34053] dark:text-white text-center">
                      Not Submit
                    </h5>
                  ) : (
                    <h5 className="text-[#219653] dark:text-white text-center">
                      Submit
                    </h5>
                  )}
                  </TableCell>
                ) : (<></>)
              }
              <TableCell className="text-center">
                {isStudent && isPeerReview
                  ?(!item.submitPeerReview ? (
                    <h5 className="text-[#D34053] dark:text-white text-center">
                    Not Submit
                    </h5>
                  ) : (
                    <h5 className="text-[#219653] dark:text-white text-center">
                    Submit
                    </h5>
                  ))
                  :(<Link
                    href={
                      item.submitAssignment
                        ? `/main-student/course/${item.courseId}/assignment/${item.assignmentId}`
                        : `/main-student/course/${item.courseId}/assignment/${item.assignmentId}/submit`
                    }
                    className="text-primary"
                  >                    
                    {item.submitAssignment ? "View" : ""}
                    {!item.submitAssignment ? "Submit" : ""}
                  </Link>)
                  }
              </TableCell>
              <TableCell className="text-center">
                <Link
                  href={                    
                      `/main-student/course/${item.courseId}/peer-review-summary/peer-review/${item.peerReviewId}`                                            
                  }
                  className="text-primary flex justify-center items-center"
                >
                  {item.peerReviewId != null ? "View": null}
                  
                </Link>
              </TableCell>
              <TableCell className="text-center">
                {!isPeerReview && !isStudent ? (
                  item.createPeerReview ? (
                    <span
                      className="text-gray-400 cursor-not-allowed flex justify-center items-center"
                      aria-disabled="true"
                    >
                      <AddCircleOutlineIcon className="h-5 w-5" />
                    </span>
                  ) : (
                    <Link
                      href={`/main-teacher/course/${item.courseId}/peer-review-summary/assignment/${item.id}/peer-review/create`}
                      className="text-primary flex justify-center items-center"
                    >
                      <AddCircleOutlineIcon className="h-5 w-5" />
                    </Link>
                  )
                ) : (
                  <></>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
