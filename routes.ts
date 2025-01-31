import type { Express } from "express";
import { createServer } from "http";
import { getEncryptionSteps } from "./encryption";
import { setupWebSocketServer } from "./socket";
import { db } from "@db";
import { messages } from "@db/schema";
import { desc } from "drizzle-orm";

export function registerRoutes(app: Express) {
  const httpServer = createServer(app);
  
  // Setup WebSocket server
  setupWebSocketServer(httpServer);

  // API Routes
  app.post("/api/visualize-encryption", (req, res) => {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const steps = getEncryptionSteps(text);
    res.json({ steps });
  });

  // Get message history
  app.get("/api/messages", async (req, res) => {
    try {
      const messageHistory = await db.query.messages.findMany({
        orderBy: desc(messages.timestamp),
        limit: 50 // Limit to last 50 messages
      });
      res.json(messageHistory);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      res.status(500).json({ message: "Failed to fetch message history" });
    }
  });

  return httpServer;
}