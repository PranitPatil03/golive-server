import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        sessions: true,
        accounts: true,
      },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sessions: true,
        accounts: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { id, name, email, emailVerified = false, image } = req.body;

    if (!id || !name || !email) {
      return res.status(400).json({
        success: false,
        error: "id, name, and email are required",
      });
    }

    const user = await prisma.user.create({
      data: {
        id,
        name,
        email,
        emailVerified,
        image,
      },
    });

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create user",
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, email, emailVerified, image } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        email: email || undefined,
        emailVerified: emailVerified !== undefined ? emailVerified : undefined,
        image: image || undefined,
      },
    });

    res.json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user",
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      success: true,
      data: user,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete user",
    });
  }
});

router.get("/:id/sessions", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const sessions = await prisma.session.findMany({
      where: { userId },
    });

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user sessions",
    });
  }
});

router.get("/:id/accounts", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const accounts = await prisma.account.findMany({
      where: { userId },
    });

    res.json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    console.error("Error fetching user accounts:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user accounts",
    });
  }
});

export default router;
