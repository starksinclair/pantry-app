"use client";

import { AppProvider } from "./context/AppContext";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppProvider>{children}</AppProvider>;
}
