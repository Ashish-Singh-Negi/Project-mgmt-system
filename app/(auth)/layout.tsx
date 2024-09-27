import { Toaster } from "react-hot-toast";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Toaster />
      {children}
    </div>
  );
}
