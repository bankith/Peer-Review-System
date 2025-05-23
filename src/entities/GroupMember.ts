import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { StudentGroup } from './StudentGroup';

@Entity()
export class GroupMember {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    groupId: number;

    @ManyToOne(() => StudentGroup, group => group.groupMembers, {createForeignKeyConstraints: false})
    group: Promise<StudentGroup>;

    @Column()
    userId: number;

    @ManyToOne(() => User, user => user.id, {createForeignKeyConstraints: false})
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
