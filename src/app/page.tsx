// pages/index.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Container, Button, Alert, Snackbar } from "@mui/material";
import PantryList from "./component/PantryList";
import PantryForm from "./component/PantryForm";
import LoginPage from "./login";
import { onAuthStateChanged, auth, signOut, db } from "./firebase";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

const HomePage: React.FC = () => {
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOpenForm = () => {
    setSelectedItem(null);
    setOpenForm(true);
  };
  // console.log(user);

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleSignOut = async () => {
    await signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  useEffect(() => {
    const setupUser = async () => {
      if (!user || !user.uid) return;
      console.log("Setting up user data", user);
      try {
        const usersRef = collection(db, "users");
        const userDoc = doc(usersRef, auth.currentUser?.uid);
        const userDocSnap = await getDoc(userDoc);

        if (userDocSnap.exists()) {
          await setDoc(userDoc, {
            uid: auth.currentUser?.uid,
            name: auth.currentUser?.displayName,
            photoURL: auth.currentUser?.photoURL,
            email: auth.currentUser?.email,
          });
        }
        console.log("Data setup complete");
      } catch (error) {
        console.error("Error setting up data:", error);
      }
    };
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    setupUser();
    return () => unsubscribe();
  }, [user]);
  return (
    <>
      {!isLoggedIn ? (
        <LoginPage />
      ) : (
        <Container className="flex flex-col h-[100vh]">
          <h1 className="p-4 font-extrabold text-4xl text-center">
            My Pantry Tracker
          </h1>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenForm}
            className="mb-4"
          >
            Add New Item
          </Button>
          <PantryList />
          <PantryForm
            open={openForm}
            handleClose={handleCloseForm}
            item={selectedItem}
          />
          <Button onClick={handleSignOut}>Sign Out</Button>
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
