"use client";

import React, { useState } from "react";

import { Student } from "@/lib/types";

import { HiArrowTopRightOnSquare } from "react-icons/hi2";

import AttandenceTableCard from "../../../../components/AttandenceTableCard";
import axios from "axios";
import toast from "react-hot-toast";
import { useAdminInfoContext } from "@/context/AdminProfileContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GroupCard = ({
  groupNo,
  guide,
  branch,
  semester,
  division,
  projectTitle,
  students,
  totalReports,
}: {
  id: string;
  groupNo: number;
  guide: string;
  branch: string;
  semester: number;
  division: string;
  projectTitle: string;
  students: Student[];
  totalReports: number;
}) => {
  const [showmore, setShowmore] = useState(false);

  const { adminInfo } = useAdminInfoContext();

  const { push } = useRouter();

  const deleteGroupHandler = async () => {
    try {
      const { data } = await axios.delete(`/api/group`, {
        params: {
          username: adminInfo?.username,
          branch: branch,
          semester: semester,
          division: division,
          groupNo: groupNo,
        },
      });

      console.log(data);

      toast.success(data.message);

      push(`/dashboard/${adminInfo?.role.toLocaleLowerCase()}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        console.error(error);
        throw new Error("An error occured");
      }
    }
  };

  return (
    <div className={`h-fit w-full p-2 transition-all`}>
      <div className="h-full w-full flex gap-2 md:gap-4 rounded-lg">
        <div className="min-h-full w-fit rounded-l-md px-6 bg-red-500 flex justify-center items-center text-2xl md:text-3xl">
          <p className="text-white">{groupNo}</p>
        </div>
        <div className="h-full w-full flex flex-col gap-2 justify-center p-2">
          <p className="w-[360px] flex items-center gap-4">
            <span className="w-40">Project Title</span>:{" "}
            <span>{projectTitle ? projectTitle : "No Title"}</span>
          </p>
          <p className="w-[300px]  flex gap-4">
            <span className="w-40">Guide </span>:<span>{guide}</span>
          </p>
          <p className="w-[300px]  flex gap-4">
            <span className="w-40">Branch </span>:<span>{branch}</span>
          </p>
          <p className="w-[300px]  flex gap-4">
            <span className="w-40">Semester </span>:<span>{semester}</span>
          </p>
          <p className="w-[300px]  flex gap-4">
            <span className="w-40">Division </span>:<span>{division}</span>
          </p>
          {showmore && (
            <div className="h-fit w-full flex flex-col gap-4">
              <div className="w-full flex justify-between">
                <p className="w-fit flex gap-4">
                  {" "}
                  <span className="w-40">Students</span>:{" "}
                  {students.map((student) => (
                    <span key={student._id}>{student.username}</span>
                  ))}
                </p>
              </div>
              <div className="h-fit w-full border-l-2 border-l-red-500 flex flex-col border-2 font-normal">
                <div className="h-12 w-full border-b-2 flex justify-between items-center px-4 font-medium">
                  <p className="h-fit w-[15%]">PID</p>
                  <p className="h-fit w-[10%]">Roll no.</p>
                  <p className="h-fit w-[10%]">division</p>
                  <p className="h-fit w-[40%]">Student</p>
                  <Link
                    href={`/dashboard/attendance?semester=${semester}&division=${division}&groupNo=${groupNo}`}
                    className="h-fit w-[15%] flex items-center gap-1"
                  >
                    Attendance
                    <HiArrowTopRightOnSquare className="text-blue-600" />
                  </Link>
                </div>
                {students.map((student) => (
                  <AttandenceTableCard
                    key={student._id}
                    pid={student.pid}
                    rollNo={student.rollNo}
                    division={student.division}
                    username={student.username}
                    attendance={student.attendance}
                    totalAttendance={totalReports}
                  />
                ))}
              </div>
            </div>
          )}
          {students.length ? (
            <button
              onClick={() => setShowmore(!showmore)}
              className="w-fit flex gap-4"
            >
              <span className="text-blue-700 cursor-pointer">
                {showmore ? "...show less" : "show more..."}
              </span>
            </button>
          ) : (
            <p className="text-red-400">
              No Student have register to group yet
            </p>
          )}
          {adminInfo?.username === guide && (
            <button
              onClick={() => deleteGroupHandler()}
              className="w-fit text-white rounded-md bg-red-500 px-3 active:scale-95 transition-all"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
