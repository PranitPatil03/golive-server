import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import express, { Request, Response } from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL || "http://localhost:3000"
      : [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://127.0.0.1:3000",
        ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "X-Requested-With",
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(helmet());
app.use(cors(corsOptions));

app.options("/api/auth/{*any}", cors(corsOptions));

app.all("/api/auth/{*any}", cors(corsOptions), toNodeHandler(auth));

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/protected", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers as any,
  });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.json({ message: "Protected route", user: session.user });
});

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

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});