import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { Course } from './Course';
import { InstructorProfile } from './InstructorProfile';

@Entity()
export class CourseInstructor extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => InstructorProfile, instructor => instructor.id)
    instructor: InstructorProfile;

    @ManyToOne(() => Course, course => course.id)
    course: Course;
}
