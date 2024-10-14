"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import axios from "axios";
import toast from "react-hot-toast";
import Loader from "@/app/components/Loader";

const GuideLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const { push } = useRouter();

  const submithandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data } = await axios.post(
        `/api/login/admin`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);

      push(`/dashboard/${data.role.toLowerCase()}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        toast.error(error.response?.data.message);
      } else {
        throw new Error("An error occured");
      }
      setLoading(false);
    }
  };

  if (loading) return <Loader size="h-32 w-32" />;

  return (
    <form
      onSubmit={submithandler}
      className="h-80 w-96 border-2 border-red-300 rounded-md flex flex-col items-center gap-6 font-medium"
    >
      <h1 className="text-red-600 font-semibold text-4xl mt-5">Admin login</h1>
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
        Login
      </button>
      <p className="-mt-2 font-medium">
        new admin?
        <Link href={"register"} className="text-blue-600">
          create account
        </Link>
      </p>
    </form>
  );
};

export default GuideLoginPage;
