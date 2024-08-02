// src/components/CameraCapture.tsx
import React, { useRef, useState } from "react";
import { Button } from "@mui/material";
import Image from "next/image";

const CameraCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageData = canvasRef.current.toDataURL("image/png");
        setCapturedImage(imageData);
        // Stop the camera stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };
  console.log(capturedImage);

  return (
    <div>
      <Button variant="contained" onClick={startCamera}>
        Start Camera
      </Button>
      <div>
        <video
          ref={videoRef}
          style={{ width: "100%", display: capturedImage ? "none" : "block" }}
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{ display: "none" }}
        />
        {capturedImage && (
          <Image src={capturedImage} alt="Captured" width={640} height={480} />
        )}
      </div>
      <Button variant="contained" onClick={captureImage}>
        Capture Image
      </Button>
    </div>
  );
};

export default CameraCapture;
