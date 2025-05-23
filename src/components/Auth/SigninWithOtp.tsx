"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import "@/css/login.css";
import { User, UserRoleEnum } from "@/entities/User";
import OtpInput from "@/app/main/login/otp/_components/otp-input";
import { useSession } from "next-auth/react"
import { UserModel } from "@/models/UserModel";

export default function SigninWithOtp() {
  const router = useRouter();
  const data = useSession();  
  const [otp, setOtp] = useState('');
  const [otpText, setOtpText] = useState('Send OTP');
  const [isOtpBtnDisabled, setIsOtpBtnDisabled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserModel>();  
  

  useEffect(() => {        
    
  }, [])

  console.log("data", data);

  const checkOTP = async (otpValue: string) => {
    UserModel.instance.CheckOTP(otpValue)    
    .then(response => {      
      setLoading(false);      
      if(UserModel.instance.role == UserRoleEnum.instructor){
        router.push("/main-teacher");
      }else if(UserModel.instance.role == UserRoleEnum.student){
        router.push("/main-student");            
      }
    })
    .catch(err => {
      setLoading(false);      
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
  };

  const handleSendOTPSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    
    setLoading(true);
    UserModel.instance.RequestOTP()
    .then(response => {      
      setLoading(false);  
      setOtpText("Sent");
    })
    .catch(err => {
      setLoading(false);      
    });

    
  };

  const handleOtpComplete = (otpValue: string) => {
    console.log(otpValue);
    setOtp(otpValue);    
    setLoading(true);
    checkOTP(otpValue);
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
      <form onSubmit={handleSendOTPSubmit}>        
        <OtpInput length={4} onComplete={handleOtpComplete} />
        <div className="mb-4.5 mt-4.5">
          <button
            disabled={isOtpBtnDisabled}
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
          >
            {otpText}
            {loading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
            )}
          </button>

          <button            
            onClick={(e)=>{
              e.preventDefault();

              setLoading(true);      
              UserModel.instance.ByPassOTP().then(response => {
                setLoading(false);      
                if(UserModel.instance.role == UserRoleEnum.instructor){
                  router.push("/main-teacher");
                }else if(UserModel.instance.role == UserRoleEnum.student){
                  router.push("/main-student");            
                }
              })
              .catch(err => {
                setLoading(false);      
              });
              
            }}
            className="flex w-full mt-5 cursor-pointer items-center justify-center gap-2 rounded-lg bg-pink p-4 font-medium text-white transition hover:bg-opacity-90"
          >
            ByPass            
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
