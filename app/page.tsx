"use client";

import { useEffect } from "react";
import Link from "next/link";

import { useAdminInfoContext } from "@/context/AdminProfileContext";
import { useStudentInfoContext } from "@/context/StudentProfileContext";

import axios from "axios";
import toast from "react-hot-toast";

export default function Home() {
  const { setAdminInfo } = useAdminInfoContext();
  const { setStudentInfo } = useStudentInfoContext();

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
        toast.error(error.response?.data.message || "Unauthorized", {
          duration: 300,
        });
      } else {
        console.error(error);
        throw new Error("An Error occured");
      }
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="h-60 w-96 border-2 border-red-300 rounded-md flex flex-col items-center gap-6 font-medium">
        <h1 className="text-red-600 font-bold text-4xl mt-5 mb-3">Promanage</h1>
        <Link href={"/student/login"}>
          <button className="h-10 w-72 bg-red-400 text-white rounded-md active:scale-95 hover:bg-red-500 transition-all">
            {" "}
            Student login
          </button>
        </Link>
        <Link href={"/admin/login"}>
          <button className="h-10 w-72 bg-red-400 text-white rounded-md active:scale-95 hover:bg-red-500 transition-all">
            {" "}
            Admin login
          </button>
        </Link>
      </div>
    </div>
  );
}
