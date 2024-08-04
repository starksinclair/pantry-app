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

// // Request permission to send notifications
// import { getToken, onMessage } from "firebase/messaging";
// import { messaging } from "./firebase"; // Import the initialized messaging instance

// const requestPermission = async () => {
//   const permission = await Notification.requestPermission();
//   if (permission === "granted") {
//     const token = await getToken(messaging);
//     console.log("FCM Token:", token);
//     // Save the token to your database for future messaging
//   } else {
//     console.log("Unable to get permission to notify.");
//   }
// };

// requestPermission();
// Firebase Cloud Function
// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp();

// exports.checkExpiringItems = functions.pubsub.schedule("every 24 hours").onRun(async (context) => {
//   const now = new Date();
//   const itemsSnapshot = await admin.firestore().collection("pantries").get();
//   itemsSnapshot.forEach((doc) => {
//     const items = doc.data().items;
//     items.forEach((item) => {
//       const expirationDate = new Date(item.expirationDate);
//       const diffDays = (expirationDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
//       if (diffDays <= 7) { // Notify if the item will expire within a week
//         const payload = {
//           notification: {
//             title: "Expiring Item Alert",
//             body: `The item ${item.name} is expiring soon!`,
//           },
//         };
//         admin.messaging().sendToDevice(doc.data().fcmToken, payload);
//       }
//     });
//   });
// });
