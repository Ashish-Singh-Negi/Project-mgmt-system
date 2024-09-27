"use client";

import React from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";

const StudentDashboardNav = () => {
  const path = usePathname();

  return (
    <div className="h-full w-full md:w-[80%] text-lg flex font-normal text-red-400 border-b-2 border-red-50">
      <Link
        href={`reports`}
        className={`h-full px-4 flex items-center ${
          path.includes("reports") && "font-medium text-red-500 bg-red-50"
        }`}
      >
        Reports
      </Link>
      <Link
        href={`newreport`}
        className={`h-full px-4 flex items-center  ${
          path.includes("newreport") && "font-medium text-red-500 bg-red-50"
        }`}
      >
        Create
      </Link>
      <Link
        href={`info`}
        className={`h-full px-4 flex items-center  ${
          path.includes("info") && "font-medium text-red-500 bg-red-50"
        }`}
      >
        Info
      </Link>
    </div>
  );
};

export default StudentDashboardNav;
