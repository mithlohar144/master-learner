import { RequestHandler } from "express";
import { TimeTableRequest, TimeTableResponse, TimeTableBlock, SubjectLevel } from "@shared/api";
import { TimetableModel } from "../database/models/MongoTimetable";
import { UserModel } from "../database/models/MongoUser";
import { UserProgressModel } from "../database/models/MongoUserProgress";

// Enhanced topic-specific resources mapping with more comprehensive content
const TOPIC_RESOURCES: Record<string, { video: string; docs: string; practice: string; estimatedTime?: string; difficulty?: string }> = {
  // DSA Topics
  'Arrays & Strings': {
    video: 'https://www.youtube.com/watch?v=KLlXCFG5TnA - Arrays and Strings by NeetCode',
    docs: 'LeetCode Arrays Study Guide + GeeksforGeeks Arrays',
    practice: '10 Array manipulation problems (Easy to Medium)',
    estimatedTime: '45-60 mins',
    difficulty: 'Foundation'
  },
  'Linked Lists': {
    video: 'https://www.youtube.com/watch?v=njTh_OwMljA - Linked Lists by Abdul Bari',
    docs: 'GeeksforGeeks Linked List + Visualgo Interactive',
    practice: '8 Linked List problems (Easy to Medium)',
    estimatedTime: '40-50 mins',
    difficulty: 'Foundation'
  },
  'Stacks & Queues': {
    video: 'https://www.youtube.com/watch?v=wjI1WNcIntg - Stacks and Queues by mycodeschool',
    docs: 'Stack/Queue implementations + Use cases',
    practice: '6 Stack/Queue problems',
    estimatedTime: '35-45 mins',
    difficulty: 'Foundation'
  },
  'Trees & Graphs': {
    video: 'https://www.youtube.com/watch?v=oSWTXtMglKE - Binary Trees by William Fiset',
    docs: 'Tree Traversals + Graph Theory Basics',
    practice: '12 Tree/Graph problems (Medium)',
    estimatedTime: '60-75 mins',
    difficulty: 'Intermediate'
  },
  'Dynamic Programming': {
    video: 'https://www.youtube.com/watch?v=oBt53YbR9Kk - DP by Aditya Verma',
    docs: 'DP Patterns + State Transition Guide',
    practice: '15 DP problems (Medium to Hard)',
    estimatedTime: '90-120 mins',
    difficulty: 'Advanced'
  },

  // Web Development Topics
  'HTML & CSS': {
    video: 'https://www.youtube.com/watch?v=mU6anWqZJcc - HTML CSS Full Course by freeCodeCamp',
    docs: 'MDN Web Docs + CSS Grid/Flexbox Guide',
    practice: '5 responsive layout projects',
    estimatedTime: '60-90 mins',
    difficulty: 'Foundation'
  },
  'JavaScript Fundamentals': {
    video: 'https://www.youtube.com/watch?v=PkZNo7MFNFg - JavaScript Complete Guide by freeCodeCamp',
    docs: 'MDN JavaScript Guide + ES6+ Features',
    practice: '10 JS coding challenges',
    estimatedTime: '75-90 mins',
    difficulty: 'Foundation'
  },
  'React Development': {
    video: 'https://www.youtube.com/watch?v=bMknfKXIFA8 - React Course by freeCodeCamp',
    docs: 'React Official Docs + Hooks Guide',
    practice: '3 React component projects',
    estimatedTime: '90-120 mins',
    difficulty: 'Intermediate'
  },
  'Node.js & APIs': {
    video: 'https://www.youtube.com/watch?v=RLtyhwFtXQA - Node.js by Traversy Media',
    docs: 'Node.js Docs + Express.js Guide',
    practice: '2 REST API projects',
    estimatedTime: '80-100 mins',
    difficulty: 'Intermediate'
  },

  // Machine Learning Topics
  'Python & NumPy': {
    video: 'https://www.youtube.com/watch?v=QUT1VHiLmmI - NumPy Tutorial by Keith Galli',
    docs: 'NumPy Documentation + Pandas Guide',
    practice: '8 data manipulation exercises',
    estimatedTime: '50-70 mins',
    difficulty: 'Foundation'
  },
  'Linear Regression': {
    video: 'https://www.youtube.com/watch?v=nk2CQITm_eo - Linear Regression by StatQuest',
    docs: 'Scikit-learn Linear Models Guide',
    practice: '4 regression projects',
    estimatedTime: '60-80 mins',
    difficulty: 'Foundation'
  },
  'Neural Networks': {
    video: 'https://www.youtube.com/watch?v=aircAruvnKk - Neural Networks by 3Blue1Brown',
    docs: 'TensorFlow/PyTorch Tutorials',
    practice: '3 neural network implementations',
    estimatedTime: '100-130 mins',
    difficulty: 'Advanced'
  },

  // System Design Topics
  'Client-Server Architecture': {
    video: 'https://www.youtube.com/watch?v=L5BlpPU_muY - System Design by Gaurav Sen',
    docs: 'System Design Primer + Architecture Patterns',
    practice: '2 system design case studies',
    estimatedTime: '70-90 mins',
    difficulty: 'Foundation'
  },
  'Load Balancing': {
    video: 'https://www.youtube.com/watch?v=K0Ta65OqQkY - Load Balancers by Gaurav Sen',
    docs: 'Load Balancing Strategies + Implementation',
    practice: '1 load balancer design exercise',
    estimatedTime: '60-75 mins',
    difficulty: 'Intermediate'
  },
  'Distributed Systems': {
    video: 'https://www.youtube.com/watch?v=UEAMfLPZZhE - Distributed Systems by Martin Kleppmann',
    docs: 'Designing Data-Intensive Applications',
    practice: '2 distributed system designs',
    estimatedTime: '120-150 mins',
    difficulty: 'Advanced'
  }
};

