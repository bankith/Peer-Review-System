"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import "@/css/login.css";
import ApiService from '@/services/apiService';

export default function SigninWithPassword() {
  const router = useRouter();
  const [data, setData] = useState({
    email: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || "",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    ApiService.client.post('/login', { email: data.email, password: data.password })
    .then(response => {
      const { token, user } = response.data.data;
      ApiService.saveToken(token);
      ApiService.saveUser(user);

      setLoading(false);
      console.log('Logged in successfully');
      router.push("/main-teacher");
      
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
    // You can remove this code block
    setLoading(true);
    fetchData();
    // setTimeout(() => {
    //   setLoading(false);
    //   redirect("/main");
    // }, 1000);
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
      </form>
    </section>
    </>
  );
}
