import { RequestHandler } from "express";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'coding' | 'quiz' | 'algorithm';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subject: string;
  topic: string;
  estimatedTime: number;
  xpReward: number;
  testCases?: TestCase[];
  questions?: QuizQuestion[];
}

interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ChallengeSubmission {
  challengeId: string;
  userId: string;
  code?: string;
  answers?: number[];
  submittedAt: Date;
  result: {
    passed: boolean;
    score: number;
    accuracy?: number;
    executionTime?: number;
    feedback: string;
  };
}

// In-memory storage for demo (replace with database in production)
const challenges: Challenge[] = [
  {
    id: 'dsa-two-sum',
    title: 'Two Sum Problem',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    type: 'coding',
    difficulty: 'beginner',
    subject: 'Data Structures & Algorithms',
    topic: 'Arrays',
    estimatedTime: 15,
    xpReward: 50,
    testCases: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        expectedOutput: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ]
  },
  {
    id: 'web-responsive-layout',
    title: 'Responsive Card Layout',
    description: 'Create a responsive card layout that adapts to different screen sizes using CSS Grid and Flexbox.',
    type: 'coding',
    difficulty: 'beginner',
    subject: 'Web Development',
    topic: 'HTML/CSS',
    estimatedTime: 30,
    xpReward: 60,
    testCases: [
      {
        input: 'Desktop view (1200px+)',
        expectedOutput: '4 cards per row',
        explanation: 'Cards should display in a 4-column grid on large screens'
      },
      {
        input: 'Tablet view (768px-1199px)',
        expectedOutput: '2 cards per row',
        explanation: 'Cards should display in a 2-column grid on medium screens'
      },
      {
        input: 'Mobile view (<768px)',
        expectedOutput: '1 card per row',
        explanation: 'Cards should stack vertically on small screens'
      }
    ]
  },
  {
    id: 'dsa-tree-quiz',
    title: 'Binary Tree Traversal Quiz',
    description: 'Test your knowledge of different binary tree traversal methods.',
    type: 'quiz',
    difficulty: 'intermediate',
    subject: 'Data Structures & Algorithms',
    topic: 'Trees',
    estimatedTime: 10,
    xpReward: 40,
    questions: [
      {
        question: 'In which traversal method do we visit the root node first?',
        options: ['Inorder', 'Preorder', 'Postorder', 'Level-order'],
        correctAnswer: 1,
        explanation: 'Preorder traversal visits the root node first, then left subtree, then right subtree.'
      },
      {
        question: 'What is the time complexity of searching in a balanced binary search tree?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 1,
        explanation: 'In a balanced BST, the height is log n, so search operations take O(log n) time.'
      }
    ]
  }
];

const submissions: ChallengeSubmission[] = [];

export const getChallenges: RequestHandler = (req, res) => {
  try {
    const { difficulty, subject, type } = req.query;
    
    let filteredChallenges = challenges;
    
    if (difficulty) {
      filteredChallenges = filteredChallenges.filter(c => c.difficulty === difficulty);
    }
    
    if (subject) {
      filteredChallenges = filteredChallenges.filter(c => c.subject === subject);
    }
    
    if (type) {
      filteredChallenges = filteredChallenges.filter(c => c.type === type);
    }
    
    res.json({
      success: true,
      challenges: filteredChallenges
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch challenges'
    });
  }
};

export const getChallengeById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const challenge = challenges.find(c => c.id === id);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }
    
    res.json({
      success: true,
      challenge
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch challenge'
    });
  }
};

export const submitChallenge: RequestHandler = (req, res) => {
  try {
    const { challengeId, userId, code, answers } = req.body;
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }
    
    let result;
    
    if (challenge.type === 'coding') {
      // Simulate code evaluation (in production, use a code execution service)
      result = evaluateCode(challenge, code);
    } else if (challenge.type === 'quiz') {
      result = evaluateQuiz(challenge, answers);
    } else {
      result = {
        passed: true,
        score: 85,
        feedback: 'Algorithm design looks good! Consider edge cases for optimization.'
      };
    }
    
    const submission: ChallengeSubmission = {
      challengeId,
      userId,
      code,
      answers,
      submittedAt: new Date(),
      result
    };
    
    submissions.push(submission);
    
    res.json({
      success: true,
      submission,
      xpEarned: result.passed ? challenge.xpReward : Math.floor(challenge.xpReward * 0.3)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to submit challenge'
    });
  }
};