// Enhanced function to create personalized study blocks based on user's topic selection
const createPersonalizedStudyBlocks = (subject: string, totalMinutes: number, subjectLevel?: SubjectLevel): TimeTableBlock[] => {
    const blocks: TimeTableBlock[] = [];
    if (totalMinutes <= 0) return blocks;

    // If user has specific topic preferences, use them
    if (subjectLevel && subjectLevel.topics && subjectLevel.topics.length > 0) {
        const topics = subjectLevel.topics;
        const minutesPerTopic = Math.floor(totalMinutes / topics.length);
        const difficultyLevel = subjectLevel.level;

        topics.forEach((topic, index) => {
            // Adjust time based on difficulty (advanced topics get more time)
            let topicTime = minutesPerTopic;
            if (difficultyLevel === 'advanced') {
                topicTime = Math.floor(topicTime * 1.5);
            } else if (difficultyLevel === 'intermediate') {
                topicTime = Math.floor(topicTime * 1.2);
            }

            // Ensure 30% practice time for each topic
            const topicPracticeTime = Math.floor(topicTime * 0.3);
            const topicStudyTime = topicTime - topicPracticeTime;

            // Create study block for this topic
            if (topicStudyTime > 0) {
                const resources = TOPIC_RESOURCES[topic] || {
                    video: `YouTube: ${topic} - ${difficultyLevel} level`,
                    docs: `${topic} Documentation`,
                    practice: `Practice ${topic} problems`
                };

                blocks.push({
                    subject,
                    duration: `${topicStudyTime} mins`,
                    activity: `Study: ${topic} (${difficultyLevel})`,
                    resources: {
                        video: resources.video,
                        docs: resources.docs,
                        practice: "N/A"
                    }
                });
            }

            // Create practice block for this topic
            if (topicPracticeTime > 0) {
                const resources = TOPIC_RESOURCES[topic] || {
                    video: "N/A",
                    docs: "N/A",
                    practice: `Practice ${topic} problems`
                };

                blocks.push({
                    subject,
                    duration: `${topicPracticeTime} mins`,
                    activity: `Practice: ${topic}`,
                    resources: {
                        video: "N/A",
                        docs: "N/A",
                        practice: resources.practice
                    }
                });
            }
        });
    } else {
        // Fallback to generic blocks if no specific topics
        return createGenericStudyBlocks(subject, totalMinutes);
    }

    // Sort blocks to prioritize study blocks first, then practice
    blocks.sort((a, b) => {
        const aIsPractice = a.activity.toLowerCase().includes('practice');
        const bIsPractice = b.activity.toLowerCase().includes('practice');
        if (aIsPractice !== bIsPractice) {
            return aIsPractice ? 1 : -1;
        }
        return Math.random() - 0.5;
    });

    return blocks;
};

