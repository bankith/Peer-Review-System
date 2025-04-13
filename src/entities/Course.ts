import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { StudentGroup } from './StudentGroup';
import { Assignment } from './Assignment';
import { InstructorProfile } from './InstructorProfile';
import { User } from './User';
import { CourseEnrollment } from './CourseEnrollment';
import { CourseInstructor } from './CourseInstructor';

export enum CourseLevelEnum {
    Undergrad = 1,
    Graduate  = 2,
    Phd = 3,
    Other = 4,
}

export enum CourseTermEnum {
    First = 1,
    Second  = 2,
    Summer = 3,
}

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    courseName: string;

    @Column({ type: "enum", enum: CourseLevelEnum })
    level: CourseLevelEnum;

    @Column('year')
    academicYear: string;

    @Column({ type: "enum", enum: CourseTermEnum }) // Assuming these are the terms
    term: CourseTermEnum;    

    @OneToMany(() => CourseEnrollment, (d) => d.course, {cascade: true, eager: true})    
    courseEnrollments: CourseEnrollment[];

    @OneToMany(() => CourseInstructor, (d) => d.course, {cascade: true, eager: true})    
    courseInstructors: CourseInstructor[];

    @OneToMany(() => StudentGroup, d => d.course, {cascade: true, eager: true})
    groups: StudentGroup[];

    @OneToMany(() => Assignment, assignment => assignment.course, {cascade: true, eager: true})
    assignments: Assignment[];

    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
}
