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

    @ManyToOne(() => PeerReview, peerReview => peerReview.peerReviewSubmissions)
    peerReview: Promise<PeerReview>;

    @ManyToOne(() => User, user => user.reviewerPeerReviewSubmissions, {createForeignKeyConstraints: false})
    reviewer: Promise<User>;

    @ManyToOne(() => User, user => user.revieweePeerReviewSubmissions, {createForeignKeyConstraints: false})
    reviewee: Promise<User>;

    @ManyToOne(() => StudentGroup, d => d.reviewerPeerReviewSubmissions, {createForeignKeyConstraints: false})
    reviewerGroup: Promise<StudentGroup>;

    @ManyToOne(() => StudentGroup, d => d.revieweePeerReviewSubmissions, {createForeignKeyConstraints: false})
    revieweeGroup: Promise<StudentGroup>;

    @OneToMany(() => PeerReviewComment, comment => comment.peerReviewSubmission, {createForeignKeyConstraints: false})
    comments: Promise<PeerReviewComment[]>;

    @Column()
    reviewScore: number;

    @Column()
    isSubmit: boolean;

    @Column('datetime')
    submittedAt: Date;

    @Column()
    submittedBy: number;

    


    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
}
