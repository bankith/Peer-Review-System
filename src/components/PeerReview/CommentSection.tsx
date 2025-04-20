import { PeerReviewCommentDto } from "@/dtos/PeerReview/Comment/PeerReviewCommentDto";
import Image from "next/image";


interface CommentProps {
  peerReviewComment: PeerReviewCommentDto;
  reviewrNumber: number
}

const CommentSection = ({ peerReviewComment, reviewrNumber }: CommentProps) => {

  var cl = "py-1 px-5";
  if(reviewrNumber > 0){
    cl += " ml-10";
  }
  if(reviewrNumber%2 == 0){
    cl += " bg-gray-2";
  }

  return (
    <>     
            
            <div className={cl}>
            <div className="grid grid-cols-6 gap-0 py-3">
              
              <Image 
                src={peerReviewComment.profilePictureUrl}
                className="rounded-full object-cover"
                width={40}          
                height={40}
                alt="logo"
              />
              <div className="col-span-3">
                <p className="text-xs text-dark font-bold">{peerReviewComment.user.name}</p>                
              </div>
              <div className="col-span-2">
                <p className="text-tiny text-dark">{new Date(peerReviewComment.createdDate).toLocaleDateString()} {new Date(peerReviewComment.createdDate).toLocaleTimeString()}</p>                
              </div>              
            </div>
            <p className="my-2 text-xl text-dark">{peerReviewComment.comment}</p>
            </div>                        
            
      </>
  );
};

export default CommentSection;
