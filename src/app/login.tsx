"use client";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Container,
  IconButton,
  Tooltip,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import { Google } from "@mui/icons-material";
import {
  googleProvider,
  auth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "./firebase";
import { useRouter } from "next/navigation";
const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  console.log(email, password);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      try {
        await createUserWithEmailAndPassword(auth, email, password).then(
          (user) => {
            console.log("user", user);
          }
        );
      } catch (err: any) {
        console.error("Error creating user:", err);
        setError(err.message);
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error("Error creating user:", error);
        setError("Invalid Login Credentials");
        // Handle error, including potential INVALID_LOGIN_CREDENTIALS
      }
    }
    router.push("/");
  };
  //   const userCred = await getRedirectResult(auth)
  const handleGoogleLogin = async () => {
    const g_auth = getAuth();
    try {
      const result = await signInWithPopup(g_auth, googleProvider);
      router.push("/");
      console.log("result", result);
    } catch (err: any) {
      console.log("error", err);
      setError(err.message);
    }
  };
  return (
    <Container>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div" align="center">
            Welcome to PantryVision
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary" align="center">
            {isSignUp
              ? "Please register to continue"
              : "Please login to continue"}
          </Typography>
        </CardContent>
      </Card>
      <FormControl className="mt-4" fullWidth>
        <FormHelperText className="mb-2">Enter your email</FormHelperText>
        <TextField
          label="Email"
          color="secondary"
          type="email"
          fullWidth
          focused
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(event.target.value);
          }}
        />
        <FormHelperText className="mt-4 mb-2">
          Enter your password
        </FormHelperText>
        <TextField
          label="Password"
          color="primary"
          type="password"
          focused
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <Button
          variant="contained"
          className="mt-4"
          color="success"
          type="submit"
          onClick={handleLogin}
        >
          <Typography color="white">
            {isSignUp ? "Register" : " Login"}
          </Typography>
        </Button>
        <Button
          variant="contained"
          startIcon={<Google />}
          sx={{ mt: 2 }}
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>
      </FormControl>
      <Box>
        <Button onClick={() => setIsSignUp(!isSignUp)} fullWidth sx={{ mt: 2 }}>
          {isSignUp
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </Button>
      </Box>
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default LoginPage;
