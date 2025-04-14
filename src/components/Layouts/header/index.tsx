"use client";

import { SearchIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";
import { Logo } from "@/components/logo";
import { useEffect, useState } from "react";
import { UserModel } from "@/models/UserModel";
import { UserRoleEnum } from "@/entities/User";
import { InstructorModel } from "@/models/InstructorModel";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const [name, setName] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isLoadedUserProfile, setIsLoadedUserProfile] = useState(false);
  useEffect(() => {
    if(UserModel.instance.role == UserRoleEnum.instructor){
      // if(InstructorModel.instance.IsAlreadyDownLoadProfile()){
      //     SetAllInstructorProfile();
      // }else{
        InstructorModel.instance.GetProfile().then(response => {
          SetAllInstructorProfile();
        })
        .catch(err => {
          
        });
      // }
    }
    else if(UserModel.instance.role == UserRoleEnum.student){
      InstructorModel.instance.GetProfile().then(response => {
        SetAllInstructorProfile();
      })
      .catch(err => {
        
      });
    }

    
  }, [])

  function SetAllInstructorProfile(){
    setName(InstructorModel.instance.name);
    setProfileImg(InstructorModel.instance.picture);
    setEmail(InstructorModel.instance.email);    
    setIsLoadedUserProfile(true);
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-3 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      <button
        onClick={toggleSidebar}
        className="rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {/* {isMobile && (
        <Link href={"/"} className="ml-2 max-[430px]:hidden min-[375px]:ml-4">
          <Image
            src={"/images/logo/logo.png"}
            width={32}
            height={32}
            alt=""
            role="presentation"
          />
        </Link>
      )} */}

       <Link
              href={"/main"}              
              className="px-0 py-2.5 min-[850px]:py-0"
            >              
         <Logo />         
      </Link>
      <h3 className="text-heading-4 font-bold text-primary ml-7 mr-35">
        ARPS
      </h3>
      
      
      <div className="max-xl:hidden">
      
        <h1 className="text-heading-6 text-primary border-2 border-solid border-color rounded-xl mr-10 p-2 pt-1 pb-1">
        My Courses
        </h1>
        {/* <p className="font-medium">Next.js Admin Dashboard Solution</p> */}
      </div>
      <div className="max-xl:hidden">
        
        <h1 className="text-heading-6 text-primary">
          Evaluation Center
        </h1>
        {/* <p className="font-medium">Next.js Admin Dashboard Solution</p> */}
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        {/* <div className="relative w-full max-w-[300px]">
          <input
            type="search"
            placeholder="Search"
            className="flex w-full items-center gap-3.5 rounded-full border bg-gray-2 py-3 pl-[53px] pr-5 outline-none transition-colors focus-visible:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-dark-4 dark:hover:bg-dark-3 dark:hover:text-dark-6 dark:focus-visible:border-primary"
          />

          <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 max-[1015px]:size-5" />
        </div> */}

        {/* <ThemeToggleSwitch /> */}

        <Notification />

        <div className="shrink-0">
          {isLoadedUserProfile ? 
          <UserInfo name={name} studentId={studentId} email={email} img={profileImg} />
          : null}
        </div>
      </div>
    </header>
  );
}
