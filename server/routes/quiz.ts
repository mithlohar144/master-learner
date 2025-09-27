import { RequestHandler } from "express";
import { QuizRequest, QuizResponse, QuizSubmission, QuizResult, QuizQuestion } from "@shared/api";
import { QuizResultModel } from "../database/models/MongoQuizResult";
import { UserModel } from "../database/models/MongoUser";
import { UserProgressModel } from "../database/models/MongoUserProgress";

// Comprehensive question bank organized by subject, topic, and difficulty
export const QUESTION_BANK: Record<string, Record<string, Record<string, QuizQuestion[]>>> = {
  "Data Structures & Algorithms": {
    "Arrays & Strings": {
      beginner: [
        {
          id: "dsa_arrays_b1",
          subject: "Data Structures & Algorithms",
          topic: "Arrays & Strings",
          difficulty: "beginner",
          question: "What is the time complexity of accessing an element in an array by index?",
          options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
          correctAnswer: "O(1)",
          explanation: "Array access by index is constant time O(1) because arrays store elements in contiguous memory locations."
        },
        {
          id: "dsa_arrays_b2",
          subject: "Data Structures & Algorithms",
          topic: "Arrays & Strings",
          difficulty: "beginner",
          question: "Which method would you use to add an element to the end of an array in JavaScript?",
          options: ["push()", "pop()", "shift()", "unshift()"],
          correctAnswer: "push()",
          explanation: "The push() method adds one or more elements to the end of an array and returns the new length."
        }
      ],
      intermediate: [
        {
          id: "dsa_arrays_i1",
          subject: "Data Structures & Algorithms",
          topic: "Arrays & Strings",
          difficulty: "intermediate",
          question: "What is the optimal time complexity for finding two numbers in a sorted array that sum to a target?",
          options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"],
          correctAnswer: "O(n)",
          explanation: "Using the two-pointer technique on a sorted array, we can find the pair in O(n) time."
        }
      ]
    },
    "Linked Lists": {
      beginner: [
        {
          id: "dsa_linked_b1",
          subject: "Data Structures & Algorithms",
          topic: "Linked Lists",
          difficulty: "beginner",
          question: "What is the main advantage of a linked list over an array?",
          options: ["Faster access", "Dynamic size", "Less memory usage", "Better cache performance"],
          correctAnswer: "Dynamic size",
          explanation: "Linked lists can grow or shrink during runtime, unlike arrays which have fixed size."
        }
      ]
    }
  },
  "Web Development": {
    "HTML & CSS": {
      beginner: [
        {
          id: "web_html_b1",
          subject: "Web Development",
          topic: "HTML & CSS",
          difficulty: "beginner",
          question: "Which HTML tag is used to create a hyperlink?",
          options: ["<link>", "<a>", "<href>", "<url>"],
          correctAnswer: "<a>",
          explanation: "The <a> (anchor) tag is used to create hyperlinks in HTML."
        }
      ]
    },
    "JavaScript Fundamentals": {
      beginner: [
        {
          id: "web_js_b1",
          subject: "Web Development",
          topic: "JavaScript Fundamentals",
          difficulty: "beginner",
          question: "What will 'typeof null' return in JavaScript?",
          options: ["'null'", "'undefined'", "'object'", "'boolean'"],
          correctAnswer: "'object'",
          explanation: "This is a well-known quirk in JavaScript. typeof null returns 'object' due to a bug in the original implementation."
        }
      ]
    }
  },
  "Machine Learning": {
    "Python & NumPy": {
      beginner: [
        {
          id: "ml_python_b1",
          subject: "Machine Learning",
          topic: "Python & NumPy",
          difficulty: "beginner",
          question: "Which NumPy function is used to create an array of zeros?",
          options: ["np.empty()", "np.zeros()", "np.ones()", "np.full()"],
          correctAnswer: "np.zeros()",
          explanation: "np.zeros() creates an array filled with zeros of the specified shape."
        }
      ]
    }
  },
  "System Design": {
    "Client-Server Architecture": {
      beginner: [
        {
          id: "sys_client_b1",
          subject: "System Design",
          topic: "Client-Server Architecture",
          difficulty: "beginner",
          question: "What is the primary role of a server in client-server architecture?",
          options: ["Display user interface", "Process requests and provide responses", "Store user preferences", "Handle user input"],
          correctAnswer: "Process requests and provide responses",
          explanation: "The server's main role is to process client requests and send back appropriate responses."
        }
      ]
    }
  }
};

