"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import ApiService from '@/services/apiService';
import { useRouter } from "next/navigation";
import { UserDto } from "@/dtos/User/UserDto";
import { UserRoleEnum } from "@/entities/User";
import { StudentProfileDto } from "@/dtos/StudentProfile/StudentProfileDto";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const USER = {
    name: "Somchai BornToDev",
    number: "6770243210",
    email: "6770243210@student.chula.ac.th",
    img: "/images/user/user-00.png",
  };

  const [user, setUser] = useState<UserDto>();  
  const [studentProfileDto, setStudentProfileDto] = useState<StudentProfileDto>();  

  useEffect(() => {
    var user = ApiService.getUser();
    const userDto = user as UserDto;
    if(user){
      setUser(userDto);
    } 

    ApiService.client.get('/auth/profile')
    .then(response => {
      if(userDto.role == UserRoleEnum.student){
        var st = response.data.data as StudentProfileDto;
        if(st != null){
          setStudentProfileDto(st);
        }
      }
      
    })
    .catch(err => {
      
    });
  }, [])

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          {studentProfileDto ? 
          <Image
            src={studentProfileDto.picture}
            className="size-12 rounded-full"
            alt={`Avatar of ${studentProfileDto.name}`}
            role="presentation"
            width={200}
            height={200}
          />
          : null}
          <figcaption className="flex items-center gap-1 font-medium text-primary dark:text-dark-6 max-[1024px]:sr-only">
            
            <div className="flex-col block text-left">
              <p className="text-xs">{USER.number}</p>
              <span>{USER.name}</span>
            </div>
            
            

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={USER.img}
            className="size-12"
            alt={`Avatar for ${USER.name}`}
            role="presentation"
            width={200}
            height={200}
          />

          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {USER.name}
            </div>

            <div className="leading-none text-gray-6 text-xs">{USER.email}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>

          <Link
            href={"/pages/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={() => {
              ApiService.logout();
              setIsOpen(false)
              router.push("/");
            }
          }          
          >
            <LogOutIcon />

            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
