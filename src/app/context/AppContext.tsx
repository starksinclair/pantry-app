"use client";

import * as React from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PaletteMode } from "@mui/material";
import { amber, grey, deepOrange } from "@mui/material/colors";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { auth, db, onAuthStateChanged } from "../firebase";

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  expirationDate: string;
  createdAt: number;
}

interface PantryContextType {
  items: PantryItem[];
}

// const PantryContext = React.createContext<PantryContextType | undefined>(undefined);
interface user {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
  mode: "light" as PaletteMode,
  items: [] as PantryItem[],
  isLoggedIn: false,
  user: null as user | null,
  error: null as string | null,
  setError: (error: string | null) => {},
  setIsLoggedIn: (isLoggedIn: boolean) => {},
  setUser: (user: user | null) => {},
});

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          //   primary: amber,
          //   divider: amber[200],
          text: {
            primary: grey[900],
            secondary: grey[800],
          },
        }
      : {
          // palette values for dark mode
          primary: deepOrange,
          divider: deepOrange[700],
          background: {
            default: "#333",
            paper: "#333",
          },
          text: {
            primary: "#fff",
            secondary: grey[500],
          },
        }),
  },
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = React.useState<PaletteMode>(
    prefersDarkMode ? "dark" : "light"
  );

  React.useEffect(() => {
    setMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
      mode,
    }),
    [mode]
  );

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const [items, setItems] = React.useState<PantryItem[]>([]);

  React.useEffect(() => {
    const fetchPantryData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log("No authenticated user");
          return;
        }

        const pantriesRef = collection(db, "pantries");
        const pantryDoc = doc(pantriesRef, user.uid);
        // console.log("Current user ID:", user.uid);

        const pantryDocSnap = await getDoc(pantryDoc);
        if (pantryDocSnap.exists()) {
          //   console.log("Pantry document exists");
          const docId = pantryDocSnap.data().userID;
          //   console.log("Document ID:", docId);
          if (docId === user.uid) {
            const itemsRef = collection(pantriesRef, docId, "items");
            const q = query(itemsRef);
            const listen = onSnapshot(q, (snapshot) => {
              const itemsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as PantryItem[];
              //   console.log("Fetched items:", itemsData);
              setItems(itemsData);
            });
            return () => listen();
          }
        } else {
          console.log("Pantry document does not exist");
        }
      } catch (error) {
        console.error("Error fetching pantry data:", error);
      }
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchPantryData();
      } else {
        setItems([]);
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  return (
    <ColorModeContext.Provider
      value={{
        ...colorMode,
        items,
        isLoggedIn,
        user,
        error,
        setError,
        setIsLoggedIn,
        setUser,
      }}
    >
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
