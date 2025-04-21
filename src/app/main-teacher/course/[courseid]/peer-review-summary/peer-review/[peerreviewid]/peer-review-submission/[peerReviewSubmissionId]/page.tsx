"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";
import { StudentModel } from "@/models/StudentModel";
import { AssignmentDto } from "@/dtos/Assignment/AssignmentDto";
import { AssignmentTypeEnum } from "@/entities/Assignment";
import { cn } from "@/lib/utils";
import { CardSkeleton } from "@/app/main/(home)/_components/overview-cards/card-skeleton";
import { AssignmentSubmissionAnswerDto } from "@/dtos/Assignment/AssignmentSubmissionAnswerDto";
import { PeerReviewSubmissionForReviewDto } from "@/dtos/PeerReview/PeerReviewSubmission/PeerReviewSubmissionForReviewDto";
import PeerReviewSubmissionAssignmentDetail from "@/components/PeerReview/PeerReviewSubmissionAssignmentDetail";
import PeerReviewSubmissionReview from "@/components/PeerReview/PeerReviewSubmissionReview";
import { PeerReviewComment } from "@/entities/PeerReviewComment";
import { PeerReviewSubmission } from "@/entities/PeerReviewSubmission";
import { PeerReview } from "@/entities/PeerReview";
import { PeerReviewCommentDto } from "@/dtos/PeerReview/Comment/PeerReviewCommentDto";
import { PeerReviewSubmissionDataDto } from "@/dtos/PeerReview/PeerReviewSubmission/PeerReviewSubmissionDataDto";
import PeerReviewSubmissionGrading from "@/components/PeerReview/PeerReviewSubmissionGrading";


const PeerReviewGradingPage = () => {
  const params = useParams<{ courseid: string; peerReviewSubmissionId: string }>();
  const router = useRouter();
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const { courseid, peerReviewSubmissionId } = params;

  const [initLoading, setInitLoading] = useState(false);
  const [assignmentName, setAssignmentName] = useState<string>("");
  const [assignmentType, setAssignmentType] = useState<AssignmentTypeEnum>();
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date>();
  const [question, setQuestion] = useState<string>();
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fileUploadedURL, setFileUploadedURL] = useState("");
  const [studentName, setStudentName] = useState<string>("");
  const [studentGroupName, setStudentGroupName] = useState<string>("");

  const [peerReview, setPeerReview] = useState<PeerReview>();
  const [peerReviewSubmissionDataDtoList, setPeerReviewSubmissionDataDtoList] = useState<PeerReviewSubmissionDataDto[]>([]);

  const getPeerReviewSubmissionData = async (peerReviewSubmissionId: number) => {
    setInitLoading(true);
    StudentModel.instance.GetPeerReviewForReviewer(peerReviewSubmissionId).then(response => {      
      setInitLoading(false);
      const peerReviewSubmissionDto = response.data.data as PeerReviewSubmissionForReviewDto;      
      console.log(peerReviewSubmissionDto);
      if (peerReviewSubmissionDto) {        
        setAssignmentName(peerReviewSubmissionDto.assignment.title);
        setAssignmentType(peerReviewSubmissionDto.assignment.assignmentType);        
        setDescription(peerReviewSubmissionDto.assignment.description);
        setDueDate(peerReviewSubmissionDto.assignment.dueDate);
        if(peerReviewSubmissionDto.assignment.question){ setQuestion(peerReviewSubmissionDto.assignment.question.q1);}
        setAnswer(peerReviewSubmissionDto.assignmentSubmission?.answer.q1)
        setFileUploadedURL(peerReviewSubmissionDto.assignmentSubmission?.fileLink)
        setStudentName(peerReviewSubmissionDto.assignmentOwnerName)
        setStudentGroupName(peerReviewSubmissionDto.assignmentGroupOwnerName)
        
        setPeerReview(peerReviewSubmissionDto.peerReview);        
        
        if(peerReviewSubmissionDto.peerReviewSubmissionDataDtoList != null &&
          peerReviewSubmissionDto.peerReviewSubmissionDataDtoList.length > 0
        ){
          setPeerReviewSubmissionDataDtoList(peerReviewSubmissionDto.peerReviewSubmissionDataDtoList);
        }        
      }else{
        console.log("PeerReviewSubmissionForReviewerDto not found");
      }
    })    
    .catch(err => {
      console.log(err)
      setInitLoading(false);
    }); 
  };

  useEffect(() => {
    if (peerReviewSubmissionId) {
      setInitLoading(true);
      getPeerReviewSubmissionData(parseInt(peerReviewSubmissionId));
    }
  }, []);

  return (
    <>
      <BreadcrumbTeacher
        pageMain="Peer Review Summary"
        pageMainLink={`/main-student/course/${courseid}/peer-review-summary`}
        // subMainPage="Assignment Summary"
        // subMainPageLink={`/main-student/course/${courseid}/assignment-summary`}
        pageName="Peer Review Submission"
      />

      {initLoading ? <CardSkeleton />: 
      
      <>
      <PeerReviewSubmissionAssignmentDetail assignmentName={assignmentName} dueDate={dueDate ? new Date(dueDate).toLocaleDateString() : "Not set"}
          assignmentType={assignmentType} description={description} question={question ?? ""} answer={answer} 
          fileUploadedURL={fileUploadedURL} studentName={studentName} studentGroupName={studentGroupName} /> 

      {peerReviewSubmissionDataDtoList.map((peerReviewSubmissionDataDto, i) => (        
        <PeerReviewSubmissionGrading key={i} peerReview={peerReview} peerReviewSubmission={peerReviewSubmissionDataDto.peerReviewSubmission} comments={peerReviewSubmissionDataDto.commentsDto} reviewrNumber={i + 1} isAnswerSectionEnable={true} reviwerName={peerReviewSubmissionDataDto.reviewerName} reviwerGroupName={peerReviewSubmissionDataDto.reviewerGroupName} isReviewee={false} />
      ))}      
      </>
      } 

    </>
  );
};

export default PeerReviewGradingPage;
