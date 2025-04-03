import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { AssignmentSubmission } from './AssignmentSubmission';
import { User } from './User';

@Entity()
export class AssignmentGrading {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => AssignmentSubmission, d=>d.grade)
    @JoinColumn()
    submission: Promise<AssignmentSubmission>;

    @Column()
    score: number;

    @Column()
    gradedBy: number;

    @Column('datetime')
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
