"use client";
import React, { useState, useContext } from "react";
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import CloseIcon from "@mui/icons-material/Close";
import { Logout } from "@mui/icons-material";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "../context/AppContext";
import { blue } from "@mui/material/colors";
import { auth, signOut } from "../firebase";

const Header: React.FC = () => {
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { isLoggedIn, user, setIsLoggedIn, setError } =
    useContext(ColorModeContext);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleColorMode = () => {
    setAnchorEl(null);
    colorMode.toggleColorMode();
  };

  const singleCharacter = user?.email?.slice(0, 1).toLocaleUpperCase();

  return (
    <div className="flex items-center justify-between">
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer(true)}
        edge="start"
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={openDrawer} onClose={toggleDrawer(false)} anchor="left">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            <ListItem>
              <ListItemIcon>
                <IconButton
                  onClick={toggleDrawer(false)}
                  color="error"
                  className="absolute top-0 right-0"
                >
                  <CloseIcon />
                </IconButton>
              </ListItemIcon>
            </ListItem>
            {["Home", "Recipes"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  LinkComponent={Link}
                  href={text === "Home" ? "/" : "/recipe"}
                >
                  <ListItemIcon>
                    {index % 2 === 0 ? <HomeIcon /> : <FoodBankIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <h1 className="p-4 font-extrabold text-2xl text-center">
        My Pantry Tracker
      </h1>
      {singleCharacter && (
        <>
          <Avatar
            sx={{ bgcolor: blue[500] }}
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
            <MenuItem>
              <IconButton onClick={handleColorMode} color="inherit">
                {theme.palette.mode === "dark" ? (
                  <>
                    <ListItemIcon>
                      <Brightness7Icon fontSize="small" />
                    </ListItemIcon>
                    <Typography>Light Mode</Typography>
                  </>
                ) : (
                  <>
                    <ListItemIcon>
                      <Brightness4Icon fontSize="small" />
                    </ListItemIcon>
                    <Typography>Dark Mode</Typography>
                  </>
                )}
              </IconButton>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <Typography>Logout</Typography>
            </MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
};

export default Header;
