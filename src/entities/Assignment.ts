import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Course } from './Course';
import { User } from './User';
import { AssignmentSubmission } from './AssignmentSubmission';
import { PeerReview } from './PeerReview';

export enum AssignmentTypeEnum {
    group = 1,
    individual  = 2,
}


@Entity()
export class Assignment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 150 })
    title: string;

    @Column('text')
    description: string;

    @Column()
    courseId: number;
    @ManyToOne(() => Course, course => course.assignments)
    course: Promise<Course>;

    @Column('datetime')
    outDate: Date;

    @Column('datetime')
    dueDate: Date;

    @Column("simple-json")
    question: {q1: string };

    @Column({
        type: "tinyint",
        width: 1,
        comment: "Stores boolean as tinyint(1), 0 = false, 1 = true"
    })
    isCreateReview: boolean;

    @Column({ type: "enum", enum: AssignmentTypeEnum })
    assignmentType: AssignmentTypeEnum;

    @OneToMany(() => AssignmentSubmission, submission => submission.assignment, {cascade: true, eager: true})
    submissions: AssignmentSubmission[];

    @OneToOne(() => PeerReview, peerReview => peerReview.assignment)
    peerReview: PeerReview;

    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
}
