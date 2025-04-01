import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class StudentProfile extends BaseEntity {
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
    level: number;
}
