import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn, OneToOne, type Relation } from 'typeorm';
import { PeerReview } from './PeerReview';
import { User } from './User';
import { StudentGroup } from './StudentGroup';
import { PeerReviewGrading } from './PeerReviewGrading';
import { PeerReviewComment } from './PeerReviewComment';

@Entity()
export class PeerReviewSubmission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    peerReviewId: number;

    @ManyToOne(() => PeerReview, peerReview => peerReview.peerReviewSubmissions, {createForeignKeyConstraints: false})
    peerReview: Promise<PeerReview>;

    @ManyToOne(() => User, user => user.reviewerPeerReviewSubmissions, {createForeignKeyConstraints: false})
    reviewer: Promise<User>;

    @ManyToOne(() => User, user => user.revieweePeerReviewSubmissions, {createForeignKeyConstraints: false})
    reviewee: Promise<User>;

    @ManyToOne(() => StudentGroup, d => d.reviewerPeerReviewSubmissions, {createForeignKeyConstraints: false})
    reviewerGroup: Promise<StudentGroup>;

    @ManyToOne(() => StudentGroup, d => d.revieweePeerReviewSubmissions, {createForeignKeyConstraints: false})
    revieweeGroup: Promise<StudentGroup>;

    @OneToMany(() => PeerReviewComment, comment => comment.peerReviewSubmission, {eager: true, createForeignKeyConstraints: false})
    comments: Promise<PeerReviewComment[]>;

    @Column()
    reviewScore: number;

    @Column()
    reviewerId: number;

    @Column()
    revieweeId: number;

    @Column()
    reviewerGroupId: number;

    @Column()
    revieweeGroupId: number;

    @Column({
        type: "tinyint",
        width: 1,
        comment: "tinyint(1), 0 = false, 1 = true"
    })
    isSubmit: boolean;

    @Column('datetime')
    submittedAt: Date;

    @Column()
    submittedBy: number;

    @OneToOne(() => PeerReviewGrading, d => d.peerReviewSubmission, {eager: true, createForeignKeyConstraints: false})    
    grade: PeerReviewGrading;
    
    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
}
