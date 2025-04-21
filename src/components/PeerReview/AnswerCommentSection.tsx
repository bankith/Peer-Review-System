import { PeerReviewCommentDto } from "@/dtos/PeerReview/Comment/PeerReviewCommentDto";
import { PeerReviewSubmission } from "@/entities/PeerReviewSubmission";
import Image from "next/image";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { StudentModel } from "@/models/StudentModel";
import { AddCommentDto } from "@/dtos/PeerReview/AddComment/AddNotificationDto";
import InputGroup from "../FormElements/InputGroup";
import { toast } from "react-toastify";
import { InstructorModel } from "@/models/InstructorModel";


interface AnswerCommentProps {
  peerReviewSubmission: PeerReviewSubmission | undefined;  
  canScore: boolean;
  isGrading: boolean;
  peerReviewSubmissionId: number | undefined;
}

const AnswerCommentSection = ({ peerReviewSubmission, canScore, peerReviewSubmissionId, isGrading = false }: AnswerCommentProps) => {
  const answerRef = useRef<HTMLTextAreaElement>(null);  
  const [score, setScore] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  if(!peerReviewSubmission){
    peerReviewSubmission = new PeerReviewSubmission();
    if(peerReviewSubmissionId){
      peerReviewSubmission.id = peerReviewSubmissionId;
    }
  }
  return (
    <>     <form onSubmit={e=>{
              e.preventDefault();
              setIsSubmitting(true);
              if(isGrading){
                InstructorModel.instance.AddCommentAndGrading(peerReviewSubmission.id, answerRef.current?.value ?? "", parseInt(score))
                .then((response) => {
                  setIsSubmitting(false);
                  toast.success("Success!", {position: "bottom-center",});
                })
                .catch((error) => {
                  setIsSubmitting(false);
                  console.error("Error", error);                  
                });
                return;
              }

              if(canScore){
                StudentModel.instance.AddCommentAndScore(peerReviewSubmission.id, answerRef.current?.value ?? "", parseInt(score))
                .then((response) => {
                  setIsSubmitting(false);
                  toast.success("Success!", {position: "bottom-center",});
                })
                .catch((error) => {
                  setIsSubmitting(false);
                  console.error("Error", error);                  
                });

                
              }else{
                StudentModel.instance.AddCommentForPeerReviewer(peerReviewSubmission.id, answerRef.current?.value ?? "")
                .then((response) => {
                  setIsSubmitting(false);
                  toast.success("Success!", {position: "bottom-center",});
                })
                .catch((error) => {
                  setIsSubmitting(false);
                  console.error("Error", error);                  
                });
              }
            }}>
            {canScore ? <InputGroup
              className="mb-4"
              label="Score"
              placeholder="1"
              subtitle=""
              min={0}
              max={10}     
              required={true}         
              type="number"
              value={score}
              handleChange={(e) => setScore(e.target.value)}
            /> : null }
            
            <div className="relative mt-3 [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:left-5.5 [&_svg]:top-5.5">
              <textarea              
                rows={6}
                placeholder="Type your message"         
                ref={answerRef}     
                className={cn(
                  "w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary",
                  "py-5 pl-13 pr-5"
                )}
                required={true}
              />
            </div>
            <button className="flex justify-center rounded-lg bg-primary p-[8px] px-[25px] font-medium text-white hover:bg-opacity-90"
            type="submit"
            onClick={(e)=>{
              
            }}>
              Sumbit Comment
              {isSubmitting && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
            )}
            </button>
          </form>
      </>
  );
};

export default AnswerCommentSection;
