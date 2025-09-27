import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'smartcode_mentor';

export async function initializeDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    console.log(`🔗 Connecting to MongoDB at ${MONGODB_URI}...`);
    
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    
    // Test the connection
    await client.db('admin').command({ ping: 1 });
    
    db = client.db(DATABASE_NAME);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Using database: ${DATABASE_NAME}`);
    
    // Create indexes for better performance
    await createIndexes();
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

async function createIndexes() {
  if (!db) return;

  try {
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
    await db.collection('users').createIndex({ id: 1 }, { unique: true });
    await db.collection('users').createIndex({ last_active: -1 });

    // User progress indexes
    await db.collection('user_progress').createIndex({ user_id: 1 }, { unique: true });
    await db.collection('user_progress').createIndex({ user_id: 1, updated_at: -1 });

    // Timetables indexes
    await db.collection('timetables').createIndex({ user_id: 1 });
    await db.collection('timetables').createIndex({ user_id: 1, created_at: -1 });

    // Quiz results indexes
    await db.collection('quiz_results').createIndex({ user_id: 1 });
    await db.collection('quiz_results').createIndex({ user_id: 1, created_at: -1 });

    // Learning progress indexes
    await db.collection('learning_progress').createIndex({ user_id: 1, module_id: 1 });
    await db.collection('learning_progress').createIndex({ user_id: 1, module_id: 1, lesson_id: 1 }, { unique: true });

    // Learning path enrollments indexes
    await db.collection('learning_path_enrollments').createIndex({ user_id: 1, path_id: 1 }, { unique: true });

    // Study sessions indexes
    await db.collection('study_sessions').createIndex({ user_id: 1 });
    await db.collection('study_sessions').createIndex({ user_id: 1, started_at: -1 });

    // Achievements indexes
    await db.collection('achievements').createIndex({ user_id: 1 });
    await db.collection('achievements').createIndex({ user_id: 1, achievement_id: 1 }, { unique: true });

    // Notifications indexes
    await db.collection('notifications').createIndex({ user_id: 1 });
    await db.collection('notifications').createIndex({ user_id: 1, created_at: -1 });
    await db.collection('notifications').createIndex({ user_id: 1, read: 1 });

    console.log('✅ MongoDB indexes created successfully');
  } catch (error) {
    console.error('⚠️ Error creating indexes:', error);
  }
}

export async function getDatabase(): Promise<Db> {
  if (!db) {
    return await initializeDatabase();
  }
  return db;
}

export function getCollection<T = any>(collectionName: string): Collection<T> {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db.collection<T>(collectionName);
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('✅ MongoDB connection closed');
  }
}

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    if (!client) return false;
    await client.db('admin').command({ ping: 1 });
    return true;
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return false;
  }
}

// Get database stats
export async function getDatabaseStats() {
  try {
    if (!db) return null;
    
    const stats = await db.stats();
    const collections = await db.listCollections().toArray();
    
    return {
      database: DATABASE_NAME,
      collections: collections.length,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      objects: stats.objects
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return null;
  }
}