// Fallback function for generic study blocks (backward compatibility)
const createGenericStudyBlocks = (subject: string, totalMinutes: number): TimeTableBlock[] => {
    const blocks: TimeTableBlock[] = [];
    if (totalMinutes <= 0) return blocks;

    // Ensure 30% of time is for practice
    const practiceMinutes = Math.floor(totalMinutes * 0.3);
    let studyMinutes = totalMinutes - practiceMinutes;

    // Create study blocks (25-45 mins)
    while (studyMinutes > 0) {
        const blockDuration = Math.min(studyMinutes, Math.floor(Math.random() * (45 - 25 + 1)) + 25);
        blocks.push({
            subject,
            duration: `${blockDuration} mins`,
            activity: `Study ${subject}`,
            resources: {
                video: `YouTube: ${subject} Basics`,
                docs: `Official Docs for ${subject}`,
                practice: "N/A",
            },
        });
        studyMinutes -= blockDuration;
    }

    // Create practice block
    if (practiceMinutes > 0) {
        blocks.push({
            subject,
            duration: `${practiceMinutes} mins`,
            activity: `Practice ${subject}`,
            resources: {
                video: "N/A",
                docs: "N/A",
                practice: `Practice questions for ${subject}`,
            },
        });
    }

    return blocks;
};

