import { PeerReviewCommentDto } from "@/dtos/PeerReview/Comment/PeerReviewCommentDto";
import { AssignmentTypeEnum } from "@/entities/Assignment";
import { PeerReview, ReviewerTypeEnum } from "@/entities/PeerReview";
import { PeerReviewComment } from "@/entities/PeerReviewComment";
import { PeerReviewSubmission } from "@/entities/PeerReviewSubmission";
import { cn } from "@/lib/utils";
import CommentSection from "./CommentSection";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import AnswerCommentSection from "./AnswerCommentSection";

interface PeerReviewSubmissionGradingProps {
  peerReview: PeerReview | undefined;
  peerReviewSubmission: PeerReviewSubmission | undefined;
  comment: PeerReviewCommentDto | undefined;
  isAnswerSectionEnable: boolean;
  isReviewee: boolean;
}

const PeerReviewSubmissionGrading = ({ peerReview, peerReviewSubmission, comment, isAnswerSectionEnable = true, isReviewee }: PeerReviewSubmissionGradingProps) => {  

  return (
    <>     
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 rounded-lg">
        
        <h3 className="text-base text-dark font-bold">
          Grading
        </h3>
        <p className="text-gray-500 text-sm"> This is a grading section</p>
        <hr className="my-3"/>

        <div className="grid grid-cols-5 gap-0 py-3">
        <div className="text-3xl text-dark font-bold mt-10 text-center align-middle">{comment?.score ?? '-'}/10</div>
        <div className="col-span-4">
          <p className="text-sm text-dark font-bold my-3">Grader</p>

          {!comment ? <div>Waiting for the grading</div> :
          <>
          {!comment ? <CommentSection peerReviewComment={comment} reviewrNumber={1}/> : null} 
          
          {(peerReviewSubmission && isAnswerSectionEnable) ? <AnswerCommentSection peerReviewSubmission={peerReviewSubmission} canScore={comment ? true : false} isGrading={true} /> : null}
          </>
          }
        </div>

        </div>
        
      </div>
      </>
  );
};

export default PeerReviewSubmissionGrading;
