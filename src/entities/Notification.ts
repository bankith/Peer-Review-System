import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToMany, JoinTable, type Relation, ManyToOne } from 'typeorm';

export enum NotificationTypeEnum {    
    AssignAssignmentSubmission  = 1,    
    SubmitAssignmentSubmission  = 2,
    AssignPeerReviewSubmission  = 3,
    SubmitPeerReviewSubmission  = 4,
    WarningDeadline = 5,
}

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    isRead: boolean;

    @Column()
    senderId: number;

    @Column()
    senderName: string;

    @Column()
    userId: number;

    @Column()
    senderPicture: string;

    @Column()
    assignmentId: number;

    @Column()
    assignmentSubmissionId: number;

    @Column()
    peerReviewSubmissionId: number;    

    @Column({ type: "enum", enum: NotificationTypeEnum })
    notificationType: NotificationTypeEnum;

    @CreateDateColumn()
    createdDate: Date;

    @Column({ nullable: true })
    createdBy: number;
}

