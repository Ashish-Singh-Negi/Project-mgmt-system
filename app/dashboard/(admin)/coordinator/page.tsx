"use client";

import React, { useEffect } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { useAdminInfoContext } from "@/context/AdminProfileContext";
import { useGroupsContext } from "@/context/GroupsContext";
import { useCurrentRoleContext } from "@/context/AdminCurrentRole";

import TableSlice from "@/app/components/TableSlice";
import AdminDashboardNav from "../components/AdminDashboardNav";
import TableHead from "@/app/components/TableHead";

const CoordinatorDashboardPage = () => {
  const { adminInfo } = useAdminInfoContext();
  const { groups, setGroups } = useGroupsContext();

  const { currentRole, setCurrentRole } = useCurrentRoleContext();

  const getAllGroupReports = async () => {
    try {
      const { data } = await axios.get(`/api/group`, {
        params: {
          user: adminInfo?.username,
          role: adminInfo?.role,
          branch: adminInfo?.branch,
        },
      });

      toast.success(data.message);
      setGroups(data.groups);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        console.error(error);
        throw new Error("An Error occured");
      }
    }
  };

  useEffect(() => {
    if (adminInfo) {
      getAllGroupReports();
    }
  }, [adminInfo]);

  return (
    <>
      <AdminDashboardNav />
      <main className="h-[840px] w-full flex justify-center">
        <div className="h-full w-full md:w-[80%]">
          <header className="relative text-2xl md:text-4xl font-semibold flex items-center justify-between mt-2 mb-4 px-1 text-red-500">
            Group Reports
            <div className="flex gap-4">
              <div className="text-sm  flex rounded-2xl bg-red-100">
                <button
                  onClick={() => setCurrentRole(`Coordinator`)}
                  className={`${
                    currentRole === "Coordinator" && "bg-red-400 text-white"
                  } py-1 pl-4 pr-2 rounded-l-2xl transition-all`}
                >
                  Coordinator
                </button>
                <button
                  onClick={() => setCurrentRole("Guide")}
                  className={`${
                    currentRole === "Guide" && "bg-red-400 text-white"
                  } py-1 pr-4 pl-2 rounded-r-2xl transition-all`}
                >
                  Guide
                </button>
              </div>
            </div>
          </header>
          <TableHead role={currentRole!} />
          <main className="h-[740px] w-full overflow-y-auto lg:border-2 text-sm md:text-xl ">
            {groups?.map((group) =>
              group.records.map((record) => {
                return (
                  <TableSlice
                    key={`${record._id}`}
                    guide={group.guide}
                    semester={group.semester}
                    division={group.division}
                    groupNo={group.groupNo}
                    role={currentRole}
                    id={record._id}
                    report={record.report}
                    guideSign={record.guideSign}
                    coordiantorSign={record.coordinatorSign}
                    hodSign={record.hodSign}
                    createdAt={record.createdAt}
                    attendance={record.attendance}
                  />
                );
              })
            )}
          </main>
        </div>
      </main>
    </>
  );
};

export default CoordinatorDashboardPage;
