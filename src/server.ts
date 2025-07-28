import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import express, { Request, Response } from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

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

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
