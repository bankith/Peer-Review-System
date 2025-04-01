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
      dueDate: "20 Jan 25 12:55:23",
      createPeerReview: true, 
    },
    {
      id: 2,
      assignmentName: "Assignment 2",
      dueDate: "21 Jan 25 12:55:23",
      createPeerReview: true, 
    },
    {
      id: 3,
      assignmentName: "Assignment 3",
      dueDate: "22 Jan 25 12:55:23",
      createPeerReview: false, 
    },
  ];
  
  const peerreviewdata = [
    {
      id: 1,
      assignmentName: "Peer Review Assignment 1",
      dueDate: "21 Jan 25 12:55:23",
      createPeerReview: true,
    },
    {
      id: 2,
      assignmentName: "Peer Review Assignment 2",
      dueDate: "25 Jan 25 12:55:23",
      createPeerReview: false,
    },
  ];
//   console.log("Peer Review Summary ID:", courseid);
  return (
    <>
      <Breadcrumb pageName="Subject" />

      <div className="space-y-10">
        <PeerReviewTable data={data} isPeerReview={false} />
        <PeerReviewTable data={peerreviewdata} isPeerReview={true} />
      </div>
    </>
  );
};

export default PeerReviewSummary;

