import { Notification, NotificationTypeEnum } from '@/entities/Notification';

export class NotificationBuilder {
    private readonly notification: Notification;

    private constructor() {
        this.notification = new Notification();
        this.notification.isRead = false;
        this.notification.createdDate = new Date();
    }

    static fromSystem(): NotificationBuilder {
        const builder = new NotificationBuilder();
        builder.notification.senderId = 0;
        builder.notification.senderPicture = '/images/logo/logo.png';
        builder.notification.createdBy = 0;
        return builder;
    }

    static fromUser(senderId: number, senderPicture: string): NotificationBuilder {
        const builder = new NotificationBuilder();
        builder.notification.senderId = senderId;
        builder.notification.senderPicture = senderPicture;
        return builder;
    }

    withNotificationType(type: NotificationTypeEnum): this {
        this.notification.notificationType = type;
        return this;
    }

    forUserId(userId: number): this {
        this.notification.userId = userId;
        return this;
    }

    withMessage(message: string): this {
        this.notification.message = message;
        return this;
    }

    forAssignment(assignmentId: number): this {
        this.notification.assignmentId = assignmentId;
        return this;
    }

    forAssignmentSubmission(assignmentSubmissionId: number): this {
        this.notification.assignmentSubmissionId = assignmentSubmissionId;
        return this;
    }

    forPeerReviewSubmission(peerReviewSubmissionId: number): this {
        this.notification.peerReviewSubmissionId = peerReviewSubmissionId;
        return this;
    }

    withCreatedBy(userId: number): this {
        this.notification.createdBy = userId;
        return this;
    }

    markAsRead(): this {
        this.notification.isRead = true;
        return this;
    }

    build(): Notification {
        return this.notification;
    }
}
