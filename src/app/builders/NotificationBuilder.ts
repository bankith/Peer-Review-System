import { Notification, NotificationTypeEnum } from '@/entities/Notification';
import { Resend } from 'resend';
import { NotiTemplate } from '@/components/Mail/noti-template';
import AWS from 'aws-sdk';
import { ProxyOTPEmailSender } from '@/proxy/ProxyOTPEmailSender';
import { AWSEmailSender } from '@/proxy/AWSEmailSender';

 AWS.config.update({ 
 region: process.env.AWS_REGION2!,  
 accessKeyId: process.env.AWS_ACCESS_KEY_ID!, 
 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!, 
 });

 const ses = new AWS.SES({ apiVersion: 'latest' });

export class NotificationBuilder {
    private readonly notification: Notification;
    private email: string;
    private isProxyEmail: boolean;


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

    withSendEmail(email: string): this {
        this.email = email;
        return this;
    }

    withProxyOTPEmail(userId: number): this {
        this.isProxyEmail = true;
        this.notification.userId = userId;
        return this;
    }

    async build(): Promise<Notification> {
        if(this.email){
            if(this.isProxyEmail){
                let proxyEmailSender = new ProxyOTPEmailSender(new AWSEmailSender());
                proxyEmailSender.sendEmail(this.notification.userId, this.email, 'SystemPeerReview Notification', this.notification.message)
            }else{
                await sendEmail(
                    this.email,
                    'SystemPeerReview <no-reply-SystemPeerReview@bankstanakan.com>',
                    'SystemPeerReview Notification',
                     this.notification.message
                  );   
            }

                     
        }        
        return this.notification;
    }
}

export async function sendEmail(to: string, from: string, subject: string, message: string) {
    const params = {
      Source: from,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: message } },
      },
    };
  
    try {
      const result = await ses.sendEmail(params).promise();
      console.log('Email sent:', result.MessageId);
      return result.MessageId;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }