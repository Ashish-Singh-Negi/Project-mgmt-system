"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { useAdminInfoContext } from "@/context/AdminProfileContext";
import { useGroupsContext } from "@/context/GroupsContext";

import TableSlice from "@/app/components/TableSlice";
import AdminDashboardNav from "../components/AdminDashboardNav";
import TableHead from "@/app/components/TableHead";
import Loader from "@/app/components/Loader";

const GuideDashboardPage = () => {
  const { adminInfo } = useAdminInfoContext();
  const { groups, setGroups } = useGroupsContext();

  const [loading, setLoading] = useState(true);

  const getGroupReports = async (sem: number, div: string, gno: number) => {
    try {
      const { data } = await axios.get(`/api/group/${sem}`, {
        params: {
          username: adminInfo?.username,
          branch: adminInfo?.branch,
          role: adminInfo?.role,
          division: div,
          groupNo: gno,
        },
      });

      toast.success(data.message);

      setGroups(data.groups);

      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "An error occurred");
      } else {
        console.error(error);
        throw new Error("An Error occured");
      }
    }
  };

  useEffect(() => {
    if (adminInfo) {
      adminInfo?.guideOf?.map((val) => {
        val.groupNo.map((num) => {
          getGroupReports(val.semester, val.division, num);
        });
      });
    }
  }, [adminInfo]);

  if (loading) return <Loader size="h-32 w-32" />;

  return (
    <>
      <AdminDashboardNav />
      <main className="h-[840px] w-full flex justify-center">
        <div className="h-full w-full md:w-[80%]">
          <h1 className="relative text-4xl font-semibold flex items-center justify-between mt-2 mb-4 px-1 text-red-500">
            Group Reports
          </h1>
          <TableHead role={"Guide"} />
          <main className="h-[740px] w-full overflow-y-auto lg:border-2 text-sm md:text-base lg:text-lg">
            {groups?.map((group) =>
              group.records.map((record) => {
                return (
                  <TableSlice
                    key={`${record._id}`}
                    guide={group.guide}
                    semester={group.semester}
                    division={group.division}
                    groupNo={group.groupNo}
                    role={"Guide"}
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

export default GuideDashboardPage;
