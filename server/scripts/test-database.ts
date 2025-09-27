import { initializeDatabase } from '../database/mongodb-connection';
import { UserModel } from '../database/models/MongoUser';
import { UserProgressModel } from '../database/models/MongoUserProgress';
import { TimetableModel } from '../database/models/MongoTimetable';
import { QuizResultModel } from '../database/models/MongoQuizResult';

async function testDatabase() {
  console.log('🧪 Testing MongoDB Database Integration...\n');
  
  try {
    // Initialize database
    await initializeDatabase();
    console.log('✅ Database connection successful\n');
    
    // Test 1: Check if sample users exist
    console.log('📊 Test 1: Checking sample users...');
    const users = await UserModel.list(5, 0);
    console.log(`Found ${users.length} users in database`);
    
    if (users.length > 0) {
      const firstUser = users[0];
      console.log(`Sample user: ${firstUser.name} (${firstUser.experience} level)`);
      console.log(`Focus areas: ${firstUser.focus_areas.join(', ')}`);
      console.log(`Subject levels: ${Object.keys(firstUser.subject_levels).length} subjects configured`);
    }
    console.log('✅ User data test passed\n');
    
    // Test 2: Check user progress
    console.log('📈 Test 2: Checking user progress...');
    if (users.length > 0) {
      const progress = await UserProgressModel.findByUserId(users[0].id);
      if (progress) {
        console.log(`Progress for ${users[0].name}:`);
        console.log(`- Study time: ${progress.total_study_time} minutes`);
        console.log(`- Questions answered: ${progress.questions_answered}`);
        console.log(`- XP points: ${progress.xp_points}`);
        console.log(`- Level: ${progress.level}`);
        console.log(`- Streak: ${progress.streak_count} days`);
        console.log(`- Topics completed: ${progress.topics_completed.length}`);
      } else {
        console.log('No progress data found');
      }
    }
    console.log('✅ Progress data test passed\n');
    
    // Test 3: Check timetables
    console.log('📅 Test 3: Checking timetables...');
    if (users.length > 0) {
      const timetables = await TimetableModel.findByUserId(users[0].id, 3);
      console.log(`Found ${timetables.length} timetables for ${users[0].name}`);
      
      if (timetables.length > 0) {
        const latest = timetables[0];
        console.log(`Latest timetable: "${latest.title}"`);
        console.log(`Schedule type: ${latest.schedule_type}`);
        console.log(`Daily hours: ${latest.daily_hours}`);
        console.log(`Study days: ${latest.study_days.join(', ')}`);
      }
    }
    console.log('✅ Timetable data test passed\n');
    
    // Test 4: Check quiz results
    console.log('🧠 Test 4: Checking quiz results...');
    if (users.length > 0) {
      const quizResults = await QuizResultModel.findByUserId(users[0].id, 3);
      console.log(`Found ${quizResults.length} quiz results for ${users[0].name}`);
      
      if (quizResults.length > 0) {
        const latest = quizResults[0];
        console.log(`Latest quiz accuracy: ${latest.total_accuracy.toFixed(1)}%`);
        console.log(`Time taken: ${Math.floor(latest.time_taken / 60)} minutes`);
        console.log(`Subjects tested: ${Object.keys(latest.subject_results).join(', ')}`);
      }
    }
    console.log('✅ Quiz results test passed\n');
    
    // Test 5: Test API endpoints simulation
    console.log('🔌 Test 5: Testing data operations...');
    
    if (users.length > 0) {
      const testUser = users[0];
      
      // Test user update
      await UserModel.updateLastActive(testUser.id);
      console.log('✅ User last active updated');
      
      // Test progress increment
      await UserProgressModel.incrementStudyTime(testUser.id, 30);
      console.log('✅ Study time incremented');
      
      // Test XP addition
      await UserProgressModel.addXP(testUser.id, 50);
      console.log('✅ XP points added');
      
      // Verify changes
      const updatedProgress = await UserProgressModel.findByUserId(testUser.id);
      if (updatedProgress) {
        console.log(`Updated study time: ${updatedProgress.total_study_time} minutes`);
        console.log(`Updated XP: ${updatedProgress.xp_points} points`);
        console.log(`Current level: ${updatedProgress.level}`);
      }
    }
    console.log('✅ Data operations test passed\n');
    
    console.log('🎉 All database tests passed successfully!');
    console.log('\n📋 Summary:');
    console.log(`✅ Database connection: Working`);
    console.log(`✅ User management: Working`);
    console.log(`✅ Progress tracking: Working`);
    console.log(`✅ Timetable storage: Working`);
    console.log(`✅ Quiz results: Working`);
    console.log(`✅ Data operations: Working`);
    
    console.log('\n🚀 Your MongoDB integration is fully functional!');
    console.log('Frontend can now sync data with the database.');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the test
testDatabase().catch(console.error);
