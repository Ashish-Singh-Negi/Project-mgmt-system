import type { Metadata } from "next";

import localFont from "next/font/local";

import "./globals.css";

import AdminInfoContextProvider from "@/context/AdminProfileContext";
import StudentInfoContextProvider from "@/context/StudentProfileContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Promanage",
  description: "project manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`h-dvh w-full ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AdminInfoContextProvider>
          <StudentInfoContextProvider>{children}</StudentInfoContextProvider>
        </AdminInfoContextProvider>
      </body>
    </html>
  );
}
