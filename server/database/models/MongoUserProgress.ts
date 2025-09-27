import { getCollection } from '../mongodb-connection';
import { ObjectId } from 'mongodb';

export interface UserProgress {
  _id?: ObjectId;
  user_id: string;
  total_study_time: number;
  questions_answered: number;
  topics_completed: string[];
  streak_count: number;
  xp_points: number;
  level: number;
  last_study_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface UpdateProgressData {
  total_study_time?: number;
  questions_answered?: number;
  topics_completed?: string[];
  streak_count?: number;
  xp_points?: number;
  level?: number;
  last_study_date?: Date;
}

export class UserProgressModel {
  private static getCollection() {
    return getCollection<UserProgress>('user_progress');
  }

  static async findByUserId(userId: string): Promise<UserProgress | null> {
    const collection = this.getCollection();
    return await collection.findOne({ user_id: userId });
  }

  static async update(userId: string, updateData: UpdateProgressData): Promise<UserProgress | null> {
    const collection = this.getCollection();
    const now = new Date();

    const updateFields: any = {
      ...updateData,
      updated_at: now
    };

    await collection.updateOne(
      { user_id: userId },
      { $set: updateFields },
      { upsert: true }
    );

    return await this.findByUserId(userId);
  }

  static async incrementStudyTime(userId: string, minutes: number): Promise<UserProgress | null> {
    const collection = this.getCollection();
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await collection.updateOne(
      { user_id: userId },
      {
        $inc: { total_study_time: minutes },
        $set: { 
          last_study_date: today,
          updated_at: now 
        }
      },
      { upsert: true }
    );

    return await this.findByUserId(userId);
  }

  static async incrementQuestionsAnswered(userId: string, count: number = 1): Promise<UserProgress | null> {
    const collection = this.getCollection();
    const now = new Date();

    await collection.updateOne(
      { user_id: userId },
      {
        $inc: { questions_answered: count },
        $set: { updated_at: now }
      },
      { upsert: true }
    );

    return await this.findByUserId(userId);
  }

  static async addXP(userId: string, xpAmount: number): Promise<UserProgress | null> {
    const collection = this.getCollection();
    const now = new Date();

    // Get current progress to calculate level
    const currentProgress = await this.findByUserId(userId);
    const currentXP = currentProgress?.xp_points || 0;
    const newXP = currentXP + xpAmount;
    const newLevel = Math.floor(newXP / 1000) + 1; // 1000 XP per level

    await collection.updateOne(
      { user_id: userId },
      {
        $set: {
          xp_points: newXP,
          level: newLevel,
          updated_at: now
        }
      },
      { upsert: true }
    );

    return await this.findByUserId(userId);
  }

  static async updateStreak(userId: string): Promise<UserProgress | null> {
    const collection = this.getCollection();
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const currentProgress = await this.findByUserId(userId);
    let newStreakCount = 1;

    if (currentProgress?.last_study_date) {
      const lastStudyDate = new Date(currentProgress.last_study_date);
      lastStudyDate.setHours(0, 0, 0, 0);
      
      if (lastStudyDate.getTime() === today.getTime()) {
        // Already studied today, don't change streak
        return currentProgress;
      } else if (lastStudyDate.getTime() === yesterday.getTime()) {
        // Studied yesterday, increment streak
        newStreakCount = currentProgress.streak_count + 1;
      }
      // If last study was more than 1 day ago, streak resets to 1
    }

    await collection.updateOne(
      { user_id: userId },
      {
        $set: {
          streak_count: newStreakCount,
          last_study_date: today,
          updated_at: now
        }
      },
      { upsert: true }
    );

    return await this.findByUserId(userId);
  }

  static async addCompletedTopic(userId: string, topic: string): Promise<UserProgress | null> {
    const collection = this.getCollection();
    const now = new Date();

    await collection.updateOne(
      { user_id: userId },
      {
        $addToSet: { topics_completed: topic },
        $set: { updated_at: now }
      },
      { upsert: true }
    );

    return await this.findByUserId(userId);
  }

  static async reset(userId: string): Promise<UserProgress | null> {
    const collection = this.getCollection();
    const now = new Date();

    await collection.updateOne(
      { user_id: userId },
      {
        $set: {
          total_study_time: 0,
          questions_answered: 0,
          topics_completed: [],
          streak_count: 0,
          xp_points: 0,
          level: 1,
          last_study_date: null,
          updated_at: now
        }
      },
      { upsert: true }
    );

    return await this.findByUserId(userId);
  }

  static async getLeaderboard(limit: number = 10): Promise<UserProgress[]> {
    const collection = this.getCollection();
    return await collection
      .find({})
      .sort({ xp_points: -1 })
      .limit(limit)
      .toArray();
  }

  static async getUserRank(userId: string): Promise<number> {
    const collection = this.getCollection();
    const userProgress = await this.findByUserId(userId);
    
    if (!userProgress) return 0;

    const rank = await collection.countDocuments({
      xp_points: { $gt: userProgress.xp_points }
    });

    return rank + 1;
  }

  static async getProgressStats(): Promise<any> {
    const collection = this.getCollection();
    
    const stats = await collection.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalStudyTime: { $sum: '$total_study_time' },
          totalQuestions: { $sum: '$questions_answered' },
          averageXP: { $avg: '$xp_points' },
          averageLevel: { $avg: '$level' },
          maxStreak: { $max: '$streak_count' }
        }
      }
    ]).toArray();

    return stats[0] || {
      totalUsers: 0,
      totalStudyTime: 0,
      totalQuestions: 0,
      averageXP: 0,
      averageLevel: 0,
      maxStreak: 0
    };
  }
}
