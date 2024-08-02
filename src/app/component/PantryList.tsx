// src/components/PantryList.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import PantryItem from "./PantryItem";
import PantryForm from "./PantryForm";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { auth, db } from "../firebase";

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  expirationDate: string;
  createdAt: number;
}
export const categoryOptions = [
  "Fruits",
  "Vegetables",
  "Grains",
  "Dairy",
  "Meat",
  "Poultry",
  "Seafood",
  "Legumes",
  "Nuts and Seeds",
  "Herbs and Spices",
  "Baking Supplies",
  "Condiments",
  "Snacks",
  "Beverages",
  "Canned Goods",
  "Frozen Foods",
  "Oils and Vinegars",
  "Pasta and Noodles",
  "Sauces",
  "Sweets and Desserts",
  "Food",
  "Other",
];

const PantryList: React.FC = () => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [editItem, setEditItem] = useState<PantryItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [expirationFilter, setExpirationFilter] = useState<string>("");

  useEffect(() => {
    const fetchPantryData = async () => {
      try {
        const pantriesRef = collection(db, "pantries");
        const pantryDoc = doc(pantriesRef, auth.currentUser?.uid);
        const pantryDocSnap = await getDoc(pantryDoc);
        if (pantryDocSnap.exists()) {
          const docId = pantryDocSnap.data().userID;
          if (docId === auth.currentUser?.uid) {
            const itemsRef = collection(pantriesRef, docId, "items");
            const q = query(itemsRef);
            const listen = onSnapshot(q, (snapshot) => {
              const itemsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as PantryItem[];
              setItems(itemsData);
            });
            return () => listen();
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPantryData();
  }, []);

  const filteredItems = items
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) =>
      categoryFilter ? item.category === categoryFilter : true
    )
    .filter((item) =>
      expirationFilter
        ? new Date(item.expirationDate) <= new Date(expirationFilter)
        : true
    )
    .sort((a, b) => a.createdAt - b.createdAt);

  const handleCloseForm = () => {
    setEditItem(null);
  };

  const handleEdit = (item: PantryItem) => {
    setEditItem(item);
    console.log("Edit item:", item);
  };

  const handleDelete = async (id: string) => {
    try {
      const pantriesRef = collection(db, "pantries");
      const pantryDoc = doc(pantriesRef, auth.currentUser?.uid);
      const itemsRef = collection(pantryDoc, "items");
      const itemDocRef = doc(itemsRef, id);

      await deleteDoc(itemDocRef);
      console.log("Deleted item with id:", id);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Pantry Items
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        onChange={(e) => setSearch(e.target.value)}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
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
        label="Expiration Date"
        type="date"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
        onChange={(e) => setExpirationFilter(e.target.value)}
      />
      <Grid container spacing={2}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <PantryItem
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>
      {editItem && (
        <PantryForm
          open={Boolean(editItem)}
          handleClose={handleCloseForm}
          item={editItem}
        />
      )}
    </div>
  );
};

export default PantryList;
