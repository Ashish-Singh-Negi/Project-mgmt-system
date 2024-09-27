"use client";

import React, { FormEvent, useEffect, useState } from "react";

import CheckBtn from "./components/Checkbtn";
import toast from "react-hot-toast";
import axios from "axios";

import { useStudentInfoContext } from "@/context/StudentProfileContext";
import { useGroupContext } from "@/context/GroupContext";

const NewReportPage = () => {
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [attendance, setAttendance] = useState<string[]>([]);

  const { studentInfo } = useStudentInfoContext();
  const { groupData } = useGroupContext();

  const createReporthandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/group/report`,
        {
          username: studentInfo?.username,
          attendance,
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
    setDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="h-full w-full md:w-[80%]">
      <h1 className="text-4xl font-semibold mt-2 mb-4 text-red-400">
        Create report
      </h1>
      <form
        onSubmit={createReporthandler}
        className="h-[340px] w-full px-6 py-4 mt-4 flex flex-col gap-6"
      >
        <p className="text-2xl font-medium">Date : {date} </p>
        <div className="h-10 w-full flex items-center gap-4">
          <p className="text-2xl font-medium">Attendance :</p>
          {groupData?.students.map((student) => (
            <CheckBtn
              key={`naem-${student.username}`}
              name={student.username}
              setAttendance={setAttendance}
            />
          ))}
        </div>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="write a report here..."
          className="h-24 w-full border-2 rounded-md border-red-300 outline-blue-500 transition-all p-2 text-xl font-medium resize-none"
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
