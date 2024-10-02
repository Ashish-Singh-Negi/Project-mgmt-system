"use client";

import React, { FormEvent, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { CiEdit } from "react-icons/ci";

import { useGroupContext } from "@/context/GroupContext";

import AttandenceTableCard from "@/app/components/AttandenceTableCard";
import { useStudentInfoContext } from "@/context/StudentProfileContext";

const GroupInfoPage = () => {
  const { groupData } = useGroupContext();

  const { studentInfo } = useStudentInfoContext();

  const [edit, setEdit] = useState(false);
  const [projectTitle, setProjectTitle] = useState(groupData?.projectTitle);

  const projectTitleHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `/api/group/title`,
        {
          username: studentInfo?.username,
          id: groupData?._id,
          projectTitle,
        },
        {
          withCredentials: true,
        }
      );

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

  return (
    <div className="h-full w-full md:w-[80%]">
      <h1 className="text-4xl font-semibold mt-2 mb-4 text-red-400 px-1">
        Group Info.
      </h1>
      <main className="h-fit w-full flex flex-col gap-4 p-4 md:p-6 text-base md:text-lg font-medium">
        <p className="w-[300px] flex gap-4">
          <span className="w-32">Group no </span>:
          <span>{groupData?.groupNo}</span>
        </p>
        <form onSubmit={projectTitleHandler} className="w-[340px] flex gap-4">
          { !edit && <span className="w-32">Project title</span>} :
          <div className="flex items-center gap-2">
            {" "}
            {edit ? (
              <input
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="h-8 w-40 px-1 outline-none rounded-md border-2 border-red-300 text-sm active focus:border-blue-500 transition-all"
                type="text"
                placeholder="title"
              />
            ) : (
              <span>{projectTitle}</span>
            )}
            {edit ? (
              <button
                type="button"
                onClick={() => setEdit(!edit)}
                className="px-4 py-1 bg-blue-400 text-white rounded-lg text-sm"
              >
                save
              </button>
            ) : (
              <button onClick={() => setEdit(!edit)}>
                <CiEdit className="cursor-pointer h-5 w-5 text-blue-500 " />
              </button>
            )}
          </div>
        </form>
        <p className="w-[300px]  flex gap-4">
          <span className="w-32">Guide </span>:<span>{groupData?.guide}</span>
        </p>
        <p className="w-[300px]  flex gap-4">
          <span className="w-32">Branch </span>:<span>{groupData?.branch}</span>
        </p>
        <p className="w-[300px]  flex gap-4">
          <span className="w-32">Semester </span>:
          <span>{groupData?.semester}</span>
        </p>

        <p className="w-[300px] mb-2">Students </p>
        <div className="h-fit w-full flex flex-col border-2 border-l-red-500 font-normal">
          <div className="h-12 w-full border-b-2 flex justify-between items-center px-4 font-medium text-sm md:text-lg">
            <p className="h-fit w-[15%]">PID</p>
            <p className="h-fit w-[10%]">Roll no.</p>
            <p className="h-fit w-[10%]">Division</p>
            <p className="h-fit w-[40%]">Name</p>
            <p className="h-fit w-[15%]">Attendance</p>
          </div>
          {groupData?.students.map((student) => (
            <AttandenceTableCard
              key={student._id}
              pid={student.pid}
              rollNo={student.rollNo}
              division={student.division}
              username={student.username}
              attendance={student.attendance}
              totalAttendance={groupData.records.length}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default GroupInfoPage;
