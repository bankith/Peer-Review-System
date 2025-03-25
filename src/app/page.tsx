// 'use client';
import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { Button } from "@/components/ui-elements/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Signin from "@/components/Auth/Signin";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {


  return (
    <>
      
      <div className="flex flex-col gap-9">
          <Signin />
      </div>

      
    </>
  );
}
