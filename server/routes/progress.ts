import { RequestHandler } from "express";
import { UserProgressModel } from "../database/models/MongoUserProgress";
import { UserModel } from "../database/models/MongoUser";

interface UserProgress {
  userId: string;
  totalStudyTime: number;
  questionsAnswered: number;
  topicsCompleted: string[];
  streakCount: number;
  lastStudyDate: string;
  subjectProgress: Record<string, {
    timeSpent: number;
    questionsAnswered: number;
    accuracy: number;
    topicsCompleted: string[];
  }>;
  achievements: Array<{
    id: string;
    type: 'streak' | 'topic' | 'questions' | 'time';
    title: string;
    description: string;
    earnedAt: string;
    xpReward: number;
  }>;
  weeklyStats: Array<{
    date: string;
    studyTime: number;
    questionsAnswered: number;
  }>;
}

interface ProgressUpdate {
  action: 'study_session' | 'question_answered' | 'topic_completed';
  subject?: string;
  topic?: string;
  timeSpent?: number;
  isCorrect?: boolean;
  sessionData?: any;
}

// In-memory storage for demo (in production, use a database)
const userProgressData: Record<string, UserProgress> = {};

// Helper function to calculate streak
const calculateStreak = (weeklyStats: UserProgress['weeklyStats']): number => {
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let currentDate = new Date();
  
  for (let i = 0; i < 30; i++) { // Check last 30 days
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayData = weeklyStats.find(stat => stat.date === dateStr);
    
    if (dayData && dayData.studyTime > 0) {
      streak++;
    } else if (dateStr !== today) {
      break; // Streak broken
    }
    
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
};

// Helper function to check for new achievements
const checkAchievements = (progress: UserProgress): UserProgress['achievements'] => {
  const newAchievements: UserProgress['achievements'] = [];
  const existingAchievementIds = progress.achievements.map(a => a.id);
  
  // Streak achievements
  if (progress.streakCount >= 5 && !existingAchievementIds.includes('streak_5')) {
    newAchievements.push({
      id: 'streak_5',
      type: 'streak',
      title: '5-Day Streak Master',
      description: 'Studied for 5 consecutive days',
      earnedAt: new Date().toISOString(),
      xpReward: 100
    });
  }
  
  if (progress.streakCount >= 10 && !existingAchievementIds.includes('streak_10')) {
    newAchievements.push({
      id: 'streak_10',
      type: 'streak',
      title: 'Consistency Champion',
      description: 'Studied for 10 consecutive days',
      earnedAt: new Date().toISOString(),
      xpReward: 250
    });
  }
  
  // Questions achievements
  if (progress.questionsAnswered >= 100 && !existingAchievementIds.includes('questions_100')) {
    newAchievements.push({
      id: 'questions_100',
      type: 'questions',
      title: 'Problem Solver',
      description: 'Answered 100+ questions',
      earnedAt: new Date().toISOString(),
      xpReward: 150
    });
  }
  
  // Topic achievements
  if (progress.topicsCompleted.length >= 5 && !existingAchievementIds.includes('topics_5')) {
    newAchievements.push({
      id: 'topics_5',
      type: 'topic',
      title: 'Topic Explorer',
      description: 'Completed 5 different topics',
      earnedAt: new Date().toISOString(),
      xpReward: 200
    });
  }
  
  // Study time achievements
  if (progress.totalStudyTime >= 50 && !existingAchievementIds.includes('time_50')) {
    newAchievements.push({
      id: 'time_50',
      type: 'time',
      title: 'Dedicated Learner',
      description: 'Studied for 50+ hours total',
      earnedAt: new Date().toISOString(),
      xpReward: 300
    });
  }
  
  return [...progress.achievements, ...newAchievements];
};

// Get user progress
export const getUserProgress: RequestHandler = (req, res) => {
  const userId = req.params.userId || 'default';
  
  if (!userProgressData[userId]) {
    // Initialize new user progress
    userProgressData[userId] = {
      userId,
      totalStudyTime: 47.5,
      questionsAnswered: 142,
      topicsCompleted: ['Arrays & Strings', 'Basic JavaScript', 'HTML & CSS'],
      streakCount: 5,
      lastStudyDate: new Date().toISOString().split('T')[0],
      subjectProgress: {
        'Data Structures & Algorithms': {
          timeSpent: 15.2,
          questionsAnswered: 45,
          accuracy: 78,
          topicsCompleted: ['Arrays & Strings']
        },
        'Web Development': {
          timeSpent: 20.8,
          questionsAnswered: 67,
          accuracy: 94,
          topicsCompleted: ['HTML & CSS', 'Basic JavaScript']
        },
        'Machine Learning': {
          timeSpent: 8.5,
          questionsAnswered: 15,
          accuracy: 65,
          topicsCompleted: []
        },
        'System Design': {
          timeSpent: 3.0,
          questionsAnswered: 15,
          accuracy: 72,
          topicsCompleted: []
        }
      },
      achievements: [
        {
          id: 'first_session',
          type: 'time',
          title: 'Getting Started',
          description: 'Completed your first study session',
          earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          xpReward: 50
        }
      ],
      weeklyStats: [
        { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], studyTime: 2.5, questionsAnswered: 12 },
        { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], studyTime: 3.1, questionsAnswered: 18 },
        { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], studyTime: 1.8, questionsAnswered: 8 },
        { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], studyTime: 2.9, questionsAnswered: 15 },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], studyTime: 3.5, questionsAnswered: 22 },
        { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], studyTime: 1.2, questionsAnswered: 6 },
        { date: new Date().toISOString().split('T')[0], studyTime: 2.5, questionsAnswered: 12 }
      ]
    };
  }
  
  const progress = userProgressData[userId];
  progress.streakCount = calculateStreak(progress.weeklyStats);
  progress.achievements = checkAchievements(progress);
  
  res.json(progress);
};

