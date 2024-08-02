// src/components/PantryItem.tsx
"use client";

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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import AiIcon from "../../../public/Ai.svg";

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
    const prompt = `${item.name} is a ${item.category} that expires on ${item.expirationDate}. It has ${item.quantity} left. give this user a recipe that uses this item and nutritional values.`;
    const response = await fetch("/api/", {
      method: "POST",
      body: JSON.stringify({ prompt: prompt }),
    });
    const data = await response.json();
    setAiResponse(data.message);
    setAiLoading(false);
  };

  return (
    <>
      <Card variant="outlined" sx={{ mb: 2, position: "relative" }}>
        <CardContent>
          <Typography variant="h6">{item.name}</Typography>
          <Typography variant="body2">Quantity: {item.quantity}</Typography>
          <Typography variant="body2">Category: {item.category}</Typography>
          <Typography variant="body2">
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
        <div className="flex flex-col items-center justify-between">
          <DialogTitle>AI Summary Of Item</DialogTitle>
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
            <CircularProgress />
          ) : (
            <DialogContent dividers>
              <p>{aiResponse}</p>
            </DialogContent>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default PantryItem;
