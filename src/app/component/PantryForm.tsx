// components/PantryForm.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { categoryOptions } from "./PantryList";
interface PantryFormProps {
  open: boolean;
  handleClose: () => void;
  item?: {
    id: string;
    name: string;
    quantity: number;
    category: string;
    expirationDate: string;
    createdAt: number;
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

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      console.error("No authenticated user");
      return;
    }
    const pantriesRef = collection(db, "pantries");
    const pantryDoc = doc(pantriesRef, auth.currentUser.uid);
    const itemsRef = collection(pantryDoc, "items");
    const data = {
      name,
      quantity: parseInt(quantity),
      category,
      expirationDate,
      updatedAt: serverTimestamp(),
    };
    if (!item) {
      const pantryDocSnap = await getDoc(pantryDoc);

      if (!pantryDocSnap.exists()) {
        await setDoc(pantryDoc, { userID: auth.currentUser.uid });
      }
      await addDoc(itemsRef, { ...data, createdAt: serverTimestamp() });
    } else {
      // Handle item update logic here
      await updateDoc(doc(itemsRef, item.id), data);
      console.log("item", item.id);
    }
    setName("");
    setQuantity("");
    setCategory("");
    setExpirationDate("");

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
        {/* <TextField
          margin="dense"
          label="Category"
          placeholder="eg: poultry, baking"
          fullWidth
          variant="outlined"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        /> */}
        <FormControl fullWidth sx={{}}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            margin="dense"
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {categoryOptions.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Expiration Date"
          fullWidth
          type="date"
          focused
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
