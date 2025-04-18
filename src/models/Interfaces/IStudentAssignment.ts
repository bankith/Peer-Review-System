import { AssignmentSubmissionDto } from "@/dtos/Assignment/AssignmentSubmissionDto";
import { AxiosResponse } from "axios";

export interface IStudentAssignment {
    GetAssignment(assignmentId: number): Promise<AxiosResponse>;
    SubmitAssignment(assignmentSubmissionDto: AssignmentSubmissionDto): Promise<AxiosResponse>;
    GetAssignmentSubmission(assignmentId: number): Promise<AxiosResponse>;
}
