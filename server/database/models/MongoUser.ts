import { getCollection } from '../mongodb-connection';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  time_commitment: number;
  preferred_style?: 'visual' | 'practical' | 'theoretical';
  goals: string[];
  focus_areas: string[];
  subject_levels: Record<string, {
    level: 'beginner' | 'intermediate' | 'advanced';
    topics: string[];
  }>;
  social_links?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
  join_date: Date;
  last_active: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  time_commitment: number;
  preferred_style?: 'visual' | 'practical' | 'theoretical';
  goals: string[];
  focus_areas: string[];
  subject_levels: Record<string, {
    level: 'beginner' | 'intermediate' | 'advanced';
    topics: string[];
  }>;
  social_links?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export class UserModel {
  private static getCollection() {
    return getCollection<User>('users');
  }

  static async create(userData: CreateUserData): Promise<User> {
    const collection = this.getCollection();
    const userId = uuidv4();
    const now = new Date();

    const user: User = {
      id: userId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
      bio: userData.bio,
      avatar: userData.avatar,
      experience: userData.experience,
      time_commitment: userData.time_commitment,
      preferred_style: userData.preferred_style,
      goals: userData.goals,
      focus_areas: userData.focus_areas,
      subject_levels: userData.subject_levels,
      social_links: userData.social_links || {},
      join_date: now,
      last_active: now,
      created_at: now,
      updated_at: now
    };

    const result = await collection.insertOne(user);
    
    // Initialize user progress
    await getCollection('user_progress').insertOne({
      user_id: userId,
      total_study_time: 0,
      questions_answered: 0,
      topics_completed: [],
      streak_count: 0,
      xp_points: 0,
      level: 1,
      last_study_date: null,
      created_at: now,
      updated_at: now
    });

    return { ...user, _id: result.insertedId };
  }

  static async findById(id: string): Promise<User | null> {
    const collection = this.getCollection();
    return await collection.findOne({ id });
  }

  static async findByEmail(email: string): Promise<User | null> {
    const collection = this.getCollection();
    return await collection.findOne({ email });
  }

  static async update(id: string, updateData: Partial<CreateUserData>): Promise<User | null> {
    const collection = this.getCollection();
    const now = new Date();

    const updateFields: any = {
      ...updateData,
      updated_at: now
    };

    await collection.updateOne(
      { id },
      { $set: updateFields }
    );

    return await this.findById(id);
  }

  static async updateLastActive(id: string): Promise<void> {
    const collection = this.getCollection();
    const now = new Date();

    await collection.updateOne(
      { id },
      { $set: { last_active: now } }
    );
  }

  static async delete(id: string): Promise<boolean> {
    const collection = this.getCollection();
    const result = await collection.deleteOne({ id });
    
    // Also delete related data
    await getCollection('user_progress').deleteMany({ user_id: id });
    await getCollection('timetables').deleteMany({ user_id: id });
    await getCollection('quiz_results').deleteMany({ user_id: id });
    await getCollection('learning_progress').deleteMany({ user_id: id });
    await getCollection('learning_path_enrollments').deleteMany({ user_id: id });
    await getCollection('study_sessions').deleteMany({ user_id: id });
    await getCollection('achievements').deleteMany({ user_id: id });
    await getCollection('notifications').deleteMany({ user_id: id });

    return result.deletedCount > 0;
  }

  static async list(limit: number = 100, offset: number = 0): Promise<User[]> {
    const collection = this.getCollection();
    return await collection
      .find({})
      .sort({ created_at: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();
  }

  static async count(): Promise<number> {
    const collection = this.getCollection();
    return await collection.countDocuments();
  }

  static async findByIds(ids: string[]): Promise<User[]> {
    const collection = this.getCollection();
    return await collection.find({ id: { $in: ids } }).toArray();
  }

  static async search(query: string, limit: number = 20): Promise<User[]> {
    const collection = this.getCollection();
    return await collection
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      })
      .limit(limit)
      .toArray();
  }
}
