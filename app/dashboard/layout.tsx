import StudentInfoContextProvider from "@/context/StudentProfileContext";
import AdminInfoContextProvider from "@/context/AdminProfileContext";
import GroupContextProvider from "@/context/GroupContext";
import GroupsContextProvider from "@/context/GroupsContext";

import Header from "../components/Header";

import { Toaster } from "react-hot-toast";

export default function DasboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full w-full">
      <AdminInfoContextProvider>
        <StudentInfoContextProvider>
          <GroupsContextProvider>
            <GroupContextProvider>
              <Toaster />
              <Header />
              <section className="h-full w-full pt-14">{children}</section>
            </GroupContextProvider>
          </GroupsContextProvider>
        </StudentInfoContextProvider>
      </AdminInfoContextProvider>
    </div>
  );
}
