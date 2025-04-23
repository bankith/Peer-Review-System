import "@/css/satoshi.css";
import "@/css/style.css";
import { SessionProvider } from "next-auth/react"
import { Sidebar } from "@/components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import "reflect-metadata"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: {
    template: "APRS - Assignment Peer-Review System",
    default: "APRS - Assignment Peer-Review System",
  },
  description:
    "Assignment Peer-Review System.",
};

export default function RootLayout({ children }: PropsWithChildren) {  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>            
          <NextTopLoader color="#018ADA" showSpinner={false} />

          <div className="flex min-h-screen">            

            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
              {/* <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10"> */}
                <SessionProvider>
                {children}
                </SessionProvider>
              {/* </main> */}
            </div>
          </div>        
          <ToastContainer />
      </body>
    </html>
  );
}
