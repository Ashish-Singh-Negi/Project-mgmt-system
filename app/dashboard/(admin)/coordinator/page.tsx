"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { useAdminInfoContext } from "@/context/AdminProfileContext";
import { useGroupsContext } from "@/context/GroupsContext";
import { useCurrentRoleContext } from "@/context/AdminCurrentRole";

import TableSlice from "@/app/components/TableSlice";
import TableHead from "@/app/components/TableHead";
import Loader from "@/app/components/Loader";

const CoordinatorDashboardPage = () => {
  const { adminInfo } = useAdminInfoContext();
  const { groups, setGroups } = useGroupsContext();

  const [loading, setLoading] = useState(true);

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

      setGroups(data.groups);

      setLoading(false);
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

  if (loading) return <Loader size="h-32 w-32" />;

  return (
    <>
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
          {currentRole !== "Guide" && <TableHead role={currentRole!} />}
          <main className="h-[760px] w-full text-sm md:text-base lg:text-lg overflow-y-auto">
            {groups?.map((group) => {
              return group.records.map((record) => {
                return (
                  <TableSlice
                    key={`${record._id}`}
                    guide={group.guide}
                    semester={group.semester}
                    division={group.division}
                    groupNo={group.groupNo}
                    role={currentRole}
                    id={record._id}
                    students={group.students}
                    report={record.report}
                    guideSign={record.guideSign}
                    coordiantorSign={record.coordinatorSign}
                    hodSign={record.hodSign}
                    createdAt={record.createdAt}
                    attendance={record.attendance}
                  />
                );
              });
            })}
          </main>
        </div>
      </main>
    </>
  );
};

export default CoordinatorDashboardPage;
