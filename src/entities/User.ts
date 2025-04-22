import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToMany, JoinTable, type Relation } from 'typeorm';
import { InstructorProfile } from './InstructorProfile';
import { StudentProfile } from './StudentProfile';
import { AssignmentSubmission } from './AssignmentSubmission';
import { PeerReviewSubmission } from './PeerReviewSubmission';
import { CourseEnrollment } from './CourseEnrollment';
import { CourseInstructor } from './CourseInstructor';
import { Otp } from './Otp';
import { GroupMember } from './GroupMember';

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

    @OneToOne(() => StudentProfile, (d)=>d.user, {eager: true, createForeignKeyConstraints: false})   
    studentProfile: Relation<StudentProfile>;

    @OneToOne(() => InstructorProfile, (d)=>d.user, {eager: true, createForeignKeyConstraints: false})
    instructorProfile: Relation<InstructorProfile>;

    @OneToMany(() => CourseEnrollment, (c) => c.course, {eager: true,})
    courseEnrollments: Relation<CourseEnrollment[]>;

    @OneToMany(() => CourseInstructor, (c) => c.instructor, {eager: true,})
    courseInstructors: Relation<CourseInstructor[]>;

    @OneToMany(() => AssignmentSubmission, d => d.user, {eager: true,})
    assignments: Relation<AssignmentSubmission[]>;

    @OneToMany(() => PeerReviewSubmission, peerReviewSubmission => peerReviewSubmission.reviewer)
    reviewerPeerReviewSubmissions: PeerReviewSubmission[];

    @OneToMany(() => PeerReviewSubmission, peerReviewSubmission => peerReviewSubmission.reviewee)
    revieweePeerReviewSubmissions: PeerReviewSubmission[];

    @OneToMany(() => GroupMember, d => d.user, {eager: true,})
    groupMembers: Promise<GroupMember[]>;

    @OneToMany(() => Otp, otp => otp.user)
    otps: Promise<Otp[]>;

    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
}

