import { IsNotEmpty, IsOptional } from "class-validator";

export class AssignmentConfigDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  submitAccountId: string;

  @IsOptional()
  assignmentId?: string;

  @IsNotEmpty()
  assignmentName: string;

  @IsNotEmpty()
  courseId: string;

  @IsOptional()
  submitDate?: string;

  @IsOptional()
  createAssignment?: boolean;

  @IsNotEmpty()
  dueDate: string;

  constructor(data: any) {
    this.id = data.id.toString();
    this.name =
      data.__assignment__.assignmentType === 1
        ? data.__studentGroup__.name
        : data.__user__.name;
    this.submitAccountId =
      data.__assignment__.assignmentType === 1
        ? data.__studentGroup__.id.toString()
        : data.__user__.id.toString();
    this.assignmentId = data.assignmentId?.toString() || "";
    this.assignmentName = data.__assignment__.title;
    this.courseId = data.courseId?.toString() || "";
    this.submitDate = data.submittedAt || undefined;
    this.dueDate = data.__assignment__.dueDate || "";
    this.createAssignment = data.createAssignment || false;
  }
}