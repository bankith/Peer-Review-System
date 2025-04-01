import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, Column } from 'typeorm';
import { PeerReview } from './PeerReview';
import { User } from './User';

@Entity()
export class PeerReviewSubmission extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PeerReview, peerReview => peerReview.id)
    peerReview: PeerReview;

    @ManyToOne(() => User, user => user.id)
    reviewer: User;

    @Column()
    submissionText: string;
}
