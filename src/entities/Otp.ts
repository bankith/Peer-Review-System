import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToMany, JoinTable, type Relation, ManyToOne } from 'typeorm';
import { User } from './User';


@Entity()
export class Otp {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    reference: string;

    @Column({ length: 6 })
    pin: string;

    @Column()
    userId: number;
    
    @ManyToOne(() => User, user => user.courseEnrollments, {createForeignKeyConstraints: false})
    user: Promise<User>;

    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;    
}

