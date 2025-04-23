import { AppDataSource, initializeDataSource } from '@/data-source';
import { EmailSender } from './IEmailSender';
import { Otp } from '@/entities/Otp';

export class ProxyOTPEmailSender implements EmailSender {
    private realSender: EmailSender;    
  
    constructor(realSender: EmailSender) {
      this.realSender = realSender;      
    }
  
    async sendEmail(toUserId: number, to: string, title: string, message: string): Promise<void> {
      
      const otp = await this.GetLastOTP(toUserId);
      const lastSentTime = new Date(otp.createdDate).getTime() + 7 * 60 * 60 * 1000;
      const now = Date.now();

      console.log(lastSentTime)
      console.log("Date.now():", new Date(Date.now()).toISOString());
      console.log("otp.createdDate:", new Date(otp.createdDate).toISOString());

  
      if (lastSentTime && now - lastSentTime < 3 * 60 * 1000) {
        throw new Error('message already sent. Please wait 3 minutes before requesting again.');
      }
      await this.realSender.sendEmail(toUserId, to, title, message);      
    }

    private async GetLastOTP(toUserId: number){
      await initializeDataSource();
      const otp = await AppDataSource.manager.findOne(Otp, {      
        where: { 
            userId: toUserId,          
        },
        order: {
          createdDate: 'DESC',
        },
      });    
  
      if (otp == null) {
          throw new Error("NO_OTP_FOUND");          
      }   
      return otp;
    }
  }