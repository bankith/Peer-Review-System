import { TrashIcon, PencilSquareIcon, AddCircleOutlineIcon } from "@/assets/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { getInvoiceTableData } from "./fetch";
import { DownloadIcon, PreviewIcon } from "./icons";

export function PeerReviewTable(props: any) {
  const data = props.data;
  const isPeerReview = props.isPeerReview;

  return (
    <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex items-center justify-between">
    <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
      {isPeerReview ? "Peer Review Summary" : "Assignment Summary"}
    </h2>
    {!isPeerReview ? (
      <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
        Create Peer Review
        </button>
        ) : (<></>)}
        </div>
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead>ID</TableHead>
            <TableHead>ASSIGNMENT NAME</TableHead>
            <TableHead>DUE DATE</TableHead>
            <TableHead className="text-center">EDIT ASSIGNMENT</TableHead>
            <TableHead className="text-center">
              {isPeerReview ? "CREATE GRADING" : "CREATE PEER REVIEW"}
            </TableHead>
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
                <p className="text-dark dark:text-white ml-3">
                  {dayjs(item.dueDate).format("MMM DD, YYYY")}
                </p>
              </TableCell>
              <TableCell className="flex justify-center">
                <a href="/" className="text-primary">
                  <PencilSquareIcon className="h-5 w-5" />
                </a>
              </TableCell>
              <TableCell className="text-center">
                <button
                  className={`cursor-pointer ${
                    item.createPeerReview ? "text-gray-400 cursor-not-allowed" : "text-primary"
                  }`}
                  disabled={!item.createPeerReview}
                >
                  <AddCircleOutlineIcon className="h-5 w-5" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
