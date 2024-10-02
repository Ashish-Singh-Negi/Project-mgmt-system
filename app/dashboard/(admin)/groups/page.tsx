"use client";

import React, { FormEvent, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { useGroupsContext } from "@/context/GroupsContext";

import InputFeild from "@/app/components/InputFeild";
import GroupCard from "./components/GroupCard";
import AdminDashboardNav from "../components/AdminDashboardNav";
import { useAdminInfoContext } from "@/context/AdminProfileContext";
import { useCurrentRoleContext } from "@/context/AdminCurrentRole";

const GroupsInfoPage = () => {
  const { groups } = useGroupsContext();

  const { adminInfo } = useAdminInfoContext();
  const { currentRole } = useCurrentRoleContext();

  const [create, setCreate] = useState(false);

  const [semester, setSemester] = useState("");
  const [division, setDivision] = useState("");

  const [groupNos, setGroupNos] = useState<number[]>([]);
  const [groupNoCount, setGroupNoCount] = useState<number[]>([1]);

  const createNewGrouphandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!semester) {
      toast.error("Select Semester");
      return;
    }
    if (!division) {
      toast.error("Select Division");
      return;
    }

    try {
      const { data } = await axios.post(`/api/group`, {
        username: adminInfo?.username,
        branch: adminInfo?.branch,
        role: adminInfo?.role,
        semester: parseInt(semester),
        division,
        groupNos,
      });

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
    <>
      <AdminDashboardNav />
      <main className="h-[880px] w-full flex justify-center">
        <div className="h-full w-full md:w-[80%]">
          <header className="w-full flex justify-between items-center px-1">
            {" "}
            <h1 className="text-3xl md:text-4xl font-semibold flex items-center justify-between mt-2 mb-4 text-red-500">
              Groups Info
            </h1>
            <button
              onClick={() => {
                setCreate(!create);
                setGroupNoCount([1]);
              }}
              className="px-4 py-[6px] text-sm md:text-base bg-red-500 rounded-lg font-medium text-white transition-all active:scale-95"
            >
              {create ? "Cancel" : "Create group"}
            </button>
          </header>
          <main className="h-[800px] w-full font-medium overflow-y-auto overflow-x-hidden">
            {create && (
              <form
                onSubmit={createNewGrouphandler}
                className="h-fit border-l-2 border-red-400 w-full flex flex-col gap-4 p-4"
              >
                <div className="h-fit w-full flex flex-col md:flex-row gap-4">
                  <div className="h-10 w-full md:w-[260px] flex gap-4 items-center">
                    <label htmlFor="semester" className="w-24">
                      Semester
                    </label>
                    <select
                      onChange={(e) => setSemester(e.target.value)}
                      id="semester"
                      className="h-8 w-full md:w-40 outline-none border-2 border-red-200 focus:border-blue-400 px-2 rounded-md transition-all"
                    >
                      <option value="semester">Semester</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>
                  </div>
                  <div className="h-10 w-full md:w-[260px] flex gap-4 items-center">
                    <label htmlFor="Division" className="w-24">
                      Division
                    </label>
                    <select
                      onChange={(e) => setDivision(e.target.value)}
                      id="Division"
                      className="h-8 w-full md:w-40 outline-none border-2 border-red-200 focus:border-blue-400 px-2 rounded-md transition-all"
                    >
                      <option value="division">Division</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  {groupNoCount?.map((num, i) => (
                    <InputFeild
                      key={`group-${i}`}
                      width={"w-full md:w-40"}
                      inputType={"number"}
                      inputPlaceholder={"group no."}
                      setState={setGroupNos}
                    />
                  ))}
                  <button
                    onClick={() =>
                      setGroupNoCount((prev) => [...prev, groupNos.length])
                    }
                    type="button"
                    className="h-10 w-full md:w-48 bg-blue-400 hover:bg-blue-500 rounded-md active:scale-95 text-white transition-all"
                  >
                    add group number
                  </button>
                  <button
                    type="submit"
                    className="h-10 w-full md:w-40 bg-red-500 hover:bg-red-600 rounded-md active:scale-95 text-white transition-all mb-2"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}
            {groups?.map((group) => {
              if (currentRole === "HOD" || currentRole === "Coordinator") {
                return (
                  <GroupCard
                    key={group._id}
                    id={group._id}
                    groupno={group.groupNo}
                    guide={group.guide}
                    branch={group.branch}
                    semester={group.semester}
                    division={group.division}
                    projectTitle={group.projectTitle}
                    students={group.students}
                    totalReports={group.records.length}
                  />
                );
              }
              if (
                currentRole === "Guide" &&
                group.guide === adminInfo?.username
              ) {
                return (
                  <GroupCard
                    key={group._id}
                    id={group._id}
                    groupno={group.groupNo}
                    guide={group.guide}
                    branch={group.branch}
                    semester={group.semester}
                    division={group.division}
                    projectTitle={group.projectTitle}
                    students={group.students}
                    totalReports={group.records.length}
                  />
                );
              }
            })}
          </main>
        </div>
      </main>
    </>
  );
};

export default GroupsInfoPage;
