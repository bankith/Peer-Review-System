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
  reviewer: string;
  reviewee: string;
  updatedDate: string;
  submitPeerReview: boolean;
}

interface PeerReviewSubmissionTableProps {
  data: PeerReviewSubmissionItem[];
  peerReviewId?: string; 
  courseId?: string;  
  peerReviewName: string;
  reviewerType: string;
}

export function PeerReviewSubmissionTable(props: PeerReviewSubmissionTableProps) {
  const data = props.data;
  const peerReviewId = props.peerReviewId;
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
            <TableHead>REVIEWER</TableHead>
            <TableHead>REVIEWEE</TableHead>
            <TableHead className="text-center">SUBMIT STATUS</TableHead>
            <TableHead className="text-center">SUBMITTED TIME</TableHead>
            <TableHead className="text-center">VIEW DETAIL</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className="border-[#eee] dark:border-dark-3">
              <TableCell>
                <h5 className="text-dark dark:text-white text-center">{item.id}</h5>
              </TableCell>
              <TableCell>
                <h5 className="text-dark dark:text-white text-center">
                  {item.reviewer}
                </h5>
              </TableCell>
              <TableCell>
                <h5 className="text-dark dark:text-white text-center">
                  {item.reviewee}
                </h5>
              </TableCell>
              <TableCell>
                {!item.submitPeerReview ? (
                  <h5 className="text-[#D34053] dark:text-white text-center">
                  Not Submit
                  </h5>
                ) : (
                  <h5 className="text-[#219653] dark:text-white text-center">
                  Submit
                  </h5>
                )}
              </TableCell>
              <TableCell>
                <p className="text-dark dark:text-white text-center">
                  {dayjs(item.updatedDate).format("DD MMM YYYY hh:mm A")}
                </p>
              </TableCell>
              <TableCell className="text-center">
                <Link
                  href={`/main-teacher/course/${courseId}/peer-review-summary/peer-review/${peerReviewId}/peer-review-submission/${item.id}`}
                      
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
