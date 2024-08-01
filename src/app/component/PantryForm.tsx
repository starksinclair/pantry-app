// components/PantryForm.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface PantryFormProps {
  open: boolean;
  handleClose: () => void;
  item?: {
    id: string;
    name: string;
    quantity: number;
    category: string;
    expirationDate: string;
  };
}

const PantryForm: React.FC<PantryFormProps> = ({ open, handleClose, item }) => {
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<string>("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity.toString());
      setCategory(item.category);
      setExpirationDate(item.expirationDate);
    } else {
      setName("");
      setQuantity("");
      setCategory("");
      setExpirationDate("");
    }
  }, [item]);

  const handleSubmit = () => {
    const data = {
      id: item?.id || Math.random().toString(),
      name,
      quantity: parseInt(quantity),
      category,
      expirationDate,
    };

    // Handle adding or editing items here without Firebase, e.g., update the state or mock data
    console.log("Submitted data:", data);

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{item ? "Edit Item" : "Add Item"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Item Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Quantity"
          fullWidth
          variant="outlined"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Category"
          fullWidth
          variant="outlined"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Expiration Date"
          fullWidth
          variant="outlined"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {item ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PantryForm;
