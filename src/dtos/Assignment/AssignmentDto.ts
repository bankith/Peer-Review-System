import { Assignment, AssignmentTypeEnum } from '@/entities/Assignment';
import { NotificationTypeEnum, Notification } from '@/entities/Notification';
import { IsEmail, Length } from 'class-validator';

export class AssignmentDto {
    
    id: number;

    title: string;
    
    description: string;

    courseId: number;

    outDate: Date;
    
    dueDate: Date;
    
    question: {q1: string };

    assignmentType: AssignmentTypeEnum;        

    public constructor(assignment: Assignment){
        this.id = assignment.id;
        this.title = assignment.title;
        this.description = assignment.description;
        this.courseId = assignment.courseId;
        this.outDate = assignment.outDate;
        this.dueDate = assignment.dueDate;        
        this.question = assignment.question;
        this.assignmentType = assignment.assignmentType;
    }
}
