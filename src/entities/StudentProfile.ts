import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

export enum StudentProfileLevelEnum {
    Undergrad = 1,
    Graduate  = 2,
    Phd = 3,
    Other = 4,
}

@Entity()
export class StudentProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user)=>user.studentProfile)
    @JoinColumn()
    user: Promise<User>;

    @Column({ length: 100 })
    studentId: string;

    @Column({ length: 100 })
    department: string;

    @Column({ length: 100 })
    faculty: string;

    @Column({ type: "enum", enum: StudentProfileLevelEnum})
    level: StudentProfileLevelEnum;

    @Column({ nullable: true })
    picture: string;

    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
}
