import React, { useState } from "react";
// import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Skeleton,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../context/AppContext";
import Markdown from "react-markdown";
import FavoriteIcon from "@mui/icons-material/Favorite";
import remarkGfm from "remark-gfm";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";

interface RecipeProps {
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

const Recipe: React.FC<RecipeProps> = ({ open, handleClose }) => {
  const { items } = useContext(ColorModeContext);
  const [selectedIngredients, setSelectedIngredients] = useState<
    { id: string; name: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [recipeId, setRecipeId] = useState<string | null>(null);

  const handleIngredientToggle = (item: { id: string; name: string }) => {
    setSelectedIngredients((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };
  const foodNames = selectedIngredients.map((item) => item.name).join(", ");
  //   console.log(foodNames);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const generateRecipe = async () => {
    setLoading(true);
    const prompt =
      "generate a recipe with the following ingredients: " +
      foodNames +
      ". " +
      input +
      "Make it healthy";
    try {
      const response = await fetch("/api/", {
        method: "POST",
        body: JSON.stringify({ prompt: prompt }),
      });

      const data = await response.json();
      console.log(data);
      setRecipe(data.message);
      setLoading(false);
    } catch (error) {
      console.error("Error generating recipe:", error);
    }
  };
  const newRecipe = {
    instructions: recipe,
    ingredients: foodNames,
    createdAt: Date.now(),
  };

  const favoriteRecipe = async () => {
    if (!auth.currentUser) {
      console.error("No authenticated user");
      return;
    }
    const pantriesRef = collection(db, "pantries");
    const pantryDoc = doc(pantriesRef, auth.currentUser?.uid);
    const recipeRef = collection(pantryDoc, "recipes");
    const docRef = await addDoc(recipeRef, newRecipe);
    setRecipeId(docRef.id);
    setSaved(true);
  };

  const unfavoriteRecipe = async () => {
    if (!recipeId || !auth.currentUser) {
      console.error("No recipe ID or authenticated user");
      return;
    }
    const pantriesRef = collection(db, "pantries");
    const pantryDoc = doc(pantriesRef, auth.currentUser.uid);
    const recipeRef = collection(pantryDoc, "recipes");
    const recipeDoc = doc(recipeRef, recipeId);
    await deleteDoc(recipeDoc);
    setRecipeId(null);
    setSaved(false);
  };

  const handleSaveRecipe = async () => {
    if (!saved) {
      await favoriteRecipe();
    } else {
      await unfavoriteRecipe();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <div className="flex flex-col items-center justify-center">
        <DialogTitle>Recipe Generator</DialogTitle>
        <IconButton
          aria-label="favorite"
          onClick={handleSaveRecipe}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <Tooltip title="Save to Favorites">
            <FavoriteIcon color={saved ? "error" : "inherit"} />
          </Tooltip>
        </IconButton>
      </div>
      <DialogContent>
        <div className="ingredient-selection">
          <h3>Select Ingredients:</h3>
          {items.map((item) => (
            <FormControlLabel
              key={item.id}
              control={
                <Checkbox
                  checked={selectedIngredients.some((i) => i.id === item.id)}
                  onChange={() =>
                    handleIngredientToggle({ id: item.id, name: item.name })
                  }
                />
              }
              label={item.name}
            />
          ))}
        </div>

        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Additional Instructions"
          value={input}
          onChange={handlePromptChange}
          placeholder="Enter any additional instructions or preferences..."
          margin="normal"
        />
        {loading ? (
          <Skeleton
            variant="text"
            width={410}
            height={218}
            sx={{ bgcolor: "grey.500" }}
          />
        ) : recipe ? (
          <div className="generated-recipe w-full overflow-hidden">
            <h3>Generated Recipe:</h3>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Disclaimer: This recipe is generated by AI. Please use caution and
              your own judgment when preparing and consuming. Try at your own
              risk.
            </Typography>
            <div className="w-full overflow-hidden whitespace-pre-wrap ">
              <Markdown remarkPlugins={[remarkGfm]}>{recipe}</Markdown>
            </div>
          </div>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setInput("");
            setRecipe("");
            setSelectedIngredients([]);
            handleClose();
            setRecipeId(null);
            setSaved(false);
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={generateRecipe}>
          Generate Recipe
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Recipe;
