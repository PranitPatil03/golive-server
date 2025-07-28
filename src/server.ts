import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import userRoutes from "./routes/users";
import {
  auth,
  signInUser,
  signUpUser,
  signUpUserWithGoogle,
  signUpUserWithGithub,
} from "./lib/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  const response = {
    success: true,
    data: {
      message: "golive!",
      environment: NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  };
  res.json(response);
});

app.get("/health", (req: Request, res: Response) => {
  const response = {
    success: true,
    data: {
      status: "Server is Running...",
      timestamp: new Date().toISOString(),
    },
  };
  res.json(response);
});

app.get("/api/me", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    return res.json(session);
  } catch (error) {
    console.error("Error getting session:", error);
    return res.status(500).json({ error: "Failed to get session" });
  }
});

app.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await signInUser(
      email,
      password,
      fromNodeHeaders(req.headers)
    );
    res.json(result);
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(400).json({ error: "Sign-in failed" });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await signUpUser(
      email,
      password,
      fromNodeHeaders(req.headers),
      name
    );
    res.json(result);
  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(400).json({ error: "Sign-up failed" });
  }
});

app.post("/api/signup/google", async (req, res) => {
  try {
    const result = await signUpUserWithGoogle(fromNodeHeaders(req.headers));
    res.json(result);
  } catch (error) {
    console.error("Google sign-up error:", error);
    res.status(400).json({ error: "Google sign-up failed" });
  }
});

app.post("/api/signup/github", async (req, res) => {
  try {
    const result = await signUpUserWithGithub(fromNodeHeaders(req.headers));
    res.json(result);
  } catch (error) {
    console.error("GitHub sign-up error:", error);
    res.status(400).json({ error: "GitHub sign-up failed" });
  }
});

app.use("/api/users", userRoutes);

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: NODE_ENV === "development" ? err.message : "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});