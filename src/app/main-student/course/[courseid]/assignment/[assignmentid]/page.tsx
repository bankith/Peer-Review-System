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


const ViewAssignmentPage = () => {
  const params = useParams<{ courseid: string; assignmentid: string }>();
  const router = useRouter();
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const { courseid, assignmentid } = params;

  const [initLoading, setInitLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [uploadLoading, setUploadLoading] = useState(false);
  
  
  const [assignmentName, setAssignmentName] = useState<string>("");
  const [assignmentType, setAssignmentType] = useState<AssignmentTypeEnum>();
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date>();
  const [question, setQuestion] = useState<string>();
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [fileUploadedURL, setFileUploadedURL] = useState("");


  const getAssignmentData = async (assignmentid: number) => {
    setInitLoading(true);
    StudentModel.instance.GetAssignment(assignmentid).then(response => {      
      setInitLoading(false);
      const assignmentDto = response.data.data as AssignmentDto;
      if (assignmentDto) {
        setAssignmentName(assignmentDto.title);
        setAssignmentType(assignmentDto.assignmentType);        
        setDescription(assignmentDto.description);
        setDueDate(assignmentDto.dueDate);
        if(assignmentDto.question){ setQuestion(assignmentDto.question.q1);}
      }
    })    
    .catch(err => {
      setInitLoading(false);
    }); 
  };

  const getSubmissionData = async (assignmentid: number) => {    
    StudentModel.instance.GetAssignmentSubmission(assignmentid).then(response => {      
      
      const assignmentSubmissionAnswerDto = response.data.data as AssignmentSubmissionAnswerDto;
      if (assignmentSubmissionAnswerDto) {
        setAnswer(assignmentSubmissionAnswerDto.answer)
        setFileUploadedURL(assignmentSubmissionAnswerDto.fileUrl)
      }
    })    
  };

  useEffect(() => {
    if (assignmentid) {
      setInitLoading(true);
      getAssignmentData(parseInt(assignmentid));      
      getSubmissionData(parseInt(assignmentid));
    }
  }, []);

  return (
    <>
      <BreadcrumbTeacher
        pageMain="Subject"
        pageMainLink="/main-student/course"
        subMainPage="Assignment Summary"
        subMainPageLink={`/main-student/course/${courseid}/assignment-summary`}
        pageName="Submit"
      />

      {initLoading ? <CardSkeleton />: 
      
      <>
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 rounded-lg">
        <h3 className="text-lg text-dark">
          Your Assignment
        </h3>
        <p className="text-gray-500 text-sm"> View assignment Page</p>
      </div>
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 rounded-lg">
        <div>
          <p className="text-lg font-bold">{assignmentName}</p>
          <p className="text-primary">
            Due: {dueDate ? new Date(dueDate).toLocaleDateString() : "Not set"}
          </p>
          <p className="text-primary mb-4">{assignmentType == AssignmentTypeEnum.group ? "Group" : "Individual"}</p>
          <p className="text-gray-500 mb-4">{description}</p>
          <div className="mb-4">
            <label className="text-body-sm font-medium text-dark dark:text-white">
              Questions 
            </label>            
            <h5>{question}</h5>
          </div>

          <div className="relative mt-3 [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:left-5.5 [&_svg]:top-5.5">
            <textarea              
              rows={6}
              placeholder="Type your message"      
              disabled={true}
              value={answer}   
              ref={answerRef}     
              className={cn(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary",
                 "py-5 pl-13 pr-5"
              )}
              required={true}              
            />
          </div>        

          <label className="text-body-sm font-medium text-dark dark:text-white">
            Your file
          </label>
          <br/>
          {fileUploadedURL ? (
            <a
              href={fileUploadedURL}
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
      </>
      } 

    </>
  );
};

export default ViewAssignmentPage;
