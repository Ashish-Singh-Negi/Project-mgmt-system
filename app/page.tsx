"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import image from "@/app/public/undraw_online_stats_0g94.svg";

import { useAdminInfoContext } from "@/context/AdminProfileContext";
import { useStudentInfoContext } from "@/context/StudentProfileContext";

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Loader from "./components/Loader";

export default function Home() {
  const { setAdminInfo } = useAdminInfoContext();
  const { setStudentInfo } = useStudentInfoContext();

  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const result = await axios.get(`/api/verify`);

      const { username, role } = result.data.data;

      const { data } = await axios.get(`/api/profile`, {
        params: {
          user: username,
          role: role,
        },
      });

      toast.success(data.message);

      if (data.profile.role)
        setAdminInfo({
          username: data.profile.username,
          role: data.profile.role,
          branch: data.profile.branch,
          guideOf: data.profile.guideOf,
        });
      else
        setStudentInfo({
          username: data.profile.username,
          branch: data.profile.branch,
          semester: data.profile.semester,
          division: data.profile.division,
          groupNo: data.profile.groupNo,
          rollNo: data.profile.rollNo,
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.message);
      } else {
        console.error(error);
        throw new Error("An Error occured");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) return <Loader size="h-32 w-32" />;

  return (
    <div className="h-full w-full flex justify-center bg-red-500 lg:bg-white items-center">
      <Toaster />
      <div className="h-60 w-96 border-2 lg:border-0 bg-white border-red-300 rounded-md flex flex-col items-center justify-center gap-6 font-medium">
        <h1 className="text-red-600 font-bold text-4xl mb-3">Promanage.</h1>
        <Link href={"/student/login"}>
          <button className="h-10 w-72 bg-red-400 text-white rounded-md active:scale-95 hover:bg-red-500 transition-all">
            {" "}
            Student
          </button>
        </Link>
        <Link href={"/admin/login"}>
          <button className="h-10 w-72 bg-red-400 text-white rounded-md active:scale-95 hover:bg-red-500 transition-all">
            {" "}
            Admin
          </button>
        </Link>
      </div>
      <img
        src={image.src}
        alt=""
        className="hidden lg:block border-l-2 pl-4 border-black"
      />
    </div>
  );
}
