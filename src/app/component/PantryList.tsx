// src/components/PantryList.tsx
"use client";

import React, { useState } from "react";
import { Grid, TextField, Typography } from "@mui/material";
import PantryItem from "./PantryItem";

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  expirationDate: string;
}

const mockData: PantryItem[] = [
  {
    id: "1",
    name: "Flour",
    quantity: 2,
    category: "Baking",
    expirationDate: "2024-08-01",
  },
  {
    id: "2",
    name: "Sugar",
    quantity: 1,
    category: "Baking",
    expirationDate: "2024-09-01",
  },
  // Add more mock items as needed
];

const PantryList: React.FC = () => {
  const [items, setItems] = useState<PantryItem[]>(mockData);
  const [search, setSearch] = useState<string>("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (item: PantryItem) => {
    // Implement your edit logic here
    console.log("Edit item:", item);
  };

  const handleDelete = (id: string) => {
    // Implement your delete logic here
    setItems(items.filter((item) => item.id !== id));
    console.log("Deleted item with id:", id);
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
    </div>
  );
};

export default PantryList;
