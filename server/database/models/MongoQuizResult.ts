import { getCollection } from '../mongodb-connection';
import { ObjectId } from 'mongodb';

export interface QuizResult {
  _id?: ObjectId;
  user_id: string;
  quiz_type?: string;
  total_accuracy: number;
  subject_results: Record<string, any>;
  topic_breakdown: Record<string, any>;
  recommended_adjustments: Record<string, any>;
  time_taken: number; // seconds
  created_at: Date;
}

export interface CreateQuizResultData {
  user_id: string;
  quiz_type?: string;
  total_accuracy: number;
  subject_results: Record<string, any>;
  topic_breakdown: Record<string, any>;
  recommended_adjustments: Record<string, any>;
  time_taken: number;
}

export class QuizResultModel {
  private static getCollection() {
    return getCollection<QuizResult>('quiz_results');
  }

  static async create(quizData: CreateQuizResultData): Promise<QuizResult> {
    const collection = this.getCollection();
    const now = new Date();

    const quizResult: QuizResult = {
      user_id: quizData.user_id,
      quiz_type: quizData.quiz_type,
      total_accuracy: quizData.total_accuracy,
      subject_results: quizData.subject_results,
      topic_breakdown: quizData.topic_breakdown,
      recommended_adjustments: quizData.recommended_adjustments,
      time_taken: quizData.time_taken,
      created_at: now
    };

    const result = await collection.insertOne(quizResult);
    return { ...quizResult, _id: result.insertedId };
  }

  static async findById(id: string): Promise<QuizResult | null> {
    const collection = this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async findByUserId(userId: string, limit: number = 10): Promise<QuizResult[]> {
    const collection = this.getCollection();
    return await collection
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();
  }

  static async findLatestByUserId(userId: string): Promise<QuizResult | null> {
    const collection = this.getCollection();
    return await collection
      .findOne(
        { user_id: userId },
        { sort: { created_at: -1 } }
      );
  }

  static async getAverageAccuracy(userId: string, days: number = 30): Promise<number> {
    const collection = this.getCollection();
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const result = await collection.aggregate([
      {
        $match: {
          user_id: userId,
          created_at: { $gte: cutoffDate }
        }
      },
      {
        $group: {
          _id: null,
          avgAccuracy: { $avg: '$total_accuracy' }
        }
      }
    ]).toArray();

    return result[0]?.avgAccuracy || 0;
  }

  static async getSubjectPerformance(userId: string, subject: string, days: number = 30): Promise<QuizResult[]> {
    const collection = this.getCollection();
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    return await collection
      .find({
        user_id: userId,
        created_at: { $gte: cutoffDate },
        [`subject_results.${subject}`]: { $exists: true }
      })
      .sort({ created_at: -1 })
      .toArray();
  }

  static async delete(id: string): Promise<boolean> {
    const collection = this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async deleteByUserId(userId: string): Promise<number> {
    const collection = this.getCollection();
    const result = await collection.deleteMany({ user_id: userId });
    return result.deletedCount || 0;
  }

  static async getQuizStats(userId: string): Promise<any> {
    const collection = this.getCollection();
    
    const stats = await collection.aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          averageAccuracy: { $avg: '$total_accuracy' },
          averageTime: { $avg: '$time_taken' },
          bestAccuracy: { $max: '$total_accuracy' },
          totalTimeSpent: { $sum: '$time_taken' }
        }
      }
    ]).toArray();

    return stats[0] || {
      totalQuizzes: 0,
      averageAccuracy: 0,
      averageTime: 0,
      bestAccuracy: 0,
      totalTimeSpent: 0
    };
  }

  static async getProgressOverTime(userId: string, days: number = 30): Promise<any[]> {
    const collection = this.getCollection();
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    return await collection.aggregate([
      {
        $match: {
          user_id: userId,
          created_at: { $gte: cutoffDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$created_at'
            }
          },
          averageAccuracy: { $avg: '$total_accuracy' },
          quizCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]).toArray();
  }

  static async getSubjectAccuracyTrends(userId: string): Promise<any> {
    const collection = this.getCollection();

    return await collection.aggregate([
      { $match: { user_id: userId } },
      {
        $project: {
          created_at: 1,
          subject_results: { $objectToArray: '$subject_results' }
        }
      },
      { $unwind: '$subject_results' },
      {
        $group: {
          _id: '$subject_results.k',
          averageAccuracy: { $avg: '$subject_results.v.accuracy' },
          quizCount: { $sum: 1 },
          latestAccuracy: { $last: '$subject_results.v.accuracy' }
        }
      },
      {
        $sort: { averageAccuracy: -1 }
      }
    ]).toArray();
  }

  static async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<QuizResult[]> {
    const collection = this.getCollection();
    return await collection
      .find({
        user_id: userId,
        created_at: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .sort({ created_at: -1 })
      .toArray();
  }

  static async count(userId?: string): Promise<number> {
    const collection = this.getCollection();
    const filter = userId ? { user_id: userId } : {};
    return await collection.countDocuments(filter);
  }
}
