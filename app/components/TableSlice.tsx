"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { useAdminInfoContext } from "@/context/AdminProfileContext";

import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

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
const TableSlice = ({
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
      {role === "Guide" && guide === adminInfo?.username && (
        <div className="h-fit w-full flex items-center border-b-2 box-border py-2">
          <p className="w-[5%] text-center">{groupNo}</p>
          <p className="w-[5%] text-center">{semester}</p>
          <p className="w-[15%] text-center">{dateIs}</p>
          <p className="w-[55%] text-center">{report}</p>
          <p className="w-[20%] text-center">
            <button
              onClick={() => setGuideSignIs(true)}
              className={` ${
                guideSignIs
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-red-500 active:scale-95"
              } px-4 py-[2px] rounded-lg text-white  transition-all md:text-base`}
            >
              {guideSignIs ? <FaCheck /> : "Check"}
            </button>
          </p>
        </div>
      )}{" "}
      {role === "Coordinator" && (
        <div className="h-fit w-full flex items-center border-b-2 box-border py-2">
          <p className="w-[5%] text-center">{groupNo}</p>
          <p className="w-[5%] text-center">{semester}</p>
          <p className="w-[15%] text-center">{dateIs}</p>
          <p className="w-[45%] text-center">{report}</p>
          <p className="w-[15%] flex justify-center">
            <span
              className={`${
                guideSignIs ? "text-green-500" : "text-red-500"
              } px-4 font-medium py-[2px] rounded-lg transition-all`}
            >
              {guideSignIs ? <FaCheck /> : <ImCross />}
            </span>
          </p>
          <p className="w-[15%] flex justify-center">
            <button
              onClick={() => guideSignIs && setCoordinatorSignIs(true)}
              className={` ${guideSignIs ? "" : "cursor-not-allowed"} ${
                coordinatorSignIs
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-red-500"
              } px-4 py-[2px] rounded-lg text-white transition-all md:text-base`}
            >
              {coordinatorSignIs ? <FaCheck /> : "Check"}
            </button>
          </p>
        </div>
      )}
      {role === "HOD" && (
        <div className="h-fit w-full flex items-center border-b-2 box-border py-2">
          <p className="w-[5%] text-center">{groupNo}</p>
          <p className="w-[5%] text-center">{semester}</p>
          <p className="w-[15%] text-center">{dateIs}</p>
          <p className="w-[45%] text-center">{report}</p>
          <p className="w-[10%] flex justify-center">
            <span
              className={`${
                guideSignIs ? "text-green-500" : "text-red-500"
              } px-4 font-medium py-[2px] rounded-lg transition-all`}
            >
              {guideSignIs ? <FaCheck /> : <ImCross />}
            </span>
          </p>
          <p className="w-[10%] flex justify-center">
            <span
              className={` ${
                coordinatorSignIs ? "text-green-500" : "text-red-500"
              } px-4 font-medium py-[2px] rounded-lg transition-all`}
            >
              {coordinatorSignIs ? <FaCheck /> : <ImCross />}
            </span>
          </p>
          <p className="w-[10%] flex justify-center">
            <button
              onClick={() =>
                guideSignIs && coordinatorSignIs && setHodSignIs(true)
              }
              className={` ${
                guideSignIs && coordinatorSignIs ? "" : "cursor-not-allowed"
              } ${
                hodSignIs ? "bg-green-500 cursor-not-allowed" : "bg-red-500"
              } px-3 py-[2px] rounded-lg text-white transition-all md:text-base`}
            >
              {hodSignIs ? <FaCheck /> : "Check"}
            </button>
          </p>
        </div>
      )}
      {role === null && (
        <div className="h-fit w-full flex items-center border-b-2 box-border py-2">
          <p className="w-[15%] text-center">{dateIs}</p>
          <p className="w-[40%] text-center">{report}</p>
          <p className="w-[15%] flex justify-center">
            <span
              className={`${
                guideSignIs ? "text-green-500" : "text-red-500"
              } px-4 font-medium py-[2px] rounded-lg transition-all`}
            >
              {guideSignIs ? <FaCheck /> : <ImCross />}
            </span>
          </p>
          <p className="w-[15%] flex justify-center">
            <span
              className={` ${
                coordinatorSignIs ? "text-green-500" : "text-red-500"
              } px-4 font-medium py-[2px] rounded-lg transition-all`}
            >
              {coordinatorSignIs ? <FaCheck /> : <ImCross />}
            </span>
          </p>
          <p className="w-[15%] flex justify-center">
            <span
              className={`${
                hodSignIs ? "text-green-500" : "text-red-500"
              } px-4 font-medium py-[2px] rounded-lg transition-all`}
            >
              {hodSignIs ? <FaCheck /> : <ImCross />}
            </span>
          </p>
        </div>
      )}
    </>
  );
};

export default TableSlice;
