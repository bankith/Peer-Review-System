import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn, type Relation, OneToOne } from 'typeorm';
import { User } from './User';
import { Assignment } from './Assignment';
import { StudentGroup } from './StudentGroup';
import { AssignmentGrading } from './AssignmentGrading';

@Entity()
export class AssignmentSubmission {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Assignment, assignment => assignment.submissions)
    assignment: Promise<Assignment>;

    @ManyToOne(() => User, user => user.assignments)
    user: Promise<User>;

    @ManyToOne(() => StudentGroup, group => group.assignmentSubmissions, {eager: true})
    studentGroup: Promise<StudentGroup>;

    @Column("simple-json")
    answer: {q1: string };

    @Column({ length: 255 })
    fileLink: string;

    @Column()
    isSubmit: boolean;

    @Column('datetime')
    submittedAt: Date;

    @OneToOne(() => AssignmentGrading, d=>d.submission, {eager: true})    
    grade: Relation<AssignmentGrading>;

    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
}
