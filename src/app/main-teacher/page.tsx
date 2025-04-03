"use client"
import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { Suspense } from "react";
import ApiService from '@/services/apiService';
import { useState, useEffect } from 'react';



export default function Home() {
  // const { selected_time_frame } = await searchParams;
  // const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);
  const [user, setUser] = useState("");
  useEffect(() => {
    var user = localStorage.getItem("user");
    if(user){
      setUser(user);
    }    
  }, [])

  return (
    <>
      {JSON.stringify(user) + " TEst s"}

      {/* <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense> */}

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

        <div className="col-span-12 grid xl:col-span-8">
          {/* <Suspense fallback={<TopChannelsSkeleton />}>
            <TopChannels />
          </Suspense> */}
        </div>

        {/* <Suspense fallback={null}>
          <ChatsCard />
        </Suspense> */}
      </div>
    </>
  );
}
