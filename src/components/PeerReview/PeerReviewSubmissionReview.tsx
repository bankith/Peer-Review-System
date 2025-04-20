import { PeerReviewCommentDto } from "@/dtos/PeerReview/Comment/PeerReviewCommentDto";
import { AssignmentTypeEnum } from "@/entities/Assignment";
import { PeerReview } from "@/entities/PeerReview";
import { PeerReviewComment } from "@/entities/PeerReviewComment";
import { PeerReviewSubmission } from "@/entities/PeerReviewSubmission";
import { cn } from "@/lib/utils";
import CommentSection from "./CommentSection";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import AnswerCommentSection from "./AnswerCommentSection";

interface PeerReviewSubmissionReviewProps {
  peerReview: PeerReview | undefined;
  peerReviewSubmission: PeerReviewSubmission | undefined;
  comments: PeerReviewCommentDto[] | [];
  reviewrNumber: number
}

const PeerReviewSubmissionReview = ({ peerReview, peerReviewSubmission, comments, reviewrNumber }: PeerReviewSubmissionReviewProps) => {

  return (
    <>     
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 rounded-lg">
        
        <h3 className="text-base text-dark font-bold">
          Reviews
        </h3>
        <p className="text-gray-500 text-sm"> This is a review section</p>
        <hr className="my-3"/>

        <div className="grid grid-cols-5 gap-0 py-3">
        <div className="text-4xl text-dark font-bold mt-10 text-center align-middle">{peerReviewSubmission?.reviewScore}/10</div>
        <div className="col-span-4">
          <p className="text-sm text-dark font-bold">Review {reviewrNumber}#</p>
          {comments.map((peerReviewComment: PeerReviewCommentDto, i) => {
            return (              
                <CommentSection key={i} peerReviewComment={peerReviewComment} reviewrNumber={i} />              
            );
          })}
          {peerReviewSubmission ? <AnswerCommentSection peerReviewSubmission={peerReviewSubmission} canScore={comments.length == 0 ? true: false} /> : null}
        </div>

        </div>
        
      </div>
      </>
  );
};

export default PeerReviewSubmissionReview;
