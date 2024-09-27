"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type StudentInfo = {
  username: string;
  branch: string;
  division: string;
  semester: number;
  groupNo: number;
  rollNo: number;
};

type StudentInfoContext = {
  studentInfo: StudentInfo | null;
  setStudentInfo: Dispatch<SetStateAction<StudentInfo | null>>;
};

const StudentInfoContext = createContext<StudentInfoContext | null>(null);

export default function StudentInfoContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

  const { push } = useRouter();

  useEffect(() => {
    if (studentInfo) push(`/dashboard/student/reports`);
  }, [studentInfo]);

  return (
    <StudentInfoContext.Provider
      value={{
        studentInfo,
        setStudentInfo,
      }}
    >
      {children}
    </StudentInfoContext.Provider>
  );
}

export function useStudentInfoContext() {
  const context = useContext(StudentInfoContext);

  if (!context) {
    throw new Error(
      `useStudentInfoContext must be within a StudentContextProvider`
    );
  }

  return context;
}
