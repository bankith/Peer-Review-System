import { AssignmentTypeEnum } from "@/entities/Assignment";
import { cn } from "@/lib/utils";

interface PeerReviewSubmissionAssignmentDetailProps {
  assignmentName: string;
  dueDate: string;
  assignmentType: AssignmentTypeEnum | undefined;
  description: string;
  question: string;
  answer: string;
  fileUploadedURL: string;

  studentName: string;
  studentGroupName: string;
}

const PeerReviewSubmissionAssignmentDetail = ({ assignmentName, dueDate, assignmentType, description, question, answer, fileUploadedURL, studentName, studentGroupName  }: PeerReviewSubmissionAssignmentDetailProps) => {

  return (
    <>
    
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 rounded-lg">
        <div>
          <p className="text-lg font-bold">{assignmentName}</p>
          <p className="text-sm text-gray-500 mb-4">{description}</p>

          <div className="text-sm grid grid-cols-5 gap-0 py-3">
            <div className="col-span-2 p-3">
              Question:
            </div>
            <div className="col-span-3 py-3 font-bold">
              {question}
            </div>

            {assignmentType == AssignmentTypeEnum.group ? 
              <>
                <div className="col-span-2 bg-gray-2 p-3">
                Student Owner:
                </div>
                <div className="col-span-3 bg-gray-2 py-3 font-bold">
                  {studentName}
                </div>
              </>
            : 
               <>                
                <div className="col-span-2 bg-gray-2 p-3">
                  Group:
                </div>
                <div className="col-span-3 bg-gray-2 py-3 font-bold">
                  {studentGroupName}
                </div>
              </>
            }
            
            <div className="col-span-2 p-3">
              Assignment Type:
            </div>
            <div className="col-span-3 py-3 font-bold">
              {assignmentType == AssignmentTypeEnum.group ? "Group" : "Individual"}
            </div>             

            <div className="col-span-2 bg-gray-2 p-3">
              Answer:
            </div>
            <div className="col-span-3 bg-gray-2 py-3 font-bold">
              {answer}
            </div>

            <div className="col-span-2 p-3">
              Attachment:
            </div>
            <div className="col-span-3 py-3 font-bold">
              {fileUploadedURL ? (
              <a
                href={fileUploadedURL}
                target="_blank"
                download
                className="text-primary underline hover:opacity-80"
              >
                Download file
              </a>
              ) : (
                <p>-</p>
              )}
            </div>
          </div>
          

        </div>
        
      </div>
      </>
  );
};

export default PeerReviewSubmissionAssignmentDetail;