export const handleGenerateTimetable: RequestHandler = async (req, res) => {
  try {
    const request: TimeTableRequest = req.body;
    const { userId, isWeeklyUpdate, progressData } = req.body; // Extract additional data
    
    console.log('📅 Timetable generation request received:', JSON.stringify(request, null, 2));
    console.log('👤 User ID:', userId);
    console.log('🔄 Is Weekly Update:', isWeeklyUpdate);
    console.log('📊 Progress Data:', progressData);
    
    // Validate request
    if (!userId) {
      console.log('❌ No user ID provided');
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!request.daily_hours || request.daily_hours < 1 || request.daily_hours > 12) {
      return res.status(400).json({ error: 'Daily hours must be between 1 and 12' });
    }

    if (!request.self_rating) {
      return res.status(400).json({ error: 'Self rating is required' });
    }

    if (!request.goal) {
      return res.status(400).json({ error: 'Goal is required' });
    }

    // Get user data from database (optional - create if doesn't exist)
    let user = await UserModel.findById(userId);
    if (!user) {
      console.log('User not found, creating temporary user for timetable generation');
      // For demo purposes, we'll continue without requiring a user in database
      // In production, you might want to create the user or handle this differently
    }

    const subjects = Object.keys(request.self_rating);
    const weaknessScores: Record<string, number> = {};
    let totalWeakness = 0;

    // Enhanced weakness calculation considering difficulty level and progress data
    for (const subject of subjects) {
        const rating = request.self_rating[subject] || 3;
        const score = request.quiz_scores?.[subject] || 50;
        const subjectLevel = request.subject_levels?.[subject];
        
        // Base weakness calculation
        let weakness = (6 - rating) * 0.5 + (100 - score) * 0.05;
        
        // Adjust weakness based on chosen difficulty level
        if (subjectLevel) {
            const difficultyMultiplier = {
                'beginner': 1.0,    // Standard weight
                'intermediate': 1.2, // Slightly more focus
                'advanced': 1.5      // More focus for advanced topics
            };
            weakness *= difficultyMultiplier[subjectLevel.level];
        }

        // Adaptive adjustment based on weekly progress (if this is a weekly update)
        if (isWeeklyUpdate && progressData && progressData[subject]) {
            const progress = progressData[subject];
            const progressMultiplier = progress.accuracy < 50 ? 1.5 : // Increase focus if low progress
                                    progress.accuracy > 80 ? 0.8 : // Reduce focus if high progress
                                    1.0; // Standard focus
            weakness *= progressMultiplier;
            console.log(`📊 Adaptive adjustment for ${subject}: ${progress.accuracy}% accuracy, multiplier: ${progressMultiplier}`);
        }
        
        weaknessScores[subject] = weakness;
        totalWeakness += weakness;
    }

    const allocatedHours: Record<string, number> = {};
    for (const subject of subjects) {
        const weight = weaknessScores[subject] / totalWeakness;
        allocatedHours[subject] = request.daily_hours * weight;
    }

    let dayPlan: TimeTableBlock[] = [];
    for (const subject of subjects) {
        const totalMinutes = Math.round(allocatedHours[subject] * 60);
        const subjectLevel = request.subject_levels?.[subject];
        const subjectBlocks = createPersonalizedStudyBlocks(subject, totalMinutes, subjectLevel);
        dayPlan = dayPlan.concat(subjectBlocks);
    }

    // Generate weekly plan if requested
    let weeklyPlan: Record<string, TimeTableBlock[]> = {};
    if (request.schedule_type === 'weekly' && request.study_days) {
        for (const day of request.study_days) {
            weeklyPlan[day] = [...dayPlan]; // Copy day plan for each study day
        }
    }

    // Create metadata with adaptive information
    const metadata = {
        totalStudyTime: `${request.daily_hours} hours`,
        subjectsCount: subjects.length,
        topicsCount: Object.values(request.subject_levels || {}).reduce((acc, level) => acc + level.topics.length, 0),
        recommendedBreaks: [
            "Take 5-minute breaks between study blocks",
            "Review previous day's topics before starting new ones",
            "Practice active recall during study sessions",
            "Use the Pomodoro technique for better focus",
            ...(isWeeklyUpdate ? ["📅 This is your weekly adaptive update based on progress"] : []),
            ...(progressData ? [`📊 Focus areas adjusted based on ${Object.keys(progressData).length} subjects' performance`] : [])
        ]
    };

    const response: TimeTableResponse = {
        "Day Plan": dayPlan,
        ...(request.schedule_type === 'weekly' ? { "Weekly Plan": weeklyPlan } : {}),
        metadata
    };

    // Save timetable to database (only if user exists)
    try {
      await TimetableModel.create({
          user_id: userId,
          title: `${request.goal} - ${new Date().toLocaleDateString()}`,
          schedule_type: request.schedule_type || 'daily',
          study_days: request.study_days || [],
          daily_hours: request.daily_hours,
          timetable_data: response,
          metadata
      });
      console.log('Timetable saved to database');
    } catch (dbError) {
      console.log('Failed to save timetable to database:', dbError.message);
      // Continue anyway - don't fail the request
    }

    // Update user's last active timestamp (only if user exists)
    if (user) {
      try {
        await UserModel.updateLastActive(userId);
      } catch (updateError) {
        console.log('Failed to update user last active:', updateError.message);
      }
    }

    console.log('✅ Timetable generated successfully:', {
      dayPlanBlocks: response["Day Plan"].length,
      weeklyPlan: !!response["Weekly Plan"],
      metadata: response.metadata
    });

    res.json(response);
  } catch (error) {
    console.error('Error generating timetable:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
