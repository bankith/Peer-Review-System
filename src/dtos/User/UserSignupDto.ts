import { IsEmail, Length } from 'class-validator';

export class UserSignupDto {
    @IsEmail()
    email: string;

    @Length(8, 128)    
    password: string;
}