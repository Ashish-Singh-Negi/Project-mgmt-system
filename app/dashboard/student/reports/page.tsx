"use client";

import React, { useState } from "react";
import { useEffect } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { useStudentInfoContext } from "@/context/StudentProfileContext";
import { useGroupContext } from "@/context/GroupContext";

import TableSlice from "@/app/components/TableSlice";
import Loader from "@/app/components/Loader";

import { FaExchangeAlt } from "react-icons/fa";

const GroupReportsPage = () => {
  const { studentInfo } = useStudentInfoContext();
  const { groupData, setGroupData } = useGroupContext();

  const [toggleReport, setToggleReport] = useState(false);

  const [loading, setLoading] = useState(true);

  const getGroupReports = async () => {
    try {
      const { data } = await axios.get(`/api/group/${studentInfo?.semester}`, {
        params: {
          role: null,
          username: studentInfo?.username,
          branch: studentInfo?.branch,
          division: studentInfo?.division,
          groupNo: studentInfo?.groupNo,
        },
      });

      // toast.success(data.message);

      setGroupData(data.group);

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
    if (studentInfo) getGroupReports();
  }, [studentInfo]);

  if (loading) return <Loader size="h-32 w-32" />;

  return (
    <div className="h-full w-full md:w-[80%] text-sm md:text-xl">
      <h1 className="text-4xl font-semibold mt-2 mb-4 text-red-400 px-[2px]">
        Group Reports
      </h1>
      <div className="h-12 w-full border-2 flex items-center border-red-400 font-medium">
        <p className="w-[15%] text-center">Date</p>
        <div
          onClick={() => setToggleReport(!toggleReport)}
          className="w-[40%] text-center cursor-pointer transition-all"
        >
          {toggleReport ? "Remark" : "Report"}
          <FaExchangeAlt className="inline h-4 w-4 ml-2" />
        </div>
        <p className="w-[15%] text-center">Guide</p>
        <p className="w-[15%] text-center">Coor...</p>
        <p className="w-[15%] text-center">Hod</p>
      </div>
      <main className="h-[740px] w-full overflow-y-auto lg:border-2">
        {groupData?.records.length ? (
          groupData?.records.map((val) => (
            <TableSlice
              key={val.createdAt}
              createdAt={val.createdAt}
              report={val.report}
              remark={val.remark}
              toggleReport={toggleReport}
              role={null}
              guideSign={val.guideSign}
              coordiantorSign={val.coordinatorSign}
              hodSign={val.hodSign}
            />
          ))
        ) : (
          <p className="text-center font-medium mt-4">No report added yet.</p>
        )}
      </main>
    </div>
  );
};

export default GroupReportsPage;
