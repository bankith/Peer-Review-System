import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class InstructorProfile extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    department: string;

    @Column()
    faculty: string;

    @Column()
    title: string;

    @Column({ type: 'timestamp' })
    createdAt: Date;

    @Column()
    createdBy: number;

    @Column({ type: 'timestamp' })
    updatedAt: Date;

    @Column()
    updatedBy: number;
}
