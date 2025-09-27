/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
 export interface DemoResponse {
   message: string;
 }

 export interface DoubtResponse {
   explanation: string[];
   links: { title: string; href: string }[];
 }

export interface SubjectLevel {
  level: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
}

export interface TimeTableRequest {
  daily_hours: number;
  self_rating: Record<string, number>;
  quiz_scores: Record<string, number>;
  goal: string;
  subject_levels?: Record<string, SubjectLevel>; // Optional for backward compatibility
  schedule_type?: 'daily' | 'weekly'; // New option for schedule type
  study_days?: string[]; // Days of the week for study (e.g., ['Monday', 'Tuesday'])
}

export interface TimeTableBlock {
  subject: string;
  duration: string;
  activity: string;
  resources: {
    video: string;
    docs: string;
    practice: string;
  };
}

export interface TimeTableResponse {
  "Day Plan": TimeTableBlock[];
  "Weekly Plan"?: Record<string, TimeTableBlock[]>; // Optional weekly schedule
  metadata?: {
    totalStudyTime: string;
    subjectsCount: number;
    topicsCount: number;
    recommendedBreaks: string[];
  };
}

export interface UserProgress {
  userId: string;
  totalStudyTime: number;
  questionsAnswered: number;
  topicsCompleted: string[];
  streakCount: number;
  lastStudyDate: string;
  subjectProgress: Record<string, {
    timeSpent: number;
    questionsAnswered: number;
    accuracy: number;
    topicsCompleted: string[];
  }>;
  achievements: Array<{
    id: string;
    type: 'streak' | 'topic' | 'questions' | 'time';
    title: string;
    description: string;
    earnedAt: string;
    xpReward: number;
  }>;
  weeklyStats: Array<{
    date: string;
    studyTime: number;
    questionsAnswered: number;
  }>;
}

export interface ProgressUpdate {
  action: 'study_session' | 'question_answered' | 'topic_completed';
  subject?: string;
  topic?: string;
  timeSpent?: number;
  isCorrect?: boolean;
  sessionData?: any;
}

export interface NotificationItem {
  id: string;
  type: 'achievement' | 'reminder' | 'milestone';
  message: string;
  unread: boolean;
}

export interface QuizQuestion {
  id: string;
  subject: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizRequest {
  subjects: string[];
  subject_levels?: Record<string, SubjectLevel>;
}

export interface QuizResponse {
  questions: QuizQuestion[];
  timeLimit: number; // in seconds
  totalQuestions: number;
  subjects: string[];
  topics: string[];
  difficulties: string[];
}

export interface QuizSubmission {
  answers: Record<string, string>; // questionId -> selectedAnswer
  questionIds: string[];
  timeSpent: number; // in seconds
}

export interface QuizResult {
  totalAccuracy: number;
  subjectResults: Record<string, {
    correct: number;
    total: number;
    accuracy: number;
    topics: Record<string, { correct: number; total: number; accuracy: number }>;
  }>;
  topicBreakdown: Record<string, any>;
  recommendedAdjustments: Record<string, {
    currentLevel: string;
    recommendedLevel: string;
    reason: string;
    accuracy: number;
  }>;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
}
