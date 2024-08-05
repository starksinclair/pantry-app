import React, { useRef, useState } from "react";
import { Alert, Box, IconButton, Snackbar } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { db, auth } from "../firebase";
import { ColorModeContext } from "../context/AppContext";
const CameraCapture: React.FC = () => {
  const { success, addItem, setSuccess } = React.useContext(ColorModeContext);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [success, setSuccess] = useState("");

  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const storage = getStorage();
    const storageRef = ref(storage, `images/${file?.name}`);
    const metadata = {
      contentType: "image/jpeg",
    };
    if (file) {
      uploadBytes(storageRef, file, metadata).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64String = e.target?.result as string;
        setImage(base64String);
        await handleUpload(base64String); // Call handleUpload after setting the image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (base64String: string) => {
    // Initialize GoogleGenerativeAI with your API_KEY.
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      throw new Error("API_KEY is not defined in environment variables");
    }
    const genAI = new GoogleGenerativeAI(API_KEY);

    // Converts base64 image to a GoogleGenerativeAI.Part object.
    function base64ToGenerativePart(base64String: string, mimeType: string) {
      return {
        inlineData: {
          data: base64String.split(",")[1],
          mimeType,
        },
      };
    }

    const imagePart = base64ToGenerativePart(base64String, "image/jpeg");
    console.log(imagePart);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: { responseMimeType: "application/json" },
    });
    const prompt = `Analyze the image and provide details about the food item shown. Return a JSON object with the following structure:
    {
      "name": "Name of the food item",
      "quantity": "Number of items in the image",
      "category": "Category of the food (e.g., fruit, vegetable, dairy, meat)",
      "expirationDate": "Estimated expiration date if visible, or 'Not visible' if not shown"
    }`;
    try {
      const response = await model.generateContent([prompt, imagePart]);
      const responseText = await response.response.text();
      const jsonResponse = JSON.parse(responseText);
      await addItem(jsonResponse);
    } catch (error) {
      console.error("Error in handleUpload:", error);
      setSuccess("");
    } finally {
      setImage(null);
    }
  };

  return (
    <Box>
      <input
        title="Capture Image"
        accept="image/*"
        type="file"
        onChange={handleCapture}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
      <IconButton
        color="primary"
        aria-label="capture image"
        onClick={() => fileInputRef.current?.click()}
      >
        <CameraAltIcon fontSize="large" />
      </IconButton>
      <Snackbar
        open={Boolean(success)}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setSuccess("")}
      >
        <Alert onClose={() => setSuccess("")} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CameraCapture;
