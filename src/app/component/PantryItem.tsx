// src/components/PantryItem.tsx
"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
  return (
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
      </CardContent>
    </Card>
  );
};

export default PantryItem;
