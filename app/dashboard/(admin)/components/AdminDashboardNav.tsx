"use client";

import React from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";

import { useAdminInfoContext } from "@/context/AdminProfileContext";

const AdminDashboardNav = () => {
  const { adminInfo } = useAdminInfoContext();

  const path = usePathname();

  return (
    <div className="h-10 w-full flex justify-evenly items-center">
      <div className="h-full w-full md:w-[80%] text-lg flex font-normal text-red-400 border-b-2 border-red-50">
        <Link
          href={`${adminInfo?.role.toLowerCase()}`}
          className={`h-full px-4 flex items-center transition-all ${
            (path.includes("hod") ||
              path.includes("guide") ||
              path.includes("coordinator")) &&
            "font-medium text-red-500 bg-red-50"
          }`}
        >
          Reports
        </Link>
        <Link
          href={`groups`}
          className={`h-full px-4 flex items-center transition-all ${
            path.includes("groups") && "font-medium text-red-500 bg-red-50"
          }`}
        >
          Groups
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardNav;
