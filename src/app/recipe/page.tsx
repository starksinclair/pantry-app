"use client";

import React, { useState, useEffect } from "react";
import { auth, fetchSubcollection, deleteSubcollectionDoc } from "../firebase";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button, Container } from "@mui/material";
import Header from "../component/Header";

interface Recipe {
  id: string;

  ingredients: string[];
  instructions: string;
}

const RecipePage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.log("No authenticated user");
        return;
      }
      const itemsData = await fetchSubcollection('recipes');
      setRecipes(itemsData as Recipe[]);
    };
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchRecipes();
      } else {
        setRecipes([]);
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    const user = auth.currentUser;
    if (!user) {
      console.log("No authenticated user");
      return;
    }
    try {
      await deleteSubcollectionDoc('recipes', id);
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <>
      <Container>
        <Header />
        {recipes.map((recipe: Recipe) => (
          <Accordion key={recipe.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {recipe.ingredients}
            </AccordionSummary>
            <AccordionDetails>
              <Markdown remarkPlugins={[remarkGfm]}>
                {recipe.instructions}
              </Markdown>
            </AccordionDetails>
            <AccordionActions>
              <Button onClick={() => handleDelete(recipe.id)}>Delete</Button>
            </AccordionActions>
          </Accordion>
        ))}
      </Container>
    </>
  );
};
export default RecipePage;
