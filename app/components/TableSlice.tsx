"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { useAdminInfoContext } from "@/context/AdminProfileContext";

const TableSlice = ({
  col,
  id,
  guide,
  semester,
  division,
  groupNo,
  role,
  report,
  guideSign,
  coordiantorSign,
  hodSign,
  createdAt,
}: {
  col: 3 | 4 | 5;
  guide?: string;
  role: "Guide" | "Coordinator" | "HOD" | null;
  id?: string;
  semester?: number;
  division?: string;
  groupNo?: number;
  report: string;
  attendance?: string[];
  guideSign?: boolean;
  coordiantorSign?: boolean;
  hodSign?: boolean;
  createdAt: string;
}) => {
  const [guideSignIs, setGuideSignIs] = useState(guideSign);
  const [coordinatorSignIs, setCoordinatorSignIs] = useState(coordiantorSign);
  const [hodSignIs, setHodSignIs] = useState(hodSign);

  const { adminInfo } = useAdminInfoContext();

  const timestampToDDMMYYYY = (timestamp: string) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based (0 = January)
    const year = date.getFullYear();

    // Pad single-digit day and month with leading zeros
    const formattedDay = day.toString().padStart(2, "0");
    const formattedMonth = month.toString().padStart(2, "0");

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const dateIs = timestampToDDMMYYYY(createdAt);

  const updateGroupreport = async () => {
    try {
      const { data } = await axios.put(`/api/group`, {
        username: adminInfo?.username,
        role: adminInfo?.role,
        branch: adminInfo?.branch,
        id,
        semester,
        division,
        groupNo,
        guideSign: guideSignIs,
        coordinatorSign: coordinatorSignIs,
        hodSign: hodSignIs,
      });

      toast.success(data.message);
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
    if (
      guideSignIs !== guideSign ||
      coordinatorSignIs !== coordiantorSign ||
      hodSignIs !== hodSign
    ) {
      updateGroupreport();
    }
  }, [guideSignIs, coordinatorSignIs, hodSignIs]);

  return (
    <>
      {col === 3 ? (
        <div className="h-14 w-full flex items-center border-b-2 box-border">
          <p className="w-[20%] text-center">{dateIs}</p>
          <p className="w-[60%] text-center">{report}</p>
          <p className="w-[20%] text-center">
            <button
              onClick={() => setGuideSignIs(true)}
              className={` ${
                guideSignIs
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-red-500 active:scale-95"
              } px-4 py-[2px] rounded-lg text-white  transition-all`}
            >
              {guideSignIs ? "Checked" : "Check"}
            </button>
          </p>
        </div>
      ) : col === 4 ? (
        <div className="h-14 w-full flex items-center border-b-2 box-border">
          <p className="w-[15%] text-center">{dateIs}</p>
          <p className="w-[55%] text-center">{report}</p>
          <p className="w-[15%] text-center">
            {guide === adminInfo?.username && role ? (
              <button
                onClick={() => setGuideSignIs(true)}
                className={` ${
                  guideSignIs
                    ? "bg-green-500 cursor-not-allowed"
                    : "bg-red-500 active:scale-95"
                } px-4 py-[2px] rounded-lg text-white  transition-all`}
              >
                {guideSignIs ? "Checked" : "Check"}
              </button>
            ) : (
              <span
                className={`${
                  guideSignIs ? "text-green-500" : "text-red-500"
                } px-4 font-medium py-[2px] rounded-lg transition-all`}
              >
                {guideSignIs ? "Checked" : "Not Check"}
              </span>
            )}
          </p>
          <p className="w-[15%] text-center">
            <button
              onClick={() => guideSignIs && setCoordinatorSignIs(true)}
              className={` ${guideSignIs ? "" : "cursor-not-allowed"} ${
                coordinatorSignIs
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-red-500"
              } px-4 py-[2px] rounded-lg text-white transition-all`}
            >
              {coordinatorSignIs ? "Checked" : "Check"}
            </button>
          </p>
        </div>
      ) : (
        <div className="h-14 w-full flex items-center border-b-2 box-border">
          <p className="w-[15%] text-center">{dateIs}</p>
          <p className="w-[40%] text-center">{report}</p>
          <p className="w-[15%] text-center">
            {guide === adminInfo?.username && role ? (
              <button
                onClick={() => setGuideSignIs(true)}
                className={` ${
                  guideSignIs
                    ? "bg-green-500 cursor-not-allowed"
                    : "bg-red-500 active:scale-95"
                } px-4 py-[2px] rounded-lg text-white  transition-all`}
              >
                {guideSignIs ? "Checked" : "Check"}
              </button>
            ) : (
              <span
                className={`${
                  guideSignIs ? "text-green-500" : "text-red-500"
                } px-4 font-medium py-[2px] rounded-lg transition-all`}
              >
                {guideSignIs ? "Checked" : "Not Check"}
              </span>
            )}
          </p>
          <p className="w-[15%] text-center">
            <span
              className={` ${
                coordinatorSignIs ? "text-green-500" : "text-red-500"
              } px-4 font-medium py-[2px] rounded-lg transition-all`}
            >
              {coordinatorSignIs ? "Checked" : "Not Check"}
            </span>
          </p>
          <p className="w-[15%] text-center">
            {role === "HOD" ? (
              <button
                onClick={() =>
                  guideSignIs && coordinatorSignIs && setHodSignIs(true)
                }
                className={` ${
                  guideSignIs && coordinatorSignIs ? "" : "cursor-not-allowed"
                } ${
                  hodSignIs ? "bg-green-500 cursor-not-allowed" : "bg-red-500"
                } px-4 py-[2px] rounded-lg text-white transition-all`}
              >
                {hodSignIs ? "Checked" : "Check"}
              </button>
            ) : (
              <span
                className={` ${
                  hodSignIs ? "text-green-500" : "text-red-500 "
                } px-4 font-medium py-[2px] rounded-lg transition-all`}
              >
                {hodSignIs ? "Checked" : "Not Check"}
              </span>
            )}
          </p>
        </div>
      )}
    </>
  );
};

export default TableSlice;
