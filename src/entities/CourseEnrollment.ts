import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Course } from './Course';

@Entity()
export class CourseEnrollment {
    @PrimaryGeneratedColumn()
    enrollmentId: number;

    @Column()
    courseId: number;

    @ManyToOne(() => Course, course => course.courseEnrollments, {createForeignKeyConstraints: false})
    course: Promise<Course>;

    @Column()
    studentId: number;

    @ManyToOne(() => User, user => user.courseEnrollments, {createForeignKeyConstraints: false})
    student: Promise<User>;

    @CreateDateColumn()
    enrolledAt: Date;

    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
}
