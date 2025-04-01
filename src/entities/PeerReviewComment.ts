import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, Column } from 'typeorm';
import { PeerReviewSubmission } from './PeerReviewSubmission';

@Entity()
export class PeerReviewComment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PeerReviewSubmission, peerReviewSubmission => peerReviewSubmission.id)
    peerReviewSubmission: PeerReviewSubmission;

    @Column()
    commentText: string;
}
