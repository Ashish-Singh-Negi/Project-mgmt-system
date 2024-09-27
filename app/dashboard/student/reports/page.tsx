"use client";

import React from "react";
import { useEffect } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { useStudentInfoContext } from "@/context/StudentProfileContext";
import { useGroupContext } from "@/context/GroupContext";

import TableSlice from "@/app/components/TableSlice";

const GroupReportsPage = () => {
  const { studentInfo } = useStudentInfoContext();
  const { groupData, setGroupData } = useGroupContext();

  const getGroupReports = async () => {
    try {
      const { data } = await axios.get(`/api/group/${studentInfo?.semester}`, {
        params: {
          username: studentInfo?.semester,
          role: null,
          branch: studentInfo?.branch,
          division: studentInfo?.division,
          groupNo: studentInfo?.groupNo,
        },
      });

      toast.success(data.message);

      setGroupData(data.group);
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

  return (
    <div className="h-full w-full md:w-[80%] text-sm md:text-xl">
      <h1 className="text-4xl font-semibold mt-2 mb-4 text-red-400">
        Group Reports
      </h1>
      <div className="h-12 w-full border-2 flex items-center border-red-400 font-medium ">
        <p className="w-[15%] text-center">Date</p>
        <p className="w-[40%] text-center">Report</p>
        <p className="w-[15%] text-center">Guide</p>
        <p className="w-[15%] text-center">Coordinator</p>
        <p className="w-[15%] text-center">Hod</p>
      </div>
      <main className="h-[740px] w-full overflow-y-auto lg:border-2">
        {groupData?.records.length ? (
          groupData?.records.map((val) => (
            <TableSlice
              key={val.createdAt}
              col={5}
              createdAt={val.createdAt}
              report={val.report}
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
