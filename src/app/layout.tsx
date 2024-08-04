// "use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeWrapper } from "./ThemeWrapper";
import ClientProvider from "./ClientProvider";
import FavIcon from "./favicon.ico";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PantryVision",
  description:
    "PantryVision: Your AI-powered kitchen assistant. Effortlessly manage your food inventory, track expiration dates, and reduce waste. Simply snap a photo of your groceries, and let our advanced image recognition technology do the rest. Stay organized, save money, and make smarter meal decisions with PantryVision - your personal food management revolution.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
