import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { Course } from './Course';
import { User } from './User';
import { GroupMember } from './GroupMember';
import { Assignment } from './Assignment';
import { AssignmentSubmission } from './AssignmentSubmission';
import { PeerReviewSubmission } from './PeerReviewSubmission';

@Entity()
export class StudentGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Course, course => course.groups)
    course: Promise<Course>;

    @Column({ length: 100 })
    name: string;

    @Column('datetime')
    createdAt: Date;

    @ManyToOne(() => GroupMember, d => d.group, {cascade: true, eager: true})
    groupMembers: Promise<GroupMember[]>;

    @ManyToOne(() => AssignmentSubmission, d => d.studentGroup, {createForeignKeyConstraints: false})
    assignmentSubmissions: Promise<AssignmentSubmission[]>;

    @ManyToOne(() => PeerReviewSubmission, d => d.reviewerGroup, {createForeignKeyConstraints: false})
    reviewerPeerReviewSubmissions: Promise<PeerReviewSubmission[]>;

    @ManyToOne(() => PeerReviewSubmission, d => d.revieweeGroup, {createForeignKeyConstraints: false})
    revieweePeerReviewSubmissions: Promise<PeerReviewSubmission[]>;
    
    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
    
}
