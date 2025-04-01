import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { GroupMember } from './GroupMember';

@Entity()
export class StudentGroup extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => GroupMember, groupMember => groupMember.group)
    members: GroupMember[];
}
