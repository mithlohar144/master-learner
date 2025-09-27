import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'smartcode_mentor';

async function populateSampleData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('user_progress').deleteMany({});
    await db.collection('timetables').deleteMany({});
    await db.collection('quiz_results').deleteMany({});
    await db.collection('learning_progress').deleteMany({});
    await db.collection('achievements').deleteMany({});
    await db.collection('notifications').deleteMany({});
    
    // Sample Users
    console.log('👥 Creating sample users...');
    const users = [
      {
        id: uuidv4(),
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '+1-555-0123',
        location: 'San Francisco, CA',
        bio: 'Full-stack developer passionate about React and Node.js',
        avatar: '👨‍💻',
        experience: 'intermediate',
        time_commitment: 6,
        preferred_style: 'practical',
        goals: ['Interview Prep', 'Skill Enhancement', 'Career Growth'],
        focus_areas: ['Web Development', 'Data Structures & Algorithms'],
        subject_levels: {
          'Web Development': {
            level: 'intermediate',
            topics: ['React Development', 'Node.js & APIs', 'JavaScript Fundamentals']
          },
          'Data Structures & Algorithms': {
            level: 'beginner',
            topics: ['Arrays & Strings', 'Linked Lists', 'Stacks & Queues']
          }
        },
        social_links: {
          github: 'https://github.com/alexjohnson',
          linkedin: 'https://linkedin.com/in/alexjohnson',
          website: 'https://alexjohnson.dev'
        },
        join_date: new Date('2024-01-15'),
        last_active: new Date(),
        created_at: new Date('2024-01-15'),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        phone: '+1-555-0456',
        location: 'Seattle, WA',
        bio: 'Data scientist exploring machine learning and AI applications',
        avatar: '👩‍🔬',
        experience: 'advanced',
        time_commitment: 8,
        preferred_style: 'theoretical',
        goals: ['Research', 'Advanced Learning', 'Industry Expertise'],
        focus_areas: ['Machine Learning', 'System Design'],
        subject_levels: {
          'Machine Learning': {
            level: 'advanced',
            topics: ['Neural Networks', 'Deep Learning', 'NLP & Computer Vision']
          },
          'System Design': {
            level: 'intermediate',
            topics: ['Scaling & Performance', 'Message Queues & Caching', 'Load Balancing']
          }
        },
        social_links: {
          github: 'https://github.com/sarahchen',
          linkedin: 'https://linkedin.com/in/sarahchen'
        },
        join_date: new Date('2024-02-20'),
        last_active: new Date(),
        created_at: new Date('2024-02-20'),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Mike Rodriguez',
        email: 'mike.rodriguez@example.com',
        location: 'Austin, TX',
        bio: 'Computer science student preparing for technical interviews',
        avatar: '🎓',
        experience: 'beginner',
        time_commitment: 4,
        preferred_style: 'visual',
        goals: ['Interview Prep', 'Foundation Building'],
        focus_areas: ['Data Structures & Algorithms', 'Web Development'],
        subject_levels: {
          'Data Structures & Algorithms': {
            level: 'beginner',
            topics: ['Arrays & Strings', 'Linked Lists']
          },
          'Web Development': {
            level: 'beginner',
            topics: ['HTML & CSS', 'JavaScript Fundamentals']
          }
        },
        social_links: {
          github: 'https://github.com/mikerodriguez'
        },
        join_date: new Date('2024-03-10'),
        last_active: new Date(),
        created_at: new Date('2024-03-10'),
        updated_at: new Date()
      }
    ];
    
    await db.collection('users').insertMany(users);
    console.log(`✅ Created ${users.length} sample users`);
    
    // Sample User Progress
    console.log('📊 Creating user progress data...');
    const userProgress = users.map((user, index) => ({
      user_id: user.id,
      total_study_time: [180, 320, 95][index], // minutes
      questions_answered: [45, 78, 23][index],
      topics_completed: [
        ['Arrays & Strings', 'HTML & CSS'],
        ['Neural Networks', 'Load Balancing', 'React Development'],
        ['Arrays & Strings']
      ][index],
      streak_count: [7, 15, 3][index],
      xp_points: [2340, 4560, 890][index],
      level: [3, 5, 1][index],
      last_study_date: new Date(),
      created_at: user.created_at,
      updated_at: new Date()
    }));
    
    await db.collection('user_progress').insertMany(userProgress);
    console.log(`✅ Created ${userProgress.length} user progress records`);
    
    // Sample Quiz Results
    console.log('🧠 Creating quiz results...');
    const quizResults = [
      {
        user_id: users[0].id,
        quiz_type: 'timetable_assessment',
        total_accuracy: 78.5,
        subject_results: {
          'Web Development': {
            correct: 4,
            total: 5,
            accuracy: 80,
            topics: {
              'React Development': { correct: 2, total: 2, accuracy: 100 },
              'JavaScript Fundamentals': { correct: 2, total: 3, accuracy: 66.7 }
            }
          },
          'Data Structures & Algorithms': {
            correct: 3,
            total: 5,
            accuracy: 60,
            topics: {
              'Arrays & Strings': { correct: 2, total: 3, accuracy: 66.7 },
              'Linked Lists': { correct: 1, total: 2, accuracy: 50 }
            }
          }
        },
        topic_breakdown: {
          'React Development': { correct: 2, total: 2, accuracy: 100, subject: 'Web Development', difficulty: 'intermediate' },
          'JavaScript Fundamentals': { correct: 2, total: 3, accuracy: 66.7, subject: 'Web Development', difficulty: 'beginner' },
          'Arrays & Strings': { correct: 2, total: 3, accuracy: 66.7, subject: 'Data Structures & Algorithms', difficulty: 'beginner' },
          'Linked Lists': { correct: 1, total: 2, accuracy: 50, subject: 'Data Structures & Algorithms', difficulty: 'beginner' }
        },
        recommended_adjustments: {
          'Web Development': {
            currentLevel: 'intermediate',
            recommendedLevel: 'intermediate',
            reason: 'Maintain current level',
            accuracy: 80
          },
          'Data Structures & Algorithms': {
            currentLevel: 'beginner',
            recommendedLevel: 'beginner',
            reason: 'Continue building fundamentals',
            accuracy: 60
          }
        },
        time_taken: 480, // 8 minutes
        created_at: new Date()
      },
      {
        user_id: users[1].id,
        quiz_type: 'timetable_assessment',
        total_accuracy: 92.0,
        subject_results: {
          'Machine Learning': {
            correct: 9,
            total: 10,
            accuracy: 90,
            topics: {
              'Neural Networks': { correct: 5, total: 5, accuracy: 100 },
              'Deep Learning': { correct: 4, total: 5, accuracy: 80 }
            }
          }
        },
        topic_breakdown: {
          'Neural Networks': { correct: 5, total: 5, accuracy: 100, subject: 'Machine Learning', difficulty: 'advanced' },
          'Deep Learning': { correct: 4, total: 5, accuracy: 80, subject: 'Machine Learning', difficulty: 'advanced' }
        },
        recommended_adjustments: {
          'Machine Learning': {
            currentLevel: 'advanced',
            recommendedLevel: 'advanced',
            reason: 'Excellent performance at advanced level',
            accuracy: 90
          }
        },
        time_taken: 420, // 7 minutes
        created_at: new Date()
      }
    ];
    
    await db.collection('quiz_results').insertMany(quizResults);
    console.log(`✅ Created ${quizResults.length} quiz results`);
    
    // Sample Timetables
    console.log('📅 Creating sample timetables...');
    const timetables = [
      {
        user_id: users[0].id,
        title: 'Interview Prep - March 2024',
        schedule_type: 'daily',
        study_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        daily_hours: 6,
        timetable_data: {
          'Day Plan': [
            {
              subject: 'Web Development',
              duration: '90 mins',
              activity: 'Study: React Development (intermediate)',
              resources: {
                video: 'https://www.youtube.com/watch?v=bMknfKXIFA8 - React Course by freeCodeCamp',
                docs: 'React Official Docs + Hooks Guide',
                practice: 'N/A'
              }
            },
            {
              subject: 'Web Development',
              duration: '60 mins',
              activity: 'Practice: React Development',
              resources: {
                video: 'N/A',
                docs: 'N/A',
                practice: '3 React component projects'
              }
            },
            {
              subject: 'Data Structures & Algorithms',
              duration: '120 mins',
              activity: 'Study: Arrays & Strings (beginner)',
              resources: {
                video: 'https://www.youtube.com/watch?v=KLlXCFG5TnA - Arrays and Strings by NeetCode',
                docs: 'LeetCode Arrays Study Guide + GeeksforGeeks Arrays',
                practice: 'N/A'
              }
            },
            {
              subject: 'Data Structures & Algorithms',
              duration: '90 mins',
              activity: 'Practice: Arrays & Strings',
              resources: {
                video: 'N/A',
                docs: 'N/A',
                practice: '10 Array manipulation problems (Easy to Medium)'
              }
            }
          ],
          metadata: {
            totalStudyTime: 6,
            subjectCount: 2,
            topicCount: 4,
            generatedAt: new Date().toISOString(),
            studyTips: [
              'Take 5-minute breaks between study blocks',
              'Review previous day\'s topics before starting new ones',
              'Practice active recall during study sessions',
              'Use the Pomodoro technique for better focus'
            ]
          }
        },
        metadata: {
          totalStudyTime: 6,
          subjectCount: 2,
          topicCount: 4,
          generatedAt: new Date().toISOString()
        },
        created_at: new Date()
      }
    ];
    
    await db.collection('timetables').insertMany(timetables);
    console.log(`✅ Created ${timetables.length} sample timetables`);
    
    // Sample Achievements
    console.log('🏆 Creating sample achievements...');
    const achievements = [
      {
        user_id: users[0].id,
        achievement_id: 'first_quiz',
        title: 'Quiz Master',
        description: 'Completed your first knowledge assessment',
        xp_reward: 100,
        earned_at: new Date()
      },
      {
        user_id: users[0].id,
        achievement_id: 'week_streak',
        title: 'Week Warrior',
        description: 'Maintained a 7-day study streak',
        xp_reward: 250,
        earned_at: new Date()
      },
      {
        user_id: users[1].id,
        achievement_id: 'advanced_learner',
        title: 'Advanced Learner',
        description: 'Achieved 90%+ accuracy on advanced topics',
        xp_reward: 500,
        earned_at: new Date()
      },
      {
        user_id: users[1].id,
        achievement_id: 'two_week_streak',
        title: 'Consistency Champion',
        description: 'Maintained a 14-day study streak',
        xp_reward: 400,
        earned_at: new Date()
      }
    ];
    
    await db.collection('achievements').insertMany(achievements);
    console.log(`✅ Created ${achievements.length} achievements`);
    
    // Sample Notifications
    console.log('🔔 Creating sample notifications...');
    const notifications = [
      {
        user_id: users[0].id,
        type: 'achievement',
        title: 'New Achievement Unlocked! 🏆',
        message: 'Congratulations! You earned the "Week Warrior" badge for maintaining a 7-day streak.',
        read: false,
        created_at: new Date()
      },
      {
        user_id: users[0].id,
        type: 'reminder',
        title: 'Study Reminder 📚',
        message: 'Don\'t forget to complete your React Development session today!',
        read: false,
        created_at: new Date()
      },
      {
        user_id: users[1].id,
        type: 'milestone',
        title: 'Milestone Reached! 🎯',
        message: 'Amazing! You\'ve completed 5 advanced ML topics this month.',
        read: true,
        created_at: new Date(Date.now() - 86400000) // 1 day ago
      }
    ];
    
    await db.collection('notifications').insertMany(notifications);
    console.log(`✅ Created ${notifications.length} notifications`);
    
    // Sample Learning Progress
    console.log('📖 Creating learning progress data...');
    const learningProgress = [
      {
        user_id: users[0].id,
        module_id: '1',
        lesson_id: '1-1',
        progress: 100,
        completed: true,
        started_at: new Date('2024-03-01'),
        completed_at: new Date('2024-03-01'),
        last_accessed: new Date('2024-03-01')
      },
      {
        user_id: users[0].id,
        module_id: '1',
        lesson_id: '1-2',
        progress: 100,
        completed: true,
        started_at: new Date('2024-03-02'),
        completed_at: new Date('2024-03-02'),
        last_accessed: new Date('2024-03-02')
      },
      {
        user_id: users[0].id,
        module_id: '1',
        lesson_id: '1-3',
        progress: 60,
        completed: false,
        started_at: new Date('2024-03-03'),
        completed_at: null,
        last_accessed: new Date()
      },
      {
        user_id: users[1].id,
        module_id: '4',
        lesson_id: '4-1',
        progress: 100,
        completed: true,
        started_at: new Date('2024-02-25'),
        completed_at: new Date('2024-02-25'),
        last_accessed: new Date('2024-02-25')
      }
    ];
    
    await db.collection('learning_progress').insertMany(learningProgress);
    console.log(`✅ Created ${learningProgress.length} learning progress records`);
    
    console.log('\n🎉 Sample data population complete!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`📈 Progress Records: ${userProgress.length}`);
    console.log(`🧠 Quiz Results: ${quizResults.length}`);
    console.log(`📅 Timetables: ${timetables.length}`);
    console.log(`🏆 Achievements: ${achievements.length}`);
    console.log(`🔔 Notifications: ${notifications.length}`);
    console.log(`📖 Learning Progress: ${learningProgress.length}`);
    
    console.log('\n🔑 Sample User Credentials:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.experience} level`);
    });
    
  } catch (error) {
    console.error('❌ Error populating sample data:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
populateSampleData().catch(console.error);
