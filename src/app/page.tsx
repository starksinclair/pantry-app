// pages/index.tsx
"use client";
import React, { useEffect, useState, useContext } from "react";
import { Container, Button, Alert, Snackbar, Typography } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import PantryList from "./component/PantryList";
import PantryForm from "./component/PantryForm";
import LoginPage from "./login";
import { onAuthStateChanged, auth, signOut, db } from "./firebase";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { Analytics } from "@vercel/analytics/react";
import { blue, deepPurple } from "@mui/material/colors";
import { Logout } from "@mui/icons-material";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import AIIcon from "../../public/aiico.png";
import CameraCapture from "./component/CameraCapture";
import { ColorModeContext } from "./context/AppContext";
import Image from "next/image";
import Recipe from "./component/Recipe";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import BarcodeScanner from "./component/BarcodeScanner";
import Header from "./component/Header";

const HomePage: React.FC = () => {
  const { setIsLoggedIn, setError, setUser, user, isLoggedIn, error } =
    useContext(ColorModeContext);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [user, setUser] = useState<any>(null);
  // const [error, setError] = useState<string | null>(null);
  const [openRecipe, setOpenRecipe] = useState<boolean>(false);

  const handleOpenForm = () => {
    setSelectedItem(null);
    setOpenForm(true);
  };
  // console.log(user);

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  useEffect(() => {
    const setupUser = async () => {
      if (!user || !user.uid) return;

      try {
        const usersRef = collection(db, "users");
        const userDoc = doc(usersRef, user.uid);
        const userDocSnap = await getDoc(userDoc);

        if (!userDocSnap.exists()) {
          await setDoc(userDoc, {
            uid: user.uid,
            name: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
          });
          // console.log("New user data saved to database");
        } else {
          console.log("User already exists in database");
        }
      } catch (error) {
        console.error("Error setting up data:", error);
      }
    };

    setupUser();
  }, [user]);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setIsLoggedIn(true);
  //       setUser(user);
  //     } else {
  //       setIsLoggedIn(false);
  //       setUser(null);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  const handleRecipeClose = () => {
    setOpenRecipe(false);
  };
  return (
    <>
      <Analytics />
      {!isLoggedIn ? (
        <LoginPage />
      ) : (
        <Container className="flex flex-col h-[100vh]">
          <Header />

          <div className="flex flex-row justify-between">
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenForm}
              className="mb-4"
            >
              Add New Item
            </Button>
            <CameraCapture />
          </div>
          <Button
            color="primary"
            className="fixed bottom-0 right-0 left-0 z-50 w-full p-1"
            variant="contained"
            onClick={() => setOpenRecipe(true)}
          >
            <Typography
              fontSize={30}
              fontStyle={"italic"}
              textAlign={"center"}
              textTransform={"capitalize"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Image src={AIIcon} alt="AI Icon" width={50} height={50} /> Get
              Cookin
            </Typography>
          </Button>

          {/* <BarcodeScanner /> */}
          <PantryList />
          <div className="mt-[5em]">
            <p>i</p>
          </div>
          <PantryForm
            open={openForm}
            handleClose={handleCloseForm}
            item={selectedItem}
          />
          <Recipe
            open={openRecipe}
            handleClose={handleRecipeClose}
            item={selectedItem}
          />
          {/* <Button onClick={handleSignOut}>Sign Out</Button> */}
          {error && (
            <Snackbar
              open={Boolean(error)}
              autoHideDuration={3000}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              onClose={() => setError(null)}
            >
              <Alert onClose={() => setError(null)} severity="error">
                {error}
              </Alert>
            </Snackbar>
          )}
        </Container>
      )}
    </>
  );
};

export default HomePage;
