"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InvoiceTable } from "@/components/Tables/invoice-table";
import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { TopProducts } from "@/components/Tables/top-products";
import { TopProductsSkeleton } from "@/components/Tables/top-products/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";
import { PeerReviewTable } from "@/components/Tables/peer-review-table";

const PeerReviewSummary = () => {
  const params = useParams();
  const { courseid } = params;
  //mock data
  const data = [
      {
        id: 1,
        assignmentName: "Assignment 1",
        submitStatus: "Configured",
        submittedTime: "20 Jan 25 12:55:23",
        viewDetail: "View",
        createPeerReview: true,
      },
      {
        id: 2,
        assignmentName: "Assignment 2",
        submitStatus: "Configured",
        submittedTime: "22 Jan 25 11:05:33",
        viewDetail: "View",
        createPeerReview: true,
      },
      {
        id: 3,
        assignmentName: "Assignment 3",
        submitStatus: "Not Configured",
        submittedTime: "-",
        viewDetail: "View",
        createPeerReview: true,
      },
      {
        id: 4,
        assignmentName: "Assignment 4",
        submitStatus: "Configured",
        submittedTime: "19 Jan 25 22:00:21",
        viewDetail: "View",
        createPeerReview: true,
      },
      {
        id: 5,
        assignmentName: "Assignment 5",
        submitStatus: "Not Configured",
        submittedTime: "-",
        viewDetail: "View",
        createPeerReview: true,
      },
      {
        id: 6,
        assignmentName: "Assignment 6",
        submitStatus: "Configured",
        submittedTime: "-",
        viewDetail: "View",
        createPeerReview: true,
      },
    ];
  const peerreviewdata = [
    {
      id: 1,
      assignmentName: "Assignment 1",
      submitStatus: "Configured",
      submittedTime: "20 Jan 25 12:55:23",
      viewDetail: "View",
      createPeerReview: true,
    },
    {
      id: 2,
      assignmentName: "Assignment 2",
      submitStatus: "Configured",
      submittedTime: "22 Jan 25 11:05:33",
      viewDetail: "View",
      createPeerReview: true,
    },
    {
      id: 3,
      assignmentName: "Assignment 3",
      submitStatus: "Not Configured",
      submittedTime: "-",
      viewDetail: "View",
      createPeerReview: true,
    },
    {
      id: 4,
      assignmentName: "Assignment 4",
      submitStatus: "Configured",
      submittedTime: "19 Jan 25 22:00:21",
      viewDetail: "View",
      createPeerReview: true,
    },
    {
      id: 5,
      assignmentName: "Assignment 5",
      submitStatus: "Not Configured",
      submittedTime: "-",
      viewDetail: "View",
      createPeerReview: true,
    },
    {
      id: 6,
      assignmentName: "Assignment 6",
      submitStatus: "Configured",
      submittedTime: "-",
      viewDetail: "View",
      createPeerReview: true,
    },
  ];
//   console.log("Peer Review Summary ID:", courseid);
  return (
    <>
      <Breadcrumb pageName="Assignment" />

      <div className="space-y-10">
        {/* <Suspense fallback={<TopChannelsSkeleton />}>
          <TopChannels />
        </Suspense>

        <Suspense fallback={<TopProductsSkeleton />}>
          <TopProducts />
        </Suspense> */}
        <PeerReviewTable data={data} />
        <PeerReviewTable data={peerreviewdata} />
      </div>
    </>
  );
};

export default PeerReviewSummary;

