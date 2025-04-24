import { AxiosResponse } from "axios";

export interface IAuthenticatable {
    LoginWithEmailAndPassword(email: string, password: string): Promise<AxiosResponse>;
    LoginWithGoogle(): Promise<AxiosResponse>;
    RequestOTP(): Promise<AxiosResponse>;
    CheckOTP(otpPin: string): Promise<AxiosResponse>;
    ByPassOTP(): Promise<AxiosResponse>;
    Logout(): void;
}
