import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { StudentGroup } from './StudentGroup';
import { StudentProfile } from './StudentProfile';

@Entity()
export class GroupMember extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StudentGroup, studentGroup => studentGroup.members)
    group: StudentGroup;

    @ManyToOne(() => StudentProfile, studentProfile => studentProfile.user)
    student: StudentProfile;
}
