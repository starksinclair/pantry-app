// pages/index.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Button,
  Alert,
  Snackbar,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
} from "@mui/material";
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
import { Camera } from "react-camera-pro";
import Image from "next/image";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import CameraCapture from "./component/CameraCapture";

const HomePage: React.FC = () => {
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

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
          console.log("New user data saved to database");
        } else {
          console.log("User already exists in database");
        }
      } catch (error) {
        console.error("Error setting up data:", error);
      }
    };

    setupUser();
  }, [user]);

  useEffect(() => {
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

  const singleCharacter = auth.currentUser?.email
    ?.slice(0, 1)
    .toLocaleUpperCase();
  console.log(singleCharacter);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = async () => {
    setAnchorEl(null);
    await signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  return (
    <>
      <Analytics />
      {!isLoggedIn ? (
        <LoginPage />
      ) : (
        <Container className="flex flex-col h-[100vh]">
          <div className="flex items-center justify-between">
            <h1 className="p-4 font-extrabold text-3xl text-center">
              My Pantry Tracker
            </h1>
            {singleCharacter && (
              <>
                {" "}
                <Avatar
                  sx={{ bgcolor: blue }}
                  id="demo-positioned-button"
                  aria-controls={open ? "demo-positioned-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  {singleCharacter}
                </Avatar>
                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>

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
          <CameraCapture />
        </Container>
      )}
    </>
  );
};

export default HomePage;
