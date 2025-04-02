import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';


export enum InstructorProfileTitleEnum {
    Dr = 1,
    Professor  = 2,
    Assistant = 3,
    Other = 4,
}

@Entity()
export class InstructorProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, d=>d.instructorProfile)
    @JoinColumn()
    user: Promise<User>;

    @Column({ length: 100 })
    department: string;

    @Column({ length: 100 })
    faculty: string;

    @Column({ type: "enum", enum: InstructorProfileTitleEnum }) // Assuming these are the titles
    title: InstructorProfileTitleEnum;

    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
}
