import { AssignmentSubmissionDto } from "@/dtos/Assignment/AssignmentSubmissionDto";
import { AxiosResponse } from "axios";

export interface IStudentAssignment {
    GetAssignment(assignmentId: Number): Promise<AxiosResponse>;
    SubmitAssignment(assignmentSubmissionDto: AssignmentSubmissionDto): Promise<AxiosResponse>;
}
