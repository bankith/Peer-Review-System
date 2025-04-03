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

    @ManyToOne(() => PeerReview, peerReview => peerReview.peerReviewSubmissions)
    peerReview: Promise<PeerReview>;

    @ManyToOne(() => User, user => user.reviewerPeerReviewSubmissions)
    reviewer: Promise<User>;

    @ManyToOne(() => User, user => user.revieweePeerReviewSubmissions)
    reviewee: Promise<User>;

    @ManyToOne(() => StudentGroup, d => d.reviewerPeerReviewSubmissions)
    reviewerGroup: Promise<StudentGroup>;

    @ManyToOne(() => StudentGroup, d => d.revieweePeerReviewSubmissions)
    revieweeGroup: Promise<StudentGroup>;

    @OneToMany(() => PeerReviewComment, comment => comment.peerReviewSubmission)
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
