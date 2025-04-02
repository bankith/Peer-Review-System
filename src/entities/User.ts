import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToMany, JoinTable, type Relation } from 'typeorm';
import { InstructorProfile } from './InstructorProfile';
import { StudentProfile } from './StudentProfile';
import { Assignment } from './Assignment';
import { AssignmentSubmission } from './AssignmentSubmission';
import { PeerReview } from './PeerReview';
import { PeerReviewSubmission } from './PeerReviewSubmission';
import { PeerReviewComment } from './PeerReviewComment';
import { AssignmentGrading } from './AssignmentGrading';
import { PeerReviewGrading } from './PeerReviewGrading';
import { Course } from './Course';
import { CourseEnrollment } from './CourseEnrollment';
import { CourseInstructor } from './CourseInstructor';
import { GroupMember } from './GroupMember';
import { StudentGroup } from './StudentGroup';

export enum UserRoleEnum {
    student = 1,
    instructor  = 2,
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ type: "enum", enum: UserRoleEnum })
    role: UserRoleEnum;

    @OneToOne(() => StudentProfile, (d)=>d.user, {eager: true,})    
    studentProfile: Relation<StudentProfile>;

    @OneToOne(() => InstructorProfile, (d)=>d.user, {eager: true,})
    instructorProfile: Relation<InstructorProfile>;

    @OneToMany(() => CourseEnrollment, (c) => c.course, {eager: true,})
    courseEnrollments: Relation<CourseEnrollment[]>;

    @OneToMany(() => CourseInstructor, (c) => c.instructor, {eager: true,})
    courseInstructors: Relation<CourseInstructor[]>;

    // @OneToMany(() => StudentGroup, (c) => c.groupMembers, {cascade: true, eager: true})    
    // groupMembers: Relation<GroupMember[]>;

    @OneToMany(() => AssignmentSubmission, d => d.user, {eager: true,})
    assignments: Relation<AssignmentSubmission[]>;

    // @OneToMany(() => AssignmentSubmission, assignmentSubmission => assignmentSubmission.user)
    // assignmentSubmissions: AssignmentSubmission[];

    // @OneToMany(() => PeerReview, peerReview => peerReview.reviewer)
    // peerReviews: PeerReview[];

    @OneToMany(() => PeerReviewSubmission, peerReviewSubmission => peerReviewSubmission.reviewer)
    reviewerPeerReviewSubmissions: PeerReviewSubmission[];

    @OneToMany(() => PeerReviewSubmission, peerReviewSubmission => peerReviewSubmission.reviewee)
    revieweePeerReviewSubmissions: PeerReviewSubmission[];

    // @OneToMany(() => PeerReviewComment, peerReviewComment => peerReviewComment.user)
    // peerReviewComments: PeerReviewComment[];

    // @OneToMany(() => AssignmentGrading, assignmentGrading => assignmentGrading.gradedBy)
    // assignmentGradings: AssignmentGrading[];

    // @OneToMany(() => PeerReviewGrading, peerReviewGrading => peerReviewGrading.gradedBy)
    // peerReviewGradings: PeerReviewGrading[];

    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
}

