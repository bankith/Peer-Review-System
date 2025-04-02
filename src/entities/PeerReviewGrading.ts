import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { PeerReviewSubmission } from './PeerReviewSubmission';
import { User } from './User';
import { PeerReview } from './PeerReview';

@Entity()
export class PeerReviewGrading {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => PeerReview, d=>d.grade)    
    @JoinColumn()
    PeerReview: Promise<PeerReview>;

    @Column()
    score: number;

    @ManyToOne(() => User, user => user.id)
    gradedBy: Promise<User>;

    @CreateDateColumn()
    gradedAt: Date;

    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
}
