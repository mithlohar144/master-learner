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
          question: "What is the main advantage of linked lists over arrays?",
          options: ["Faster access time", "Dynamic size", "Better cache locality", "Less memory usage"],
          correctAnswer: "Dynamic size",
          explanation: "Linked lists can grow and shrink during runtime, unlike arrays which have fixed size."
        }
      ]
    }
  },
  "Web Development": {
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
    },
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
          explanation: "The <a> tag is used to create hyperlinks in HTML."
        },
        {
          id: "web_html_b2",
          subject: "Web Development",
          topic: "HTML & CSS",
          difficulty: "beginner",
          question: "What does CSS stand for?",
          options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
          correctAnswer: "Cascading Style Sheets",
          explanation: "CSS stands for Cascading Style Sheets, used for styling web pages."
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
    },
    "Fundamentals": {
      beginner: [
        {
          id: "ml_fund_b1",
          subject: "Machine Learning",
          topic: "Fundamentals",
          difficulty: "beginner",
          question: "What is supervised learning?",
          options: ["Learning without labeled data", "Learning with labeled training data", "Learning by trial and error", "Learning from user feedback"],
          correctAnswer: "Learning with labeled training data",
          explanation: "Supervised learning uses labeled training data to learn patterns and make predictions."
        },
        {
          id: "ml_fund_b2",
          subject: "Machine Learning",
          topic: "Fundamentals",
          difficulty: "beginner",
          question: "Which of these is a classification algorithm?",
          options: ["Linear Regression", "Decision Tree", "K-Means", "PCA"],
          correctAnswer: "Decision Tree",
          explanation: "Decision Tree is a classification algorithm that creates a tree-like model of decisions."
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
    },
    "Scalability": {
      beginner: [
        {
          id: "sys_scale_b1",
          subject: "System Design",
          topic: "Scalability",
          difficulty: "beginner",
          question: "What is horizontal scaling?",
          options: ["Adding more power to existing servers", "Adding more servers to the pool", "Reducing server load", "Optimizing database queries"],
          correctAnswer: "Adding more servers to the pool",
          explanation: "Horizontal scaling means adding more servers to handle increased load."
        },
        {
          id: "sys_scale_b2",
          subject: "System Design",
          topic: "Scalability",
          difficulty: "beginner",
          question: "What is a load balancer?",
          options: ["A database optimization tool", "A server monitoring system", "A system that distributes incoming requests", "A caching mechanism"],
          correctAnswer: "A system that distributes incoming requests",
          explanation: "A load balancer distributes incoming network traffic across multiple servers."
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
      
      console.log(`🔍 Processing subject: ${subject}`, {
        hasSubjectBank: !!subjectBank,
        availableSubjects: Object.keys(QUESTION_BANK),
        subjectLevel: subjectLevel
      });
      
      if (!subjectBank) {
        console.log(`❌ No question bank found for subject: ${subject}`);
        continue;
      }

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

    // Fallback: If no questions found, get some default questions
    if (finalQuestions.length === 0) {
      console.log('⚠️ No questions found for requested subjects, using fallback questions');
      const fallbackQuestions: QuizQuestion[] = [];
      
      // Get questions from any available subject
      Object.values(QUESTION_BANK).forEach(subjectBank => {
        Object.values(subjectBank).forEach(topicBank => {
          Object.values(topicBank).forEach(difficultyQuestions => {
            fallbackQuestions.push(...difficultyQuestions);
          });
        });
      });
      
      const selectedFallback = fallbackQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, questionLimit);
      
      finalQuestions.push(...selectedFallback);
    }

    // Ensure we don't exceed the question limit
    const limitedQuestions = finalQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, questionLimit);

    console.log(`📊 Final quiz stats:`, {
      totalQuestionsGenerated: finalQuestions.length,
      limitedQuestionsCount: limitedQuestions.length,
      questionLimit: questionLimit
    });

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

    // Find the questions from the question bank
    const allQuestions: QuizQuestion[] = [];
    Object.values(QUESTION_BANK).forEach(subjectBank => {
      Object.values(subjectBank).forEach(topicBank => {
        Object.values(topicBank).forEach(difficultyQuestions => {
          allQuestions.push(...difficultyQuestions);
        });
      });
    });

    const questionMap = new Map(allQuestions.map(q => [q.id, q]));
    
    let correctAnswers = 0;
    const subjectResults: Record<string, any> = {};
    const topicBreakdown: Record<string, any> = {};
    
    // Evaluate each answer
    for (const questionId of submission.questionIds) {
      const question = questionMap.get(questionId);
      const userAnswer = submission.answers[questionId];
      
      if (!question) continue;
      
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      // Track by subject
      if (!subjectResults[question.subject]) {
        subjectResults[question.subject] = {
          correct: 0,
          total: 0,
          accuracy: 0,
          topics: {}
        };
      }
      
      subjectResults[question.subject].total++;
      if (isCorrect) subjectResults[question.subject].correct++;
      
      // Track by topic within subject
      if (!subjectResults[question.subject].topics[question.topic]) {
        subjectResults[question.subject].topics[question.topic] = {
          correct: 0,
          total: 0,
          accuracy: 0
        };
      }
      
      subjectResults[question.subject].topics[question.topic].total++;
      if (isCorrect) subjectResults[question.subject].topics[question.topic].correct++;
    }
    
    // Calculate accuracies
    Object.keys(subjectResults).forEach(subject => {
      const subjectData = subjectResults[subject];
      subjectData.accuracy = Math.round((subjectData.correct / subjectData.total) * 100);
      
      Object.keys(subjectData.topics).forEach(topic => {
        const topicData = subjectData.topics[topic];
        topicData.accuracy = Math.round((topicData.correct / topicData.total) * 100);
      });
    });
    
    const totalAccuracy = Math.round((correctAnswers / submission.questionIds.length) * 100);
    
    // Generate recommendations
    const recommendedAdjustments: Record<string, any> = {};
    Object.keys(subjectResults).forEach(subject => {
      const accuracy = subjectResults[subject].accuracy;
      let recommendedLevel = 'beginner';
      let reason = '';
      
      if (accuracy >= 80) {
        recommendedLevel = 'advanced';
        reason = 'Excellent performance! Ready for advanced challenges.';
      } else if (accuracy >= 60) {
        recommendedLevel = 'intermediate';
        reason = 'Good understanding. Ready for intermediate level.';
      } else {
        recommendedLevel = 'beginner';
        reason = 'Focus on fundamentals to build a strong foundation.';
      }
      
      recommendedAdjustments[subject] = {
        currentLevel: 'beginner', // Default assumption
        recommendedLevel,
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
      totalQuestions: submission.questionIds.length,
      timeSpent: submission.timeSpent
    };

    // Save to database if models are available
    try {
      if (QuizResultModel) {
        await QuizResultModel.create({
          userId,
          submission,
          result,
          createdAt: new Date()
        });
      }
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Continue without failing the request
    }

    res.json(result);
  } catch (error) {
    console.error('Error evaluating quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
