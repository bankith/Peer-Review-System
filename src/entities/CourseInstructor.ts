import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, BaseEntity, UpdateDateColumn, CreateDateColumn, ManyToMany } from 'typeorm';
import { User } from './User';
import { Course } from './Course';
import { InstructorProfile } from './InstructorProfile';

@Entity()
export class CourseInstructor {
    @PrimaryGeneratedColumn()
    courseInstructorId: number;

    @Column()
    courseId: number;

    @ManyToOne(() => Course, d => d.courseInstructors)
    course: Promise<Course>;

    @Column()
    instructorId: number;

    @ManyToOne(() => User, d => d.courseInstructors)
    instructor: Promise<User>;

    @CreateDateColumn()
    addedAt: Date;

    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
}
