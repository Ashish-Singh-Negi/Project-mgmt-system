"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type CurrentRole = "HOD" | "Coordinator" | "Guide";

type CurrentRoleContext = {
  currentRole: CurrentRole | null;
  setCurrentRole: Dispatch<SetStateAction<CurrentRole | null>>;
};

const CurrentRoleContext = createContext<CurrentRoleContext | null>(null);

export default function CurrentRoleContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentRole, setCurrentRole] = useState<CurrentRole | null>(null);

  return (
    <CurrentRoleContext.Provider value={{ currentRole, setCurrentRole }}>
      {children}
    </CurrentRoleContext.Provider>
  );
}

export function useCurrentRoleContext() {
  const context = useContext(CurrentRoleContext);

  if (!context) {
    throw new Error(
      `useCurrentRoleContext must be within a CurrentRoleContext`
    );
  }

  return context;
}
