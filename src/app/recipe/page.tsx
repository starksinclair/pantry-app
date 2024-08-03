"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { auth, db } from "../firebase";
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
      const pantriesRef = collection(db, "pantries");
      const pantryDoc = doc(pantriesRef, user.uid);
      const pantryDocSnap = await getDoc(pantryDoc);
      if (pantryDocSnap.exists()) {
        const docId = pantryDocSnap.data().userID;
        if (docId === user.uid) {
          const recipesCollection = collection(pantriesRef, docId, "recipes");
          const q = query(recipesCollection);
          const listen = onSnapshot(q, (snapshot) => {
            const itemsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Recipe[];
            // console.log("Fetched items:", itemsData);
            setRecipes(itemsData);
          });
          return () => listen();
        } else {
          console.log("Pantry document does not exist");
        }
      }
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
      const pantriesRef = collection(db, "pantries");
      const pantryDoc = doc(pantriesRef, user.uid);
      const recipeRef = collection(pantryDoc, "recipes");
      const recipeDoc = doc(recipeRef, id);
      await deleteDoc(recipeDoc);
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
