"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";

import { useAdminInfoContext } from "@/context/AdminProfileContext";
import { useGroupsContext } from "@/context/GroupsContext";

import TableSlice from "@/app/components/TableSlice";
import AdminDashboardNav from "../components/AdminDashboardNav";

const HodDashboardPage = () => {
  const { adminInfo } = useAdminInfoContext();
  const { groups, setGroups } = useGroupsContext();

  const [filterToggle, setFilterToggle] = useState(false);
  const [filter, setFilter] = useState<string>("");

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
        toast.error(error.response?.data.message || "An error occurred");
      } else {
        console.error(error);
        throw new Error("An Error occured");
      }
    }
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    if (adminInfo) getAllGroupReports();
    setFilter("All");
  }, [adminInfo]);

  return (
    <>
      <AdminDashboardNav />
      <main className="h-[840px] w-full flex justify-center">
        <div className="h-full w-full md:w-[80%]">
          <h1 className="relative text-2xl md:text-4xl font-semibold flex items-center justify-between mt-2 mb-4 px-1 text-red-500">
            Group Reports
            <button
              onClick={() => setFilterToggle(!filterToggle)}
              className="flex items-center gap-2 cursor-pointer text-xl text-black "
            >
              Filters
              <HiMiniAdjustmentsHorizontal className="h-5 w-5" />
            </button>
            {filterToggle && (
              <div
                className={`absolute right-2 top-10 h-fit w-fit flex flex-col bg-red-50 p-2 rounded-md transition-all text-black text-base`}
              >
                <label className="flex gap-2 px-1 py-1 cursor-pointer">
                  <input
                    onChange={handleRadioChange}
                    name="filter"
                    type="radio"
                    value={"All"}
                    defaultChecked
                  />
                  All
                </label>
                <label className="flex gap-2 px-1 py-1 cursor-pointer">
                  <input
                    onChange={handleRadioChange}
                    name="filter"
                    type="radio"
                    value={"Checked"}
                  />
                  Checked
                </label>
                <label className="flex gap-2 px-1 py-1 cursor-pointer">
                  <input
                    onChange={handleRadioChange}
                    name="filter"
                    type="radio"
                    value={"Not Checked"}
                  />
                  Not checked
                </label>
              </div>
            )}
          </h1>
          {/* <p className="w-fit flex text-base rounded-t-lg bg-red-300 text-white">
            <span className="bg-red-500 px-4 rounded-tl-lg py-1">Hod</span>
            <span className=" px-4 rounded-tr-lg py-1">Guide</span>
          </p> */}
          <div className="h-12 w-full text-sm md:text-xl border-2 flex items-center border-red-400 font-medium transition-all">
            <p className="w-[15%] text-center">Date</p>
            <p className="w-[40%] text-center">Report</p>
            <p className="w-[15%] text-center">Guide</p>
            <p className="w-[15%] text-center">Coordinator</p>
            <p className="w-[15%] text-center">Hod</p>
          </div>
          <main className="h-[740px] w-full text-sm md:text-xl overflow-y-auto lg:border-2">
            {groups?.map((group) =>
              group.records.map((record) => {
                if (filter === "All") {
                  return (
                    <TableSlice
                      key={`${record._id}`}
                      guide={group.guide}
                      semester={group.semester}
                      division={group.division}
                      groupNo={group.groupNo}
                      col={5}
                      role={"HOD"}
                      id={record._id}
                      report={record.report}
                      attendance={record.attendance}
                      guideSign={record.guideSign}
                      coordiantorSign={record.coordinatorSign}
                      hodSign={record.hodSign}
                      createdAt={record.createdAt}
                    />
                  );
                }
                if (filter === "Checked") {
                  if (
                    record.guideSign &&
                    record.coordinatorSign &&
                    record.hodSign
                  ) {
                    return (
                      <TableSlice
                        key={`${record._id}`}
                        guide={group.guide}
                        semester={group.semester}
                        division={group.division}
                        groupNo={group.groupNo}
                        col={5}
                        role={"HOD"}
                        id={record._id}
                        report={record.report}
                        attendance={record.attendance}
                        guideSign={record.guideSign}
                        coordiantorSign={record.coordinatorSign}
                        hodSign={record.hodSign}
                        createdAt={record.createdAt}
                      />
                    );
                  }
                }
                if (filter === "Not Checked") {
                  if (
                    record.guideSign !== true ||
                    record.coordinatorSign !== true ||
                    record.hodSign !== true
                  ) {
                    return (
                      <TableSlice
                        key={`${record._id}`}
                        guide={group.guide}
                        semester={group.semester}
                        division={group.division}
                        groupNo={group.groupNo}
                        col={5}
                        role={"HOD"}
                        id={record._id}
                        report={record.report}
                        attendance={record.attendance}
                        guideSign={record.guideSign}
                        coordiantorSign={record.coordinatorSign}
                        hodSign={record.hodSign}
                        createdAt={record.createdAt}
                      />
                    );
                  }
                }
              })
            )}
          </main>
        </div>
      </main>
    </>
  );
};

export default HodDashboardPage;
