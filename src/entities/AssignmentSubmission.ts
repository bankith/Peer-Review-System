import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, Column } from 'typeorm';
import { Assignment } from './Assignment';
import { User } from './User';

@Entity()
export class AssignmentSubmission extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Assignment, assignment => assignment.id)
    assignment: Assignment;

    @ManyToOne(() => User, user => user.id)
    student: User;

    @Column()
    submissionData: string;
}
