import { AxiosResponse } from "axios";

export interface IStudentAssignment {
    GetAssignment(assignmentId: number): Promise<AxiosResponse>;
    // SubmitAssignment(assignmentId: AssignmentDto): Promise<AxiosResponse>;
}
