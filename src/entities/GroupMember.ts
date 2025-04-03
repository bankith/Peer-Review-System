import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { StudentGroup } from './StudentGroup';

@Entity()
export class GroupMember {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StudentGroup, group => group.groupMembers)
    group: Promise<StudentGroup>;

    @ManyToOne(() => User, user => user.id)
    user: Promise<User>;

    @CreateDateColumn()
    joinedAt: Date;

    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ nullable: true })
    updatedBy: number;
}
