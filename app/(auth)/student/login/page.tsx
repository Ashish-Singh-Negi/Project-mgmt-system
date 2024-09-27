"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";

const StudentLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { push } = useRouter();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `/api/login/student`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);

      push(`/dashboard/student/reports`);
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
      className="h-80 w-96 border-2 border-red-300 rounded-md flex flex-col items-center gap-6 font-medium"
    >
      <h1 className="text-red-600 font-semibold text-4xl mt-5">
        Student login
      </h1>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        placeholder="username"
        className="h-10 w-72 outline-none border-2 border-red-200 focus:border-red-400 px-2 rounded-md transition-all"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="password"
        className="h-10 w-72 outline-none border-2 border-red-200 focus:border-red-400 px-2 rounded-md transition-all"
      />
      <button className="h-10 w-72 bg-red-500 rounded-md active:scale-95 text-white transition-all mt-2">
        login
      </button>
      <p className="-mt-2 font-medium">
        new student?
        <Link href={"register"} className="text-blue-600">
          create account
        </Link>
      </p>
    </form>
  );
};

export default StudentLoginPage;
