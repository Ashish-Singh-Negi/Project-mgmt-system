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

type GuideOf = {
  branch: string;
  semester: number;
  division: string;
  groupNo: number[];
};

type AdminInfo = {
  username: string;
  role: "HOD" | "Coordinator" | "Guide";
  branch: string;
  guideOf: GuideOf[];
};

type AdminInfoContext = {
  adminInfo: AdminInfo | null;
  setAdminInfo: Dispatch<SetStateAction<AdminInfo | null>>;
};

const AdminInfoContext = createContext<AdminInfoContext | null>(null);

export default function AdminInfoContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);

  const { push } = useRouter();

  useEffect(() => {
    if (adminInfo) push(`/dashboard/${adminInfo.role.toLowerCase()}`);
  }, [adminInfo]);

  return (
    <AdminInfoContext.Provider
      value={{
        adminInfo,
        setAdminInfo,
      }}
    >
      {children}
    </AdminInfoContext.Provider>
  );
}

export function useAdminInfoContext() {
  const context = useContext(AdminInfoContext);

  if (!context) {
    throw new Error(
      `useAdminInfoContext must be within a AdminContextProvider`
    );
  }

  return context;
}
