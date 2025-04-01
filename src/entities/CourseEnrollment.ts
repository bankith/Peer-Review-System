import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { Course } from './Course';
import { User } from './User';

@Entity()
export class CourseEnrollment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id)
    student: User;

    @ManyToOne(() => Course, course => course.id)
    course: Course;
}
