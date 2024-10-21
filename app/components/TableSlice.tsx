"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

import { useAdminInfoContext } from "@/context/AdminProfileContext";

import { Student } from "@/lib/types";

import AttendanceBtn from "./AttendanceBtn";

const timestampToDDMMYYYY = (timestamp: string) => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based (0 = January)
  const year = date.getFullYear();

  // Pad single-digit day and month with leading zeros
  const formattedDay = day.toString().padStart(2, "0");
  const formattedMonth = month.toString().padStart(2, "0");

  return `${formattedDay}-${formattedMonth}-${year}`;
};

const TableSlice = ({
  id,
  guide,
  semester,
  division,
  groupNo,
  students,
  role,
  report,
  remark,
  attendance,
  toggleReport,
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
  remark?: string;
  toggleReport?: boolean;
  students?: Student[];
  guideSign?: boolean;
  coordiantorSign?: boolean;
  hodSign?: boolean;
  createdAt: string;
}) => {
  const { adminInfo } = useAdminInfoContext();

  const [guideSignIs, setGuideSignIs] = useState(guideSign);
  const [coordinatorSignIs, setCoordinatorSignIs] = useState(coordiantorSign);
  const [hodSignIs, setHodSignIs] = useState(hodSign);

  const [remarkIs, setRemarkIs] = useState("");

  const [attendanceIs, setAttendanceIs] = useState<string[]>([]);

  const dateIs = timestampToDDMMYYYY(createdAt);

  const updateGroupreport = async () => {
    const finalAttendance: string[] = [];

    students!.map((student, i) => {
      finalAttendance[i] = "";
      attendanceIs.map((value) => {
        if (student.username === value) {
          finalAttendance[i] = value;
        }
      });
    });

    try {
      const { data } = await axios.put(`/api/group`, {
        username: adminInfo?.username,
        role: adminInfo?.role,
        branch: adminInfo?.branch,
        id,
        semester,
        division,
        groupNo,
        remark: remarkIs,
        finalAttendance,
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
        <div className="h-fit w-full border-red-500 p-2 hover:border-l-4 hover:border-red-500 transition-all">
          <div className="h-fit w-full flex flex-col justify-center lg:flex-row lg:items-center lg:justify-between">
            <div className="h-10 w-fit flex items-center text-white bg-red-400 rounded-r-lg">
              <div className="h-8 bg-red-500 rounded-r-lg flex items-center">
                <p className="px-4 bg-red-600 rounded-r-lg">
                  Sem : <span className="font-semibold">{semester}</span>
                </p>
                <p className="px-4 bg-red-500 rounded-r-lg ">
                  Gno : <span className="font-semibold">{groupNo}</span>
                </p>
              </div>
              <span className="px-4 bg-red-400 rounded-r-lg font-medium">
                {dateIs}
              </span>
            </div>
            <div className="flex flex-col justify-center gap-2 mt-2 lg:flex-row">
              {!guideSignIs &&
                students?.map((student, i) => {
                  let isChecked = false;

                  if (attendance![i] === student.username) isChecked = true;

                  return (
                    <AttendanceBtn
                      key={`name-${student.username}`}
                      name={student.username}
                      setAttendance={setAttendanceIs}
                      size="h-4 w-4"
                      textSize="text-sm"
                      isCheck={isChecked}
                    />
                  );
                })}
            </div>
          </div>
          <div className="h-fit w-full">
            <p className="mt-1 px-1 font-semibold border-l-2 border-red-500">
              {report}
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            {guideSignIs ? (
              <input
                disabled
                value={remark!}
                placeholder="remark"
                className="h-10 w-80 text-sm md:w-[60%] resize-none border-2 focus:border-red-300 outline-none p-2 cursor-not-allowed"
              ></input>
            ) : (
              <input
                value={remarkIs}
                onChange={(e) => setRemarkIs(e.target.value)}
                placeholder="remark"
                className="h-10 w-80 text-sm md:w-[60%] resize-none border-2 border-red-200 focus:border-red-300 outline-none p-2"
              ></input>
            )}
            <button
              onClick={() => setGuideSignIs(true)}
              className={`h-10 ${
                guideSignIs
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-red-500 active:scale-95"
              } px-4 py-[2px] rounded-lg text-white  transition-all md:text-base`}
            >
              {guideSignIs ? "Checked" : "Check"}
            </button>
          </div>
        </div>
      )}{" "}
      {role === "Coordinator" && (
        <div className="h-fit w-full flex items-center border-b-2 box-border py-2">
          <p className="w-[5%] text-center">{groupNo}</p>
          <p className="w-[5%] text-center">{semester}</p>
          <p className="w-[15%] text-center">{dateIs}</p>
          <p className="w-[45%] text-center">
            {" "}
            {report.length > 50 ? `${report.substring(0, 40)}...` : report}
          </p>
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
              } px-3 py-[2px] rounded-lg text-white transition-all md:text-base`}
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
          <p className="w-[40%] text-center">
            {report.length > 50 ? `${report.substring(0, 40)}...` : report}
          </p>
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
          <p className="w-[15%] flex justify-center">
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
          <p className="w-[40%] text-center">
            {toggleReport ? remark : report}
          </p>
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
