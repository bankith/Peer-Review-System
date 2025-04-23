export interface EmailSender {
    sendEmail(toUserId: number, to: string, title: string, message: string): Promise<void>;
  }