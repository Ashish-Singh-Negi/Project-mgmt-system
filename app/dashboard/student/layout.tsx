import StudentDashboardNav from "./components/StudentDashboardNav";

export default function StudentDasboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full w-full">
      <div className="h-10 w-full flex justify-evenly items-center">
        <StudentDashboardNav />
      </div>
      <main className="h-[840px] w-full flex justify-center">{children}</main>
    </div>
  );
}
