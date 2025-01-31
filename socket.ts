import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { encrypt, decrypt } from "./encryption";
import { db } from "@db";
import { messages } from "@db/schema";

export function setupWebSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("send_message", async (message: string) => {
      try {
        // Encrypt the message
        const encrypted = encrypt(message);

        // Save to database
        const savedMessage = await db.insert(messages).values({
          text: message,
          encrypted,
          timestamp: new Date()
        }).returning();

        // Broadcast the message to all clients
        io.emit("message", {
          id: savedMessage[0].id.toString(),
          text: message,
          encrypted,
          timestamp: savedMessage[0].timestamp.getTime()
        });
      } catch (error) {
        console.error("Failed to process message:", error);
        socket.emit("error", "Failed to process message");
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
}