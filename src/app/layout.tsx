import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { getCurrentUser } from "@/lib/supabase/server";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAWA",
  description: "SAWA web application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider initialUser={user}>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
