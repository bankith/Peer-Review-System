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
  courseId: string;
  dueDate: string;
  createPeerReview?: boolean;
}

interface PeerReviewTableProps {
  data: PeerReviewItem[];
  isPeerReview: boolean;
  courseId?: string;  
}

export function PeerReviewTable(props: PeerReviewTableProps) {
  const data = props.data;
  const isPeerReview = props.isPeerReview;
  const courseId = props.courseId;
  const router = useRouter();

  return (
    <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          {isPeerReview ? "Peer Review Summary" : "Assignment Summary"}
        </h2>
        {!isPeerReview ? (
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
            onClick={() => {
              router.push(
                `/main-teacher/Course/${courseId}/Peer-Review-Summary/Assignment/Peer-Review/Create`
              );
            }}
          >
            Create Peer Review
          </button>
        ) : (
          <></>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead>ID</TableHead>
            <TableHead>ASSIGNMENT NAME</TableHead>
            <TableHead className="text-center">DUE DATE</TableHead>
            <TableHead className="text-center">VIEW DETAIL</TableHead>
            <TableHead className="text-center">
              {isPeerReview ? "EDIT PEER-REVIEW" : "EDIT ASSIGNMENT"}
            </TableHead>
            {!isPeerReview ? (
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
                <h5 className="text-dark dark:text-white">{item.id}</h5>
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
              <TableCell className="text-center">
                <Link
                  href={
                    isPeerReview
                      ? `/main-teacher/Course/${item.courseId}/Peer-Review-Summary/Peer-Review/${item.assignmentId}/Peer-Review-Submission`
                      : `/main-teacher/Course/${item.courseId}/Peer-Review-Summary/Assignment/${item.id}`
                  }
                  className="text-primary"
                >
                  View
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <Link
                  href={
                    isPeerReview
                      ? `/main-teacher/Course/${item.courseId}/Peer-Review-Summary/Assignment/${item.assignmentId}/Peer-Review/${item.id}`
                      : `/main-teacher/Course/${item.courseId}/Peer-Review-Summary/Assignment/${item.id}`
                  }
                  className="text-primary flex justify-center items-center"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </Link>
              </TableCell>
              <TableCell className="text-center">
                {!isPeerReview ? (
                  item.createPeerReview ? (
                    <span
                      className="text-gray-400 cursor-not-allowed flex justify-center items-center"
                      aria-disabled="true"
                    >
                      <AddCircleOutlineIcon className="h-5 w-5" />
                    </span>
                  ) : (
                    <Link
                      href={`/main-teacher/Course/${item.courseId}/Peer-Review-Summary/Assignment/${item.id}/Peer-Review/Create`}
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
