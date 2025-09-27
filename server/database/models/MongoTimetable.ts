import { getCollection } from '../mongodb-connection';
import { ObjectId } from 'mongodb';

export interface Timetable {
  _id?: ObjectId;
  user_id: string;
  title?: string;
  schedule_type: 'daily' | 'weekly';
  study_days: string[];
  daily_hours: number;
  timetable_data: any; // The actual timetable structure
  metadata?: any;
  created_at: Date;
}

export interface CreateTimetableData {
  user_id: string;
  title?: string;
  schedule_type: 'daily' | 'weekly';
  study_days: string[];
  daily_hours: number;
  timetable_data: any;
  metadata?: any;
}

export class TimetableModel {
  private static getCollection() {
    return getCollection<Timetable>('timetables');
  }

  static async create(timetableData: CreateTimetableData): Promise<Timetable> {
    const collection = this.getCollection();
    const now = new Date();

    const timetable: Timetable = {
      user_id: timetableData.user_id,
      title: timetableData.title,
      schedule_type: timetableData.schedule_type,
      study_days: timetableData.study_days,
      daily_hours: timetableData.daily_hours,
      timetable_data: timetableData.timetable_data,
      metadata: timetableData.metadata || {},
      created_at: now
    };

    const result = await collection.insertOne(timetable);
    return { ...timetable, _id: result.insertedId };
  }

  static async findById(id: string): Promise<Timetable | null> {
    const collection = this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async findByUserId(userId: string, limit: number = 10): Promise<Timetable[]> {
    const collection = this.getCollection();
    return await collection
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();
  }

  static async findLatestByUserId(userId: string): Promise<Timetable | null> {
    const collection = this.getCollection();
    return await collection
      .findOne(
        { user_id: userId },
        { sort: { created_at: -1 } }
      );
  }

  static async update(id: string, updateData: Partial<CreateTimetableData>): Promise<Timetable | null> {
    const collection = this.getCollection();

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return await this.findById(id);
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

  static async getTimetableStats(userId: string): Promise<any> {
    const collection = this.getCollection();
    
    const stats = await collection.aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: null,
          totalTimetables: { $sum: 1 },
          averageDailyHours: { $avg: '$daily_hours' },
          mostCommonScheduleType: { $first: '$schedule_type' },
          totalStudyDays: { $sum: { $size: '$study_days' } }
        }
      }
    ]).toArray();

    return stats[0] || {
      totalTimetables: 0,
      averageDailyHours: 0,
      mostCommonScheduleType: 'daily',
      totalStudyDays: 0
    };
  }

  static async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Timetable[]> {
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

  static async findByScheduleType(userId: string, scheduleType: 'daily' | 'weekly'): Promise<Timetable[]> {
    const collection = this.getCollection();
    return await collection
      .find({
        user_id: userId,
        schedule_type: scheduleType
      })
      .sort({ created_at: -1 })
      .toArray();
  }

  static async count(userId?: string): Promise<number> {
    const collection = this.getCollection();
    const filter = userId ? { user_id: userId } : {};
    return await collection.countDocuments(filter);
  }

  static async getRecentTimetables(limit: number = 5): Promise<Timetable[]> {
    const collection = this.getCollection();
    return await collection
      .find({})
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();
  }
}
