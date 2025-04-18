import { AssignmentSubmissionDto } from "@/dtos/Assignment/AssignmentSubmissionDto";
import { GetUploadURLDto } from "@/dtos/Files/GetUploadURLDto";
import { AxiosResponse } from "axios";

export interface IUploadable {
    GetUploadURL(data: GetUploadURLDto): Promise<AxiosResponse>;
}
