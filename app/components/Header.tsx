"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import Link from "next/link";

import { useAdminInfoContext } from "@/context/AdminProfileContext";
import { useGroupContext } from "@/context/GroupContext";
import { useGroupsContext } from "@/context/GroupsContext";
import { useStudentInfoContext } from "@/context/StudentProfileContext";

import toast from "react-hot-toast";
import { useCurrentRoleContext } from "@/context/AdminCurrentRole";

const Header = () => {
  const { push } = useRouter();

  const { setAdminInfo } = useAdminInfoContext();
  const { setStudentInfo } = useStudentInfoContext();
  const { setCurrentRole } = useCurrentRoleContext();

  const { setGroupData } = useGroupContext();
  const { setGroups } = useGroupsContext();

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

      if (data.profile.role) {
        setAdminInfo({
          username: data.profile.username,
          role: data.profile.role,
          branch: data.profile.branch,
          guideOf: data.profile.guideOf,
        });
        setCurrentRole(data.profile.role);
      } else
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
        toast.error(error.response?.data.message || "An error occurred");
      } else {
        console.error(error);
        throw new Error("An Error occured");
      }
    }
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.post(`/api/logout`);

      toast.success(data.message);

      setStudentInfo(null);
      setAdminInfo(null);

      setGroupData(null);
      setGroups(null);

      push(`/`);
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
    getProfile();
  }, []);

  return (
    <header className="fixed z-10 h-14 w-full bg-white px-1 md:px-4 flex justify-between items-center border-b-2">
      <h1 className="text-3xl font-bold text-red-600">Promanage.</h1>
      <Link href={"/"}>
        <button
          onClick={logoutHandler}
          className="h-8 w-fit bg-red-500 rounded-2xl active:scale-95 text-white transition-all py-1 px-4 font-medium"
        >
          Logout
        </button>
      </Link>
    </header>
  );
};

export default Header;
