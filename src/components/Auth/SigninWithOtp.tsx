"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import "@/css/login.css";
import ApiService from '@/services/apiService';
import { User, UserRoleEnum } from "@/entities/User";
import OtpInput from "@/app/main/login/otp/_components/otp-input";

export default function SigninWithOtp() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();  

  useEffect(() => {

    ApiService.client.get('/login/otp')
    .then(response => {      
      setLoading(false);            
    })
    .catch(err => {
      setLoading(false);      
    });


    var user = ApiService.getUser();
    if(user){
      setUser(user as User);
    }        
  }, [])

  const fetchData = async () => {
    ApiService.client.post('/login/otp', { OTPPin: otp })
    .then(response => {      
      setLoading(false);      
      if(user?.role == UserRoleEnum.instructor){
        router.push("/main-teacher");
      }else if(user?.role == UserRoleEnum.student){
        router.push("/main-student");            
      }
    })
    .catch(err => {
      setLoading(false);      
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    
    
    setLoading(true);
    fetchData();
  };

  const handleOtpComplete = (otpValue: string) => {
    setOtp(otpValue);    
    setLoading(true);
    fetchData();
    console.log('Submitted OTP:', otpValue);
  };



  return (
    <section className="max-w-xl text-center m-auto mt-30">
      
      <div className="m-auto" >
        <Image 
          src="/images/logo/logo.png"                
          className="login-logo"
          width={75}          
          height={112}
          alt="logo"
        />        
      </div>

      <h1 className="text-heading-2 font-bold text-dark">Verification Code</h1>
      <p className="m-3 p">We have sent the verification code to your email address</p>
      <form onSubmit={handleSubmit}>        
        <OtpInput length={4} onComplete={handleOtpComplete} />
        <div className="mb-4.5 mt-4.5">
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
          >
            Continue
            {loading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
            )}
          </button>
        </div>
      </form>
    </section>
    // <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
    //   <h2 className="text-2xl font-semibold mb-4">Enter OTP</h2>
    //   <OtpInput length={6} onComplete={handleComplete} />
      
    //   {submitted && <p className="mt-4 text-green-600">✅ OTP submitted: <span className="font-mono">{otp}</span></p>}
      
    //   <button
    //     onClick={resendOtp}
    //     disabled={resendCooldown > 0}
    //     className={`mt-6 px-4 py-2 rounded ${
    //       resendCooldown > 0
    //         ? 'bg-gray-300 cursor-not-allowed'
    //         : 'bg-blue-600 text-white hover:bg-blue-700'
    //     }`}
    //   >
    //     {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
    //   </button>
    // </div>
  );
}
