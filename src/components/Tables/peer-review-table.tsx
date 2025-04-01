import { TrashIcon, PencilSquareIcon } from "@/assets/icons";
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

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead>ID</TableHead>
            <TableHead>ASSIGNMENT NAME</TableHead>
            <TableHead>SUBMIT STATUS</TableHead>
            <TableHead>SUMMITTED TIME</TableHead>
            <TableHead className="text-center">VIEW DETAIL</TableHead>
            <TableHead className="text-center">CREATE PEER REVIEW</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className="border-[#eee] dark:border-dark-3">
              <TableCell className="">
                <h5 className="text-dark dark:text-white">{item.id}</h5>
              </TableCell>
              <TableCell className="">
                <h5 className="text-dark dark:text-white">
                  {item.assignmentName}
                </h5>
              </TableCell>
              <TableCell>
                <div
                  className={cn(
                    "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                    {
                      "bg-[#D1FAE5] text-[#065F46]":
                        item.submitStatus === "Configured",
                      "bg-[#CDCDCD] text-[#444444]":
                        item.submitStatus === "Not Configured",
                    }
                  )}
                >
                  {item.submitStatus}
                </div>
              </TableCell>
              <TableCell>
                <p className="text-dark dark:text-white ml-3">
                  {dayjs(item.submittedTime).format("MMM DD, YYYY")}
                </p>
              </TableCell>
              <TableCell className="text-center">
                <a href="/" className="text-primary dark:text-white">
                  {item.viewDetail}
                </a>
              </TableCell>

              <TableCell className="text-center">
                {/* <button className="hover:text-primary">
                    <span className="sr-only">View Invoice</span>
                    <PreviewIcon />
                  </button>

                  <button className="hover:text-primary">
                    <span className="sr-only">Delete Invoice</span>
                    <TrashIcon />
                  </button> */}

                <button className="hover:text-primary">
                  <span className="sr-only">Download Invoice</span>
                  <PencilSquareIcon />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
