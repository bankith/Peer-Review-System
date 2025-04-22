import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn, type Relation, OneToOne } from 'typeorm';
import { User } from './User';
import { Assignment } from './Assignment';
import { StudentGroup } from './StudentGroup';
import { AssignmentGrading } from './AssignmentGrading';

@Entity()
export class AssignmentSubmission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    assignmentId: number;

    @ManyToOne(() => Assignment, assignment => assignment.submissions, {createForeignKeyConstraints: false})
    assignment: Promise<Assignment>;

    @Column()
    userId: number;

    @ManyToOne(() => User, user => user.assignments, {createForeignKeyConstraints: false})
    user: Promise<User>;

    @Column()
    studentGroupId: number;

    @ManyToOne(() => StudentGroup, group => group.assignmentSubmissions, {eager: true, createForeignKeyConstraints: false})
    studentGroup: Promise<StudentGroup>;

    @Column("simple-json")
    answer: {q1: string };

    @Column({ length: 255 })
    fileLink: string;

    @Column({
        type: "tinyint",
        width: 1,
        comment: "Stores boolean as tinyint(1), 0 = false, 1 = true"
    })
    isSubmit: boolean;

    @Column('datetime')
    submittedAt: Date;

    @OneToOne(() => AssignmentGrading, d=>d.submission, {eager: true, createForeignKeyConstraints: false})
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
