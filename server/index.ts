import "dotenv/config";
import express from "express";
import cors from "cors";
import { initializeDatabase } from "./database/mongodb-connection";
import { handleDemo } from "./routes/demo";
import { handleDoubt } from "./routes/doubt";
import { handleGenerateTimetable } from "./routes/timetable";
import { getUserNotifications } from "./routes/progress";
import { generateQuiz, evaluateQuiz } from "./routes/quiz";
import { 
  getChallenges, 
  getChallengeById, 
  submitChallenge, 
  getPersonalizedChallenges,
  getUserProgress as getChallengeUserProgress
} from "./routes/challenge";
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserStats, 
  updateUserStats, 
  resetUserProgress, 
  exportUserData, 
  deleteUserAccount 
} from "./routes/profile";
import {
  getLearningModules,
  getLearningModule,
  getLearningPaths,
  getLearningPath,
  startLearningModule,
  updateLearningProgress,
  enrollInLearningPath,
  getUserLearningProgress
} from "./routes/learn";
import {
  createUser,
  getUserById,
  updateUser,
  getUserProgress,
  updateUserProgress,
  deleteUser,
  listUsers,
  searchUsers,
  getUserByEmail
} from "./routes/users";

export async function createServer() {
  const app = express();

  // Initialize database
  try {
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/doubt", handleDoubt);
  app.post("/api/generate-timetable", handleGenerateTimetable);
  
  // Progress tracking routes
  app.get("/api/progress/:userId", getUserProgress);
  app.get("/api/progress", getUserProgress);
  app.post("/api/progress/:userId", updateUserProgress);
  app.post("/api/progress", updateUserProgress);
  app.get("/api/notifications/:userId", getUserNotifications);
  app.get("/api/notifications", getUserNotifications);
  
  // Quiz routes
  app.post("/api/quiz/generate", generateQuiz);
  app.post("/api/quiz/evaluate", evaluateQuiz);
  
  // Challenge routes
  app.get("/api/challenges", getChallenges);
  app.get("/api/challenges/personalized", getPersonalizedChallenges);
  app.get("/api/challenges/:id", getChallengeById);
  app.post("/api/challenges/submit", submitChallenge);
  app.get("/api/challenges/progress/:userId", getChallengeUserProgress);
  
  // Profile routes
  app.get("/api/profile/:userId", getUserProfile);
  app.put("/api/profile/:userId", updateUserProfile);
  app.get("/api/profile/:userId/stats", getUserStats);
  app.put("/api/profile/:userId/stats", updateUserStats);
  app.post("/api/profile/:userId/reset", resetUserProgress);
  app.get("/api/profile/:userId/export", exportUserData);
  app.delete("/api/profile/:userId", deleteUserAccount);
  
  // User routes
  app.post("/api/users", createUser);
  app.get("/api/users/:userId", getUserById);
  app.put("/api/users/:userId", updateUser);
  app.get("/api/users/:userId/progress", getUserProgress);
  app.put("/api/users/:userId/progress", updateUserProgress);
  app.delete("/api/users/:userId", deleteUser);
  app.get("/api/users", listUsers);
  app.get("/api/users/search/:query", searchUsers);
  app.get("/api/users/email/:email", getUserByEmail);
  
  // Learning routes
  app.get("/api/learn/modules", getLearningModules);
  app.get("/api/learn/modules/:moduleId", getLearningModule);
  app.get("/api/learn/paths", getLearningPaths);
  app.get("/api/learn/paths/:pathId", getLearningPath);
  app.post("/api/learn/modules/:moduleId/start", startLearningModule);
  app.put("/api/learn/modules/:moduleId/progress", updateLearningProgress);
  app.post("/api/learn/paths/:pathId/enroll", enrollInLearningPath);
  app.get("/api/learn/progress/:userId", getUserLearningProgress);

  return app;
}
