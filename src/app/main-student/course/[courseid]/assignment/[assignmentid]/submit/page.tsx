"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import BreadcrumbTeacher from "@/components/Breadcrumbs/BreadcrumbTeacher";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";
import { StudentModel } from "@/models/StudentModel";
import { AssignmentDto } from "@/dtos/Assignment/AssignmentDto";
import { AssignmentTypeEnum } from "@/entities/Assignment";
import { GetUploadURLDto } from "@/dtos/Files/GetUploadURLDto";
import { UploadURLDto } from "@/dtos/Files/UploadURLDto";
import { AssignmentSubmissionDto } from "@/dtos/Assignment/AssignmentSubmissionDto";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { PencilSquareIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";


const SubmittingAssignmentPage = () => {
  const params = useParams<{ courseid: string; assignmentid: string }>();
  const router = useRouter();
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const { courseid, assignmentid } = params;
  const [loading, setLoading] = useState(false);
  
  
  const [assignmentName, setAssignmentName] = useState<string>("");
  const [assignmentType, setAssignmentType] = useState<AssignmentTypeEnum>();
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date>();
  const [question, setQuestion] = useState<string>();
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [fileUploadedURL, setFileUploadedURL] = useState("");

  const submitAssignment = async () => {
    
      var submitAssignment = new AssignmentSubmissionDto();
      submitAssignment.assignmentId = parseInt(assignmentid);
      submitAssignment.answer = answerRef.current?.value || "";
      submitAssignment.fileLink = fileUploadedURL;
      
      StudentModel.instance.SubmitAssignment(submitAssignment).then(response => {      
        setLoading(false);
        toast.success("Success!", {
          position: "top-center",
        });
      })    
      .catch(err => {
        setLoading(false);
      }); 

  };

  const getAssignmentData = async (assignmentid: Number) => {
    setLoading(true);
    StudentModel.instance.GetAssignment(assignmentid).then(response => {      
      setLoading(false);
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
      setLoading(false);
    }); 
  };

  // const getSubmissionData = async () => {
  //   const userId = "12"; // แทนด้วย userId จริงจากระบบ Authentication
  //   try {
  //     const response = await fetch(
  //       `/api/student/assignment/submission/detail?userId=${userId}&assignmentId=${assignmentId}`
  //     );
  //     const data = await response.json();
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch assignment data: ${response.status}`);
  //     }
  //     const submission = data.data;
  //     // console.log("submission", submission);
  //     if (submission.answer) {
  //       setAnswer(Object.values(submission.answer));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching submission data:", error);
  //   }
  // };

  useEffect(() => {
    if (assignmentid) {
      getAssignmentData(parseInt(assignmentid));      
      // getSubmissionData();
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
      <div className="bg-white px-6 py-5 mt-6 shadow dark:bg-dark-1 rounded-lg">
        <h3 className="text-lg text-dark">
          To Submit Assignment fill in detail below
        </h3>
        <p className="text-gray-500 text-sm">Submit assignment Page</p>
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
              ref={answerRef}     
              className={cn(
                "w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary",
                 "py-5 pl-13 pr-5"
              )}
              required={true}              
            />
          </div>          
          
          <InputGroup
              type="file"
              fileStyleVariant="style1"
              label="Attach file"
              placeholder="Attach file"
              handleChange={async (e) =>  {
                if(e.target.files == null) return;

                const file : File = e.target.files[0];
                if (file) {
                  console.log("Selected file:", file);                  
                  var data = new GetUploadURLDto();                  
                  data.fileName = file.name;
                  data.fileType = file.type;
                  setLoading(true);
                  StudentModel.instance.GetUploadURL(data)
                        .then(async response => {      
                          setLoading(false);
                          const uploadURLDto = response.data.data as UploadURLDto;
                          if (uploadURLDto) {
                            const uploadRes = await fetch(uploadURLDto.uploadUrl, {
                              method: "PUT",
                              headers: {
                                "Content-Type": file.type,
                              },
                              body: file,
                            });
                        
                            if (uploadRes.ok) {
                              setFileUploadedURL(uploadURLDto.finalFileUrl);
                              console.log("✅ File uploaded successfully!");
                            } else {
                              console.error("❌ Upload failed");
                            }
                          }
                        })    
                        .catch(err => {
                          setLoading(false);
                        }); 
                }
              }}
            />
          

          <p className="text-red">{errorMessage}</p>
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white mt-4"
            onClick={submitAssignment}
          >
            Submit Assignment
          </button>
        </div>
      </div>
    </>
  );
};

export default SubmittingAssignmentPage;
