// src/components/PantryItem.tsx
"use client";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import AiIcon from "../../../public/Ai.svg";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PantryItemProps {
  item: {
    id: string;
    name: string;
    quantity: number;
    category: string;
    expirationDate: string;
    createdAt: number;
  };
  onEdit: (item: PantryItemProps["item"]) => void;
  onDelete: (id: string) => void;
}

const PantryItem: React.FC<PantryItemProps> = ({ item, onEdit, onDelete }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const handleClose = () => {
    setOpenModal(false);
  };
  const handleAi = async () => {
    setOpenModal(true);
    setAiLoading(true);
    const prompt = `Provide a summary of the typical nutritional value per serving of a ${item.category}, including protein, fat, and carbohydrates. 

Is there anything specific to consider about the nutritional value of ${item.name} (a ${item.category}) given the quantity I have left (which is ${item.quantity})? 

**Additionally, considering the expiration date of ${item.expirationDate} (if available), are there any changes in nutritional content or storage recommendations I should be aware of?**
`;
    const response = await fetch("/api/", {
      method: "POST",
      body: JSON.stringify({ prompt: prompt }),
    });
    const data = await response.json();
    setAiResponse(data.message);
    setAiLoading(false);
  };
  const isExpired = new Date(item.expirationDate) <= new Date();

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const cardStyle = {
    mb: 2,
    position: "relative",
    backgroundColor: isExpired
      ? isDarkMode
        ? "#ff99a3" // Dark Red for Dark Mode
        : "#FFCDD2" // Light Red for Light Mode
      : "inherit",
  };

  const expirationStyle = {
    color: isExpired
      ? isDarkMode
        ? "#801a00" // Light Red for Dark Mode
        : "#D32F2F" // Red for Light Mode
      : "inherit",
    fontWeight: isExpired ? "bold" : "normal",
  };
  return (
    <>
      <Card variant="outlined" sx={cardStyle}>
        <CardContent>
          <Typography variant="h6">{item.name}</Typography>
          <Typography variant="body2">Quantity: {item.quantity}</Typography>
          <Typography variant="body2">Category: {item.category}</Typography>
          <Typography variant="body2" style={expirationStyle}>
            Expiration Date: {item.expirationDate}
          </Typography>
          <div style={{ position: "absolute", top: 8, right: 8 }}>
            <Tooltip title="Edit">
              <IconButton onClick={() => onEdit(item)} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={() => onDelete(item.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div style={{ position: "absolute", bottom: 0, right: 8 }}>
            <Tooltip title="Ai">
              <IconButton onClick={handleAi}>
                <Image src={AiIcon} alt="AI" width={30} height={30} />
              </IconButton>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
      <Dialog open={openModal} onClose={handleClose}>
        <div className="flex flex-col items-center justify-between modal-container">
          <DialogTitle>AI-Powered Food Item Analysis</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {aiLoading ? (
            <Skeleton
              variant="text"
              width={410}
              height={218}
              sx={{ bgcolor: "grey.500" }}
            />
          ) : (
            <DialogContent dividers>
              <Markdown remarkPlugins={[remarkGfm]}>{aiResponse}</Markdown>
            </DialogContent>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default PantryItem;
