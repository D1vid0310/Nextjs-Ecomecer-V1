"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { useUser } from "@/hooks/use-user";
import { redirect, usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useUser();
  const pathName = usePathname();

  const authRutas = ["/", "contra", "registro"];
  const isInAuthRutas = authRutas.includes(pathName);

  if (user && isInAuthRutas) return redirect("/dasboard");

  return (
    <html lang="en">
      <body className={inter.className}>
        {children} <Toaster />
      </body>
    </html>
  );
}