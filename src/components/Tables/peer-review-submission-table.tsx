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

interface PeerReviewSubmissionItem {
  id: string;
  revieweeName: string;
  peerReviewId?: string;
  courseId: string;
  dueDate: string;
  createPeerReview?: boolean;
}

interface PeerReviewSubmissionTableProps {
  data: PeerReviewSubmissionItem[];
  peerReviewId?: string; 
  courseId?: string;  
}

export function PeerReviewSubmissionTable(props: PeerReviewSubmissionTableProps) {
  const data = props.data;
  const courseId = props.courseId;
  const router = useRouter();

  return (
    <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Peer Review Submission Summary
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead>ID</TableHead>
            <TableHead>GROUP/STUDENT NAME</TableHead>
            <TableHead className="text-center">DUE DATE</TableHead>
            <TableHead className="text-center">VIEW DETAIL</TableHead>
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
                  {item.revieweeName}
                </h5>
              </TableCell>
              <TableCell>
                <p className="text-dark dark:text-white text-center">
                  {dayjs(item.dueDate).format("DD MMM YYYY")}
                </p>
              </TableCell>
              <TableCell className="text-center">
                <Link
                  href={`/main-teacher/Course/${item.courseId}/Peer-Review-Summary/Peer-Review/${item.peerReviewId}/Peer-Review-Submission`}
                      
                  className="text-primary"
                >
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
