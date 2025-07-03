import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProfileSchema, insertMessageSchema, insertLikeSchema, insertBlockSchema, insertReportSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.post("/api/profiles", async (req, res) => {
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(profileData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: "Invalid profile data" });
    }
  });

  app.get("/api/profiles", async (req, res) => {
    try {
      const excludeUserId = req.query.excludeUserId ? parseInt(req.query.excludeUserId as string) : undefined;
      const profiles = await storage.getProfiles(excludeUserId);
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profiles" });
    }
  });

  app.get("/api/profiles/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const excludeUserId = req.query.excludeUserId ? parseInt(req.query.excludeUserId as string) : undefined;
      
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const profiles = await storage.searchProfiles(query, excludeUserId);
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: "Failed to search profiles" });
    }
  });

  app.get("/api/profiles/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profile = await storage.getProfileByUserId(userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.put("/api/profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const profileData = insertProfileSchema.partial().parse(req.body);
      const profile = await storage.updateProfile(id, profileData);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: "Invalid profile data" });
    }
  });

  // Like routes
  app.post("/api/likes", async (req, res) => {
    try {
      const likeData = insertLikeSchema.parse(req.body);
      
      // Check if like already exists
      const existingLike = await storage.checkLike(likeData.senderId, likeData.receiverId);
      if (existingLike) {
        return res.status(409).json({ error: "Already liked this profile" });
      }

      const like = await storage.createLike(likeData);
      
      // Check if it's a mutual like and create a match
      const reciprocalLike = await storage.checkLike(likeData.receiverId, likeData.senderId);
      if (reciprocalLike) {
        await storage.createMatch(likeData.senderId, likeData.receiverId);
      }
      
      res.json(like);
    } catch (error) {
      res.status(400).json({ error: "Invalid like data" });
    }
  });

  app.get("/api/likes/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const likes = await storage.getLikesByUserId(userId);
      res.json(likes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch likes" });
    }
  });

  // Match routes
  app.get("/api/matches/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const matches = await storage.getMatchesByUserId(userId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  // Message routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  app.get("/api/messages/:userId1/:userId2", async (req, res) => {
    try {
      const userId1 = parseInt(req.params.userId1);
      const userId2 = parseInt(req.params.userId2);
      const messages = await storage.getMessagesBetweenUsers(userId1, userId2);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.get("/api/conversations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const conversations = await storage.getConversationsByUserId(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.put("/api/messages/:id/read", async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      await storage.markMessageAsRead(messageId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });

  // Block routes
  app.post("/api/blocks", async (req, res) => {
    try {
      const blockData = insertBlockSchema.parse(req.body);
      const block = await storage.createBlock(blockData);
      res.json(block);
    } catch (error) {
      res.status(400).json({ error: "Invalid block data" });
    }
  });

  app.get("/api/blocks/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const blocks = await storage.getBlocksByUserId(userId);
      res.json(blocks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blocks" });
    }
  });

  // Report routes
  app.post("/api/reports", async (req, res) => {
    try {
      const reportData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(reportData);
      res.json(report);
    } catch (error) {
      res.status(400).json({ error: "Invalid report data" });
    }
  });

  app.get("/api/reports/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reports = await storage.getReportsByUserId(userId);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
