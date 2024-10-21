"use client";

import React, { FormEvent, useEffect, useState } from "react";

import toast from "react-hot-toast";
import axios from "axios";

import { useStudentInfoContext } from "@/context/StudentProfileContext";
import { useGroupContext } from "@/context/GroupContext";

import AttendanceBtn from "../../../components/AttendanceBtn";

const NewReportPage = () => {
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [attendance, setAttendance] = useState<string[]>([]);

  const { studentInfo } = useStudentInfoContext();
  const { groupData } = useGroupContext();

  const createReporthandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const attendanceIs: string[] = [];

    groupData?.students.forEach((student, i) => {
      attendanceIs[i] = "";
      attendance.map((value) => {
        if (student.username === value) {
          attendanceIs[i] = value;
        }
      });
    });

    try {
      const { data } = await axios.post(
        `/api/group/report`,
        {
          username: studentInfo?.username,
          attendance: attendanceIs!,
          content,
          branch: studentInfo?.branch,
          semester: studentInfo?.semester,
          division: studentInfo?.division,
          groupNo: studentInfo?.groupNo,
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

  useEffect(() => {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    setDate(formattedDate);
  }, []);

  return (
    <div className="h-fit w-full md:w-[80%]">
      <h1 className="text-4xl font-semibold mt-2 mb-4 text-red-400 px-1">
        Create report
      </h1>
      <form
        onSubmit={createReporthandler}
        className="h-[420px] w-full p-2 md:px-6 md:py-4 mt-4 flex flex-col gap-4"
      >
        <p className="text-2xl font-medium">Date : {date} </p>
        <div className="h-fit w-full flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
          {groupData?.students.map((student) => (
            <AttendanceBtn
              key={`name-${student.username}`}
              name={student.username}
              setAttendance={setAttendance}
              size="h-5 w-5"
              textSize="text-xl"
              isCheck={false}
            />
          ))}
        </div>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="write a report here..."
          className="md:h-24 h-32 w-full border-2 rounded-md border-red-300 outline-blue-500 transition-all p-2 text-base md:text-xl font-medium resize-none"
        ></textarea>
        <div className="flex justify-end">
          <button
            type="submit"
            className="h-10 w-full md:w-96 px-2 py-1 bg-red-500 text-white rounded-lg active:scale-95 transition-all "
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewReportPage;
