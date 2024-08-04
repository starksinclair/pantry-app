// src/components/BarcodeScanner.tsx
import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button, Typography } from "@mui/material";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const BarcodeScanner: React.FC = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const onSuccess = async (decodedText: string) => {
    setScannedData(decodedText);
    setIsScanning(false);
    console.log(decodedText);

    // Fetch item details using a barcode database API
    const response = await fetch(
      `YOUR_BARCODE_API_ENDPOINT?barcode=${decodedText}`
    );
    const itemDetails = await response.json();

    // Save the item details in Firebase
    const pantriesRef = collection(db, "pantries");
    const pantryDoc = doc(pantriesRef, auth.currentUser?.uid);
    const itemsRef = collection(pantryDoc, "items");
    const newItemRef = doc(itemsRef);

    await setDoc(newItemRef, {
      name: itemDetails.name,
      category: itemDetails.category,
      expirationDate: itemDetails.expirationDate,
      quantity: 1,
      createdAt: Date.now(),
    });
  };

  const onError = (error: string) => {
    console.error(error);
    setIsScanning(false);
  };

  useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(onSuccess, onError);

      // Cleanup function to stop the scanner when component unmounts or isScanning changes
      return () => {
        scanner.clear();
      };
    }
  }, [isScanning]);

  const startScanning = () => {
    setIsScanning(true);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Barcode Scanner
      </Typography>
      <Button
        variant="contained"
        startIcon={<CameraAltIcon />}
        onClick={startScanning}
      >
        Open Camera to Scan
      </Button>
      {isScanning && <div id="reader" style={{ width: "100%" }}></div>}
      {scannedData && (
        <Typography variant="body1">Scanned Data: {scannedData}</Typography>
      )}
    </div>
  );
};

export default BarcodeScanner;
