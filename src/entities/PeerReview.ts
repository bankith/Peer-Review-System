import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Assignment } from './Assignment';
import { User } from './User';
import { StudentGroup } from './StudentGroup';
import { PeerReviewSubmission } from './PeerReviewSubmission';
import { PeerReviewComment } from './PeerReviewComment';
import { PeerReviewGrading } from './PeerReviewGrading';

export enum PeerReviewTypeEnum {
    Text = 1,
    Score  = 2,
    All = 3,
}

export enum ReviewerTypeEnum {
    Group = 1,
    Individual  = 2,    
}

export enum ReviewMethodEnum {
    Random = 1,
    Manual  = 2,    
    Rotation  = 3,
}
@Entity()
export class PeerReview {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Assignment, assignment => assignment.peerReview, {eager: true})
    @JoinColumn()
    assignment: Promise<Assignment>;

    @Column({ length: 100 })
    name: string;

    @Column('datetime')
    outDate: Date;

    @Column('datetime')
    dueDate: Date;

    @Column({ type: "enum", enum: PeerReviewTypeEnum })
    peerReviewType: PeerReviewTypeEnum;

    @Column({ type: "enum", enum: ReviewerTypeEnum })
    reviewerType: ReviewerTypeEnum;

    @Column({ type: "enum", enum: ReviewMethodEnum })
    reviewMethod: ReviewMethodEnum;

    @Column()
    maxReviewer: number = 5;

    @Column({ type: "boolean" })
    isReviewerAnonymous: boolean;

    @Column({ type: "boolean" })
    isRevieweeAnonymous: boolean;

    @OneToMany(() => PeerReviewSubmission, d => d.peerReview, {eager: true})
    peerReviewSubmissions: Promise<PeerReviewSubmission[]>;

    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
}