// Update user progress
export const updateUserProgress: RequestHandler = (req, res) => {
  const userId = req.params.userId || 'default';
  const updateData: ProgressUpdate = req.body;
  
  if (!userProgressData[userId]) {
    return res.status(404).json({ error: 'User progress not found' });
  }
  
  const progress = userProgressData[userId];
  const today = new Date().toISOString().split('T')[0];
  
  // Update based on action type
  switch (updateData.action) {
    case 'study_session':
      if (updateData.timeSpent && updateData.subject) {
        progress.totalStudyTime += updateData.timeSpent;
        progress.lastStudyDate = today;
        
        // Update subject progress
        if (!progress.subjectProgress[updateData.subject]) {
          progress.subjectProgress[updateData.subject] = {
            timeSpent: 0,
            questionsAnswered: 0,
            accuracy: 0,
            topicsCompleted: []
          };
        }
        progress.subjectProgress[updateData.subject].timeSpent += updateData.timeSpent;
        
        // Update weekly stats
        let todayStats = progress.weeklyStats.find(stat => stat.date === today);
        if (!todayStats) {
          todayStats = { date: today, studyTime: 0, questionsAnswered: 0 };
          progress.weeklyStats.push(todayStats);
        }
        todayStats.studyTime += updateData.timeSpent;
      }
      break;
      
    case 'question_answered':
      if (updateData.subject) {
        progress.questionsAnswered++;
        
        // Update subject progress
        if (!progress.subjectProgress[updateData.subject]) {
          progress.subjectProgress[updateData.subject] = {
            timeSpent: 0,
            questionsAnswered: 0,
            accuracy: 0,
            topicsCompleted: []
          };
        }
        
        const subjectProgress = progress.subjectProgress[updateData.subject];
        subjectProgress.questionsAnswered++;
        
        // Update accuracy
        if (updateData.isCorrect !== undefined) {
          const totalQuestions = subjectProgress.questionsAnswered;
          const currentCorrect = Math.floor((subjectProgress.accuracy / 100) * (totalQuestions - 1));
          const newCorrect = currentCorrect + (updateData.isCorrect ? 1 : 0);
          subjectProgress.accuracy = Math.round((newCorrect / totalQuestions) * 100);
        }
        
        // Update weekly stats
        let todayStats = progress.weeklyStats.find(stat => stat.date === today);
        if (!todayStats) {
          todayStats = { date: today, studyTime: 0, questionsAnswered: 0 };
          progress.weeklyStats.push(todayStats);
        }
        todayStats.questionsAnswered++;
      }
      break;
      
    case 'topic_completed':
      if (updateData.topic && updateData.subject) {
        if (!progress.topicsCompleted.includes(updateData.topic)) {
          progress.topicsCompleted.push(updateData.topic);
        }
        
        // Update subject progress
        if (!progress.subjectProgress[updateData.subject]) {
          progress.subjectProgress[updateData.subject] = {
            timeSpent: 0,
            questionsAnswered: 0,
            accuracy: 0,
            topicsCompleted: []
          };
        }
        
        if (!progress.subjectProgress[updateData.subject].topicsCompleted.includes(updateData.topic)) {
          progress.subjectProgress[updateData.subject].topicsCompleted.push(updateData.topic);
        }
      }
      break;
  }
  
  // Recalculate streak and check achievements
  progress.streakCount = calculateStreak(progress.weeklyStats);
  const oldAchievementCount = progress.achievements.length;
  progress.achievements = checkAchievements(progress);
  const newAchievements = progress.achievements.slice(oldAchievementCount);
  
  res.json({
    success: true,
    progress,
    newAchievements
  });
};

// Get user notifications
export const getUserNotifications: RequestHandler = (req, res) => {
  const userId = req.params.userId || 'default';
  const progress = userProgressData[userId];
  
  if (!progress) {
    return res.json({ notifications: [] });
  }
  
  const notifications = [];
  const today = new Date().toISOString().split('T')[0];
  const todayStats = progress.weeklyStats.find(stat => stat.date === today);
  
  // Recent achievements
  const recentAchievements = progress.achievements.filter(
    achievement => {
      const earnedDate = new Date(achievement.earnedAt);
      const daysDiff = (Date.now() - earnedDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 3; // Last 3 days
    }
  );
  
  recentAchievements.forEach(achievement => {
    notifications.push({
      id: `achievement_${achievement.id}`,
      type: 'achievement',
      message: `${achievement.title} - ${achievement.description}`,
      unread: true
    });
  });
  
  // Daily reminders
  if (!todayStats || todayStats.studyTime === 0) {
    notifications.push({
      id: 'daily_reminder',
      type: 'reminder',
      message: 'Daily practice session available',
      unread: true
    });
  }
  
  // Streak notifications
  if (progress.streakCount >= 5) {
    notifications.push({
      id: 'streak_notification',
      type: 'milestone',
      message: `${progress.streakCount}-day streak! Keep it up!`,
      unread: false
    });
  }
  
  res.json({ notifications });
};
