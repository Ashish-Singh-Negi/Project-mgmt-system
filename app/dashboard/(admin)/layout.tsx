import { Suspense } from "react";

import AdminDashboardNav from "./components/AdminDashboardNav";

export default function AdminDasboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full w-full">
      <div className="h-10 w-full flex justify-evenly items-center">
        <AdminDashboardNav />
      </div>
      <Suspense>
        <main className="h-[840px] w-full flex justify-center">{children}</main>
      </Suspense>
    </div>
  );
}
