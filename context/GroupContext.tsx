"use client";

import { Group } from "@/lib/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type GroupContext = {
  groupData: Group | null;
  setGroupData: Dispatch<SetStateAction<Group | null>>;
};

const GroupContext = createContext<GroupContext | null>(null);

export default function GroupContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [groupData, setGroupData] = useState<Group | null>(null);

  return (
    <GroupContext.Provider value={{ groupData, setGroupData }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroupContext() {
  const context = useContext(GroupContext);

  if (!context) {
    throw new Error(`useGroupContext must be within a GroupContextProvider`);
  }

  return context;
}
