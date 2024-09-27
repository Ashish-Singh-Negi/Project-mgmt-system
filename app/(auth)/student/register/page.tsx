"use client";

import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const StudentRegisterPage = () => {
  const [pid, setPid] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [division, setDivision] = useState("");
  const [groupNo, setGroupNo] = useState("");

  const { push } = useRouter();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`/api/student`, {
        pid,
        username,
        password,
        rollNo: parseInt(rollNo),
        branch,
        semester: parseInt(semester),
        division,
        groupNo: parseInt(groupNo),
      });

      toast.success(data.message);

      push(`login`);
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
    <form
      onSubmit={submitHandler}
      className="h-fit w-[98%] md:w-[720px] border-2 border-red-300 rounded-md flex flex-col items-center gap-8 font-medium p-6"
    >
      <h1 className="text-red-600 font-semibold text-4xl mb-2">
        Student registration
      </h1>
      <div className="flex flex-col sm:flex-row  sm:justify-center gap-6">
        <div className="flex flex-col gap-7">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="username"
            className="h-10 w-72 outline-none border-2 border-red-200 focus:border-blue-300 px-2 rounded-md transition-all"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="password"
            className="h-10 w-72 outline-none border-2 border-red-200 focus:border-blue-400 px-2 rounded-md transition-all"
          />
          <input
            value={pid}
            onChange={(e) => setPid(e.target.value)}
            type="number"
            placeholder="pid"
            className="h-10 w-72 outline-none border-2 border-red-200 focus:border-blue-400 px-2 rounded-md transition-all"
          />
          <input
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            type="number"
            placeholder="roll no."
            className="h-10 w-72 outline-none border-2 border-red-200 focus:border-blue-400 px-2 rounded-md transition-all"
          />
        </div>
        <div className="flex flex-col gap-7">
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="h-10 w-72 outline-none border-2 border-red-200 focus:border-blue-400 px-2 rounded-md transition-all"
          >
            <option value="Branch">Branch</option>
            <option value="COMPS">COMPS</option>
            <option value="IT">IT</option>
            <option value="AI & ML">AI & ML</option>
          </select>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="h-10 w-72 outline-none border-2 border-red-200 focus:border-blue-400 px-2 rounded-md transition-all"
          >
            <option value="Semester">Semester</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
          <select
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            className="h-10 w-72 outline-none border-2 border-red-200 focus:border-blue-400 px-2 rounded-md transition-all"
          >
            <option value="Division">Division</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          <input
            value={groupNo}
            onChange={(e) => setGroupNo(e.target.value)}
            type="number"
            placeholder="group no."
            className="h-10 w-72 outline-none border-2 border-red-200 focus:border-blue-400 px-2 rounded-md transition-all"
          />
        </div>
      </div>
      <button
        type="submit"
        className="h-10 w-72 bg-red-500 hover:bg-red-600 rounded-md active:scale-95 text-white transition-all my-2"
      >
        Register
      </button>
    </form>
  );
};

export default StudentRegisterPage;
