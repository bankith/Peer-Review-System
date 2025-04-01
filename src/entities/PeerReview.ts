import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, Column } from 'typeorm';
import { Assignment } from './Assignment';

@Entity()
export class PeerReview extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Assignment, assignment => assignment.id)
    assignment: Assignment;

    @Column()
    reviewDetails: string;
}
