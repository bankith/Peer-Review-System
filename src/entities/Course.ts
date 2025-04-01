import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { CourseInstructor } from './CourseInstructor';
import { CourseEnrollment } from './CourseEnrollment';

@Entity()
export class Course extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => CourseInstructor, courseInstructor => courseInstructor.course)
    instructors: CourseInstructor[];

    @OneToMany(() => CourseEnrollment, courseEnrollment => courseEnrollment.course)
    enrollments: CourseEnrollment[];
}