export const getPersonalizedChallenges: RequestHandler = (req, res) => {
  try {
    const { experience, focusAreas } = req.query;
    
    let personalizedChallenges = challenges;
    
    // Filter by user's focus areas
    if (focusAreas) {
      const areas = Array.isArray(focusAreas) ? focusAreas : [focusAreas];
      personalizedChallenges = personalizedChallenges.filter(c => 
        areas.includes(c.subject)
      );
    }
    
    // Adjust difficulty based on experience
    if (experience === 'beginner') {
      personalizedChallenges = personalizedChallenges.filter(c => 
        c.difficulty === 'beginner' || c.difficulty === 'intermediate'
      );
    } else if (experience === 'intermediate') {
      personalizedChallenges = personalizedChallenges.filter(c => 
        c.difficulty === 'intermediate' || c.difficulty === 'advanced'
      );
    }
    
    // Sort by relevance and difficulty
    personalizedChallenges.sort((a, b) => {
      const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });
    
    res.json({
      success: true,
      challenges: personalizedChallenges.slice(0, 10), // Return top 10 recommendations
      totalAvailable: personalizedChallenges.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get personalized challenges'
    });
  }
};

export const getUserProgress: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    
    const userSubmissions = submissions.filter(s => s.userId === userId);
    const completedChallenges = userSubmissions.filter(s => s.result.passed);
    
    const totalXP = completedChallenges.reduce((sum, s) => {
      const challenge = challenges.find(c => c.id === s.challengeId);
      return sum + (challenge?.xpReward || 0);
    }, 0);
    
    const averageAccuracy = userSubmissions.length > 0 
      ? userSubmissions.reduce((sum, s) => sum + (s.result.accuracy || s.result.score), 0) / userSubmissions.length
      : 0;
    
    const subjectProgress = challenges.reduce((acc, challenge) => {
      const userSubmission = userSubmissions.find(s => s.challengeId === challenge.id);
      if (!acc[challenge.subject]) {
        acc[challenge.subject] = { completed: 0, total: 0 };
      }
      acc[challenge.subject].total++;
      if (userSubmission?.result.passed) {
        acc[challenge.subject].completed++;
      }
      return acc;
    }, {} as Record<string, { completed: number; total: number }>);
    
    res.json({
      success: true,
      progress: {
        completedChallenges: completedChallenges.length,
        totalChallenges: challenges.length,
        totalXP,
        averageAccuracy: Math.round(averageAccuracy),
        subjectProgress,
        recentSubmissions: userSubmissions.slice(-5).reverse()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get user progress'
    });
  }
};

// Helper functions for evaluation
function evaluateCode(challenge: Challenge, code: string) {
  // Simulate code evaluation
  const hasBasicStructure = code.includes('function') || code.includes('def') || code.includes('=>');
  const hasLoops = code.includes('for') || code.includes('while') || code.includes('map');
  const hasConditions = code.includes('if') || code.includes('?');
  
  let score = 0;
  let feedback = '';
  
  if (hasBasicStructure) score += 30;
  if (hasLoops) score += 35;
  if (hasConditions) score += 35;
  
  if (score >= 80) {
    feedback = 'Excellent solution! Your code demonstrates good problem-solving skills.';
  } else if (score >= 60) {
    feedback = 'Good attempt! Consider optimizing your approach for better performance.';
  } else {
    feedback = 'Keep practicing! Review the problem requirements and try again.';
  }
  
  return {
    passed: score >= 60,
    score,
    accuracy: score,
    executionTime: Math.random() * 100 + 50, // Simulated execution time
    feedback
  };
}

function evaluateQuiz(challenge: Challenge, answers: number[]) {
  if (!challenge.questions || !answers) {
    return {
      passed: false,
      score: 0,
      accuracy: 0,
      feedback: 'Invalid quiz submission'
    };
  }
  
  let correctAnswers = 0;
  challenge.questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correctAnswers++;
    }
  });
  
  const accuracy = (correctAnswers / challenge.questions.length) * 100;
  const passed = accuracy >= 60;
  
  return {
    passed,
    score: Math.round(accuracy),
    accuracy: Math.round(accuracy),
    feedback: passed 
      ? `Great job! You got ${correctAnswers}/${challenge.questions.length} questions correct.`
      : `You got ${correctAnswers}/${challenge.questions.length} questions correct. Review the topics and try again.`
  };
}
