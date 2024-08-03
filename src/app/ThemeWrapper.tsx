"use client";

import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
    document.body.style.color = theme.palette.text.primary;
  }, [theme]);

  return <>{children}</>;
}
