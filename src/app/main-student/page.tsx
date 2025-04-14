"use client"
import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { Suspense } from "react";
import ApiService from '@/services/apiService';
import { useState, useEffect } from 'react';
import { OverviewCardsSkeleton } from "../main/(home)/_components/overview-cards/skeleton";
import { OverviewCardsGroup } from "../main/(home)/_components/overview-cards";
import { Course } from "@/entities/Course";
import Link from "next/link";
import GroupedCourse from "@/models/Response/GroupedCourseResponse";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { CourseInfoForm } from "../main/pages/settings/_components/course-info";
import { InstructorModel } from "@/models/InstructorModel";


export default function Home() {
  // const { selected_time_frame } = await searchParams;
  // const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);
  const [user, setUser] = useState("");
  const [groupedCourses, setGroupedCourses] = useState<GroupedCourse[]>([]);
  useEffect(() => {
    var user = localStorage.getItem("user");
    if(user){
      setUser(user);
    }    

    InstructorModel.instance.GetMyCourses()
    .then(response => {
      const groupedCourses = response.data.data as GroupedCourse[];                         
      setGroupedCourses(groupedCourses)
    })
    .catch(err => {
      
    });
  }, [])
  
  return (
    <>
      <div className="mx-auto w-full max-w-[1080px]">        
        <Breadcrumb pageName="My Courses" isDisplayNav={false}/>
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            {groupedCourses.map((groupedCourse) => (                              
              
              <ShowcaseSection key={`${groupedCourse.academicYear}-${groupedCourse.term}`} title={`${groupedCourse.academicYear}-${groupedCourse.term}`} className="!p-5">
                {groupedCourse.courses.map((course) => (
                  <CourseInfoForm key={course.id} course={course} />              
                ))}            
              </ShowcaseSection>
            ))}            
          </div>          
        </div>
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        {/* <PaymentsOverview
          className="col-span-12 xl:col-span-7"
          key={extractTimeFrame("payments_overview")}
          timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
        />

        <WeeksProfit
          key={extractTimeFrame("weeks_profit")}
          timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
          className="col-span-12 xl:col-span-5"
        />

        <UsedDevices
          className="col-span-12 xl:col-span-5"
          key={extractTimeFrame("used_devices")}
          timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
        /> */}

        {/* <RegionLabels /> */}

        {/* <div className="col-span-12 grid xl:col-span-8">
          <Suspense fallback={<TopChannelsSkeleton />}>
            <TopChannels />
          </Suspense>
        </div> */}

        {/* <Suspense fallback={null}>
          <ChatsCard />
        </Suspense> */}
      </div>
    </>
  );
}
