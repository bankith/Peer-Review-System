import AWS from "aws-sdk";
import { EmailSender } from "./IEmailSender";

AWS.config.update({ 
  region: process.env.AWS_REGION2!,  
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!, 
  });
 
const ses = new AWS.SES({ apiVersion: 'latest' });

export class AWSEmailSender implements EmailSender {
    async sendEmail(toUserId: number, to: string, title: string, message: string): Promise<void> {      
      await this.sendSESEmail(
        to,
        'SystemPeerReview <no-reply-SystemPeerReview@bankstanakan.com>',
         title,
         message
      );    
    }

    private async sendSESEmail(to: string, from: string, subject: string, message: string) {
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
}