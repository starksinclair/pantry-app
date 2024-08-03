// "use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeWrapper } from "./ThemeWrapper";
import ClientProvider from "./ClientProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pantry Log",
  description: "Pantry Log",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {<Analytics />}
      <body className={inter.className}>
        <ClientProvider>
          <ThemeWrapper>{children}</ThemeWrapper>
        </ClientProvider>
      </body>
    </html>
  );
}
