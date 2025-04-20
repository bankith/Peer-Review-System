import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { PeerReview } from './PeerReview';
import { User } from './User';
import { PeerReviewSubmission } from './PeerReviewSubmission';

@Entity()
export class PeerReviewComment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    peerReviewSubmissionId: Number;

    @ManyToOne(() => PeerReviewSubmission, d => d.comments, {createForeignKeyConstraints: false})
    peerReviewSubmission: Promise<PeerReviewSubmission>;

    @Column()
    userId: Number;

    @ManyToOne(() => User, d => d.id)
    user: Promise<User>;

    @Column('text')
    comment: string;

    @Column()
    score: number;

    @Column('datetime')
    createdAt: Date;

    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
}
