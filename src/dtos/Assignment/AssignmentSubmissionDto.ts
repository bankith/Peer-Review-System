import { IsNotEmpty } from "class-validator";


export class AssignmentSubmissionDto {
    
    @IsNotEmpty()
    assignmentId: number;

    @IsNotEmpty()
    answer: string;

    fileLink: string;
}
