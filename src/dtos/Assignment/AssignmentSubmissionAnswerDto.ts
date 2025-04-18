
import { AssignmentSubmission } from '@/entities/AssignmentSubmission';

export class AssignmentSubmissionAnswerDto {
    
    assignmentSubmissionId: number;
    fileUrl: string;
    answer: string;

    public constructor(assignment: AssignmentSubmission){
        this.assignmentSubmissionId = assignment.id;
        this.answer = assignment.answer.q1;
        this.fileUrl = assignment.fileLink;
        
    }
}
