"use client";

import { Group } from "@/lib/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type GroupContext = {
  groups: Group[] | null;
  setGroups: Dispatch<SetStateAction<Group[] | null>>;
};

const GroupsContext = createContext<GroupContext | null>(null);

export default function GroupsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [groups, setGroups] = useState<Group[] | null>(null);

  return (
    <GroupsContext.Provider
      value={{
        groups,
        setGroups,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
}

export function useGroupsContext() {
  const context = useContext(GroupsContext);

  if (!context) {
    throw new Error("useGroupsContext must be within a GroupsContextProvider");
  }

  return context;
}