// Generate quiz based on user preferences
export const generateQuiz: RequestHandler = (req, res) => {
  try {
    const request: QuizRequest = req.body;
    console.log('🎯 Quiz generation request received:', JSON.stringify(request, null, 2));
    
    if (!request.subjects || request.subjects.length === 0) {
      console.log('❌ No subjects provided in request');
      return res.status(400).json({ error: 'At least one subject must be selected' });
    }

    const finalQuestions: QuizQuestion[] = [];
    const questionLimit = 10;

    // Generate questions based on user's subject levels and topics
    for (const subject of request.subjects) {
      const subjectLevel = request.subject_levels?.[subject];
      const subjectBank = QUESTION_BANK[subject];
      
      if (!subjectBank) continue;

      if (subjectLevel && subjectLevel.topics.length > 0) {
        // User has specific topic preferences
        const questionsPerTopic = Math.max(1, Math.floor(questionLimit / (request.subjects.length * subjectLevel.topics.length)));
        
        for (const topic of subjectLevel.topics) {
          const topicBank = subjectBank[topic];
          if (!topicBank) continue;

          const difficultyQuestions = topicBank[subjectLevel.level] || [];
          const selectedQuestions = difficultyQuestions
            .sort(() => Math.random() - 0.5)
            .slice(0, questionsPerTopic);
          
          finalQuestions.push(...selectedQuestions);
        }
      } else {
        // Fallback to general questions for the subject
        const allSubjectQuestions: QuizQuestion[] = [];
        Object.values(subjectBank).forEach(topicBank => {
          Object.values(topicBank).forEach(difficultyQuestions => {
            allSubjectQuestions.push(...difficultyQuestions);
          });
        });
        
        const questionsPerSubject = Math.floor(questionLimit / request.subjects.length);
        const selectedQuestions = allSubjectQuestions
          .sort(() => Math.random() - 0.5)
          .slice(0, questionsPerSubject);
        
        finalQuestions.push(...selectedQuestions);
      }
    }

    // Ensure we don't exceed the question limit
    const limitedQuestions = finalQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, questionLimit);

    const response: QuizResponse = {
      questions: limitedQuestions,
      timeLimit: 600, // 10 minutes
      totalQuestions: limitedQuestions.length,
      subjects: [...new Set(limitedQuestions.map(q => q.subject))],
      topics: [...new Set(limitedQuestions.map(q => q.topic))],
      difficulties: [...new Set(limitedQuestions.map(q => q.difficulty))]
    };
    
    console.log('✅ Quiz generated successfully:', {
      totalQuestions: response.totalQuestions,
      subjects: response.subjects,
      topics: response.topics
    });
    
    res.json(response);
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Evaluate quiz results and save to database
export const evaluateQuiz: RequestHandler = async (req, res) => {
  try {
    const submission: QuizSubmission = req.body;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!submission.answers || Object.keys(submission.answers).length === 0) {
      return res.status(400).json({ error: 'No answers provided' });
    }

    if (!submission.questionIds || submission.questionIds.length === 0) {
      return res.status(400).json({ error: 'Question IDs are required' });
    }

    // Verify user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the questions that were asked
    const questions: QuizQuestion[] = [];
    const questionIds = submission.questionIds;
    const answers = submission.answers;

    // Find questions by ID
    Object.values(QUESTION_BANK).forEach(subjectBank => {
      Object.values(subjectBank).forEach(topicBank => {
        Object.values(topicBank).forEach(difficultyQuestions => {
          difficultyQuestions.forEach(q => {
            if (questionIds.includes(q.id)) {
              questions.push(q);
            }
          });
        });
      });
    });

    if (questions.length === 0) {
      return res.status(400).json({ error: 'No valid questions found' });
    }

    let correctAnswers = 0;
    const subjectResults: Record<string, any> = {};
    const topicBreakdown: Record<string, any> = {};
    
    // Evaluate each answer
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctAnswers++;
      
      // Track subject-wise results
      if (!subjectResults[question.subject]) {
        subjectResults[question.subject] = {
          correct: 0,
          total: 0,
          accuracy: 0,
          topics: {}
        };
      }
      
      if (!subjectResults[question.subject].topics[question.topic]) {
        subjectResults[question.subject].topics[question.topic] = {
          correct: 0,
          total: 0,
          accuracy: 0
        };
      }
      
      // Track topic-wise results
      if (!topicBreakdown[question.topic]) {
        topicBreakdown[question.topic] = {
          correct: 0,
          total: 0,
          accuracy: 0,
          subject: question.subject,
          difficulty: question.difficulty
        };
      }
      
      subjectResults[question.subject].total++;
      subjectResults[question.subject].topics[question.topic].total++;
      topicBreakdown[question.topic].total++;
      
      if (isCorrect) {
        subjectResults[question.subject].correct++;
        subjectResults[question.subject].topics[question.topic].correct++;
        topicBreakdown[question.topic].correct++;
      }
    });

    // Calculate accuracies
    Object.keys(subjectResults).forEach(subject => {
      const subjectData = subjectResults[subject];
      subjectData.accuracy = (subjectData.correct / subjectData.total) * 100;
      
      Object.keys(subjectData.topics).forEach(topic => {
        const topicData = subjectData.topics[topic];
        topicData.accuracy = (topicData.correct / topicData.total) * 100;
      });
    });

    Object.keys(topicBreakdown).forEach(topic => {
      const topicData = topicBreakdown[topic];
      topicData.accuracy = (topicData.correct / topicData.total) * 100;
    });

    const totalAccuracy = (correctAnswers / questions.length) * 100;

    // Generate recommendations based on performance
    const recommendedAdjustments: Record<string, any> = {};
    
    Object.keys(subjectResults).forEach(subject => {
      const accuracy = subjectResults[subject].accuracy;
      const currentLevel = user.subject_levels?.[subject]?.level || 'beginner';
      
      let recommendation = currentLevel;
      let reason = 'Maintain current level';
      
      if (accuracy >= 85 && currentLevel === 'beginner') {
        recommendation = 'intermediate';
        reason = 'Strong performance suggests readiness for intermediate level';
      } else if (accuracy >= 85 && currentLevel === 'intermediate') {
        recommendation = 'advanced';
        reason = 'Excellent performance suggests readiness for advanced level';
      } else if (accuracy < 50 && currentLevel === 'intermediate') {
        recommendation = 'beginner';
        reason = 'Consider reviewing fundamentals before advancing';
      } else if (accuracy < 40 && currentLevel === 'advanced') {
        recommendation = 'intermediate';
        reason = 'May benefit from intermediate level review';
      }
      
      recommendedAdjustments[subject] = {
        currentLevel,
        recommendedLevel: recommendation,
        reason,
        accuracy
      };
    });

    const result: QuizResult = {
      totalAccuracy,
      subjectResults,
      topicBreakdown,
      recommendedAdjustments,
      correctAnswers,
      totalQuestions: questions.length,
      timeSpent: submission.timeSpent || 0
    };

    // Save quiz result to database
    await QuizResultModel.create({
      user_id: userId,
      quiz_type: 'timetable_assessment',
      total_accuracy: totalAccuracy,
      subject_results: subjectResults,
      topic_breakdown: topicBreakdown,
      recommended_adjustments: recommendedAdjustments,
      time_taken: submission.timeSpent || 0
    });

    // Update user progress - increment questions answered
    await UserProgressModel.incrementQuestionsAnswered(userId, questions.length);

    // Add XP based on performance
    const xpReward = Math.floor(totalAccuracy * 2) + (correctAnswers * 10);
    await UserProgressModel.addXP(userId, xpReward);

    // Update user's last active timestamp
    await UserModel.updateLastActive(userId);

    res.json(result);
  } catch (error) {
    console.error('Error evaluating quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
