import { IsEmail, Length } from 'class-validator';

export class OtpDto {
    @Length(4, 4)
    OTPPin: string;
}