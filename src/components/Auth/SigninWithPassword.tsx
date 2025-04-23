"use client"
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import "@/css/login.css";
import { UserModel } from "@/models/UserModel";
import { signIn } from "next-auth/react"

export default function SigninWithPassword() {
  const router = useRouter();
  const [data, setData] = useState({
    email: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || "",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
      
    UserModel.instance.LoginWithEmailAndPassword(data.email, data.password).then(response => {      
      setLoading(false);
      router.push("/login/otp");            
    })    
    .catch(err => {
      setLoading(false);
    });        
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    
    
    setLoading(true);
    fetchData();
  };

  return (
    <>    

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

      <h1 className="text-heading-2 font-bold text-dark">Sign in to APRS</h1>
      <p className="m-3 p">Assignment Peer-Review System</p>
      <form onSubmit={handleSubmit}>
        <InputGroup
          type="email"
          label=""
          className="mt-10 [&_input]:py-[15px] bg-white"
          placeholder="Enter your email"
          name="email"
          handleChange={handleChange}
          value={data.email}
          
        />

        <InputGroup
          type="password"
          label=""
          className="mb-10 [&_input]:py-[15px] bg-white"
          placeholder="Enter your password"
          name="password"
          handleChange={handleChange}
          value={data.password}
          
        />

        
        <div className="mb-4.5">
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
          >
            Sign In
            {loading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
            )}
          </button>
        </div>

        <div className="mb-4.5">
          
          <button
            type="button"
            onClick={(e)=>{
              e.preventDefault();
              signIn('google', { redirectTo: "http://localhost:3000/login/otp" })
            }}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white p-4 font-medium text-white transition hover:bg-opacity-90 shadow-sm"
          >
            <img
              className="w-5 h-5 mr-2"
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
            />
            <span className="text-gray-700 font-medium">Sign in with Google</span>
          </button>
        </div>
            
      </form>
      {/* <SignIn/> */}
    </section>
    </>
  );
}
