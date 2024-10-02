import CurrentRoleContextProvider from "@/context/AdminCurrentRole";

import Header from "../components/Header";

import { Toaster } from "react-hot-toast";

import GroupsContextProvider from "@/context/GroupsContext";
import GroupContextProvider from "@/context/GroupContext";

export default function DasboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full w-full">
      <GroupsContextProvider>
        <GroupContextProvider>
          <CurrentRoleContextProvider>
            <Toaster />
            <Header />
            <section className="h-full w-full pt-14">{children}</section>
          </CurrentRoleContextProvider>
        </GroupContextProvider>
      </GroupsContextProvider>
    </div>
  );
}
