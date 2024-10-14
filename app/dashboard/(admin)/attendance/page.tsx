"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useGroupContext } from "@/context/GroupContext";
import { useGroupsContext } from "@/context/GroupsContext";

import AttendenceSlice from "./components/AttendenceSlice";
import CheckBtn from "../../student/newreport/components/Checkbtn";

const AttendancePage = () => {
  const { groups } = useGroupsContext();
  const { groupData, setGroupData } = useGroupContext();

  const [add, setAdd] = useState(false);

  const [attendance, setAttendance] = useState<string[]>([]);

  const searchParams = useSearchParams();

  const semester = searchParams.get("semester");
  const division = searchParams.get("division");
  const groupNo = searchParams.get("groupNo");

  useEffect(() => {
    if (!semester || !division || !groupNo) return;

    for (const group of groups!) {
      if (
        group.semester === parseInt(semester) &&
        group.division === division &&
        group.groupNo === parseInt(groupNo)
      ) {
        setGroupData(group);
      }
    }
  }, []);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let attendanceIs: string[];

    groupData?.students.forEach((student, i) => {
      attendanceIs[i] = "";
      attendance.map((value) => {
        if (student.username === value) {
          attendanceIs[i] = value;
        }
      });
    });
  };

  return (
    <>
      <main className="h-[840px] w-full flex justify-center">
        <div className="h-full w-full md:w-[80%]">
          <header className="text-3xl md:text-4xl font-semibold flex items-center justify-between mt-2 mb-4 px-1 text-red-500">
            Attendance
            <button
              onClick={() => setAdd(!add)}
              className="px-4 py-[6px] text-sm md:text-base bg-red-500 rounded-lg font-medium text-white transition-all active:scale-95"
            >
              {add ? "Cancel" : "Add"}
            </button>
          </header>
          {add && (
            <form
              onSubmit={submitHandler}
              className="h-fit w-full flex flex-col justify-center box-border mb-4 border-l-4 border-red-500 mx-1 p-2 gap-1"
            >
              <p className="font-medium text-lg">{new Date().toDateString()}</p>
              <div className="h-fit w-full flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                {groupData?.students.map((student) => (
                  <CheckBtn
                    key={`name-${student.username}`}
                    name={student.username}
                    setAttendance={setAttendance}
                  />
                ))}
              </div>
              <button className="w-fit px-6 py-1 text-sm md:text-base bg-red-500 rounded-lg font-medium text-white transition-all active:scale-95 mt-2">
                Add
              </button>
            </form>
          )}
          <div className="h-12 w-full text-sm md:text-xl border-2 flex items-center border-red-400 font-medium transition-all">
            <p className="w-[20%] text-center">Date</p>
            {groupData?.students.map((student) => (
              <p key={student.pid} className="w-[20%] text-center">
                {student.pid}
              </p>
            ))}
          </div>
          <main className="h-[720px] w-full text-sm md:text-base lg:text-xl overflow-y-auto lg:border-2">
            {groupData?.records.map((report) => (
              <AttendenceSlice
                key={report._id}
                date={report.createdAt}
                attendance={report.attendance}
                students={groupData.students}
              />
            ))}
          </main>
        </div>
      </main>
    </>
  );
};

export default AttendancePage;
