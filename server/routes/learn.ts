import { RequestHandler } from "express";

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  lessons: number;
  completed: boolean;
  progress: number;
  rating: number;
  students: number;
  thumbnail: string;
  tags: string[];
  instructor: string;
  type: 'video' | 'interactive' | 'reading' | 'practice';
  content?: {
    lessons: Array<{
      id: string;
      title: string;
      duration: string;
      type: 'video' | 'text' | 'quiz' | 'exercise';
      completed: boolean;
    }>;
  };
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: string[];
  totalDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completionRate: number;
  enrolled: boolean;
}

// Sample learning modules data
const LEARNING_MODULES: LearningModule[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Master the basics of JavaScript programming with hands-on examples and exercises.',
    category: 'Web Development',
    difficulty: 'beginner',
    duration: '4 hours',
    lessons: 12,
    completed: false,
    progress: 65,
    rating: 4.8,
    students: 15420,
    thumbnail: '🟨',
    tags: ['JavaScript', 'Programming', 'Web Dev'],
    instructor: 'Sarah Chen',
    type: 'interactive',
    content: {
      lessons: [
        { id: '1-1', title: 'Variables and Data Types', duration: '20 min', type: 'video', completed: true },
        { id: '1-2', title: 'Functions and Scope', duration: '25 min', type: 'video', completed: true },
        { id: '1-3', title: 'Arrays and Objects', duration: '30 min', type: 'video', completed: false },
        { id: '1-4', title: 'DOM Manipulation', duration: '35 min', type: 'exercise', completed: false }
      ]
    }
  },
  {
    id: '2',
    title: 'Data Structures Deep Dive',
    description: 'Comprehensive guide to arrays, linked lists, trees, and graphs with practical implementations.',
    category: 'Data Structures & Algorithms',
    difficulty: 'intermediate',
    duration: '6 hours',
    lessons: 18,
    completed: true,
    progress: 100,
    rating: 4.9,
    students: 12850,
    thumbnail: '🔗',
    tags: ['DSA', 'Algorithms', 'Computer Science'],
    instructor: 'Dr. Michael Rodriguez',
    type: 'video'
  },
  {
    id: '3',
    title: 'React Hooks Mastery',
    description: 'Learn modern React development with hooks, context, and advanced patterns.',
    category: 'Web Development',
    difficulty: 'intermediate',
    duration: '5 hours',
    lessons: 15,
    completed: false,
    progress: 30,
    rating: 4.7,
    students: 9630,
    thumbnail: '⚛️',
    tags: ['React', 'Hooks', 'Frontend'],
    instructor: 'Emma Thompson',
    type: 'interactive'
  },
  {
    id: '4',
    title: 'Machine Learning Basics',
    description: 'Introduction to ML concepts, algorithms, and practical applications using Python.',
    category: 'Machine Learning',
    difficulty: 'beginner',
    duration: '8 hours',
    lessons: 24,
    completed: false,
    progress: 0,
    rating: 4.6,
    students: 18750,
    thumbnail: '🤖',
    tags: ['ML', 'Python', 'AI'],
    instructor: 'Prof. David Kim',
    type: 'video'
  },
  {
    id: '5',
    title: 'System Design Fundamentals',
    description: 'Learn to design scalable systems with real-world examples and case studies.',
    category: 'System Design',
    difficulty: 'advanced',
    duration: '10 hours',
    lessons: 20,
    completed: false,
    progress: 15,
    rating: 4.9,
    students: 7420,
    thumbnail: '🏗️',
    tags: ['System Design', 'Architecture', 'Scalability'],
    instructor: 'Alex Johnson',
    type: 'reading'
  },
  {
    id: '6',
    title: 'Python for Data Science',
    description: 'Complete guide to using Python for data analysis, visualization, and machine learning.',
    category: 'Machine Learning',
    difficulty: 'intermediate',
    duration: '7 hours',
    lessons: 21,
    completed: false,
    progress: 45,
    rating: 4.8,
    students: 14200,
    thumbnail: '🐍',
    tags: ['Python', 'Data Science', 'Analytics'],
    instructor: 'Lisa Wang',
    type: 'practice'
  }
];

// Sample learning paths
const LEARNING_PATHS: LearningPath[] = [
  {
    id: '1',
    title: 'Full-Stack Web Developer',
    description: 'Complete path from frontend to backend development',
    modules: ['1', '3'],
    totalDuration: '40 hours',
    difficulty: 'intermediate',
    completionRate: 47,
    enrolled: true
  },
  {
    id: '2',
    title: 'Data Scientist Track',
    description: 'Master data science from basics to advanced ML',
    modules: ['4', '6'],
    totalDuration: '35 hours',
    difficulty: 'intermediate',
    completionRate: 22,
    enrolled: false
  },
  {
    id: '3',
    title: 'Software Engineer Path',
    description: 'Complete computer science and engineering curriculum',
    modules: ['2', '5'],
    totalDuration: '50 hours',
    difficulty: 'advanced',
    completionRate: 58,
    enrolled: true
  }
];

// Get all learning modules
export const getLearningModules: RequestHandler = (req, res) => {
  const { category, difficulty, search } = req.query;
  
  let filteredModules = [...LEARNING_MODULES];
  
  // Filter by category
  if (category && category !== 'all') {
    filteredModules = filteredModules.filter(module => module.category === category);
  }
  
  // Filter by difficulty
  if (difficulty && difficulty !== 'all') {
    filteredModules = filteredModules.filter(module => module.difficulty === difficulty);
  }
  
  // Filter by search query
  if (search) {
    const searchLower = (search as string).toLowerCase();
    filteredModules = filteredModules.filter(module =>
      module.title.toLowerCase().includes(searchLower) ||
      module.description.toLowerCase().includes(searchLower) ||
      module.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  res.json({
    success: true,
    data: filteredModules,
    total: filteredModules.length
  });
};

// Get specific learning module
export const getLearningModule: RequestHandler = (req, res) => {
  const { moduleId } = req.params;
  
  const module = LEARNING_MODULES.find(m => m.id === moduleId);
  
  if (!module) {
    return res.status(404).json({
      success: false,
      message: 'Learning module not found'
    });
  }
  
  res.json({
    success: true,
    data: module
  });
};

// Get all learning paths
export const getLearningPaths: RequestHandler = (req, res) => {
  res.json({
    success: true,
    data: LEARNING_PATHS
  });
};

// Get specific learning path
export const getLearningPath: RequestHandler = (req, res) => {
  const { pathId } = req.params;
  
  const path = LEARNING_PATHS.find(p => p.id === pathId);
  
  if (!path) {
    return res.status(404).json({
      success: false,
      message: 'Learning path not found'
    });
  }
  
  // Get modules for this path
  const pathModules = LEARNING_MODULES.filter(m => path.modules.includes(m.id));
  
  res.json({
    success: true,
    data: {
      ...path,
      moduleDetails: pathModules
    }
  });
};

// Start learning module
export const startLearningModule: RequestHandler = (req, res) => {
  const { moduleId } = req.params;
  const { userId } = req.body;
  
  const module = LEARNING_MODULES.find(m => m.id === moduleId);
  
  if (!module) {
    return res.status(404).json({
      success: false,
      message: 'Learning module not found'
    });
  }
  
  // In a real app, this would update user progress in database
  // For now, simulate starting the module
  res.json({
    success: true,
    message: 'Learning module started successfully',
    data: {
      moduleId,
      startedAt: new Date().toISOString(),
      progress: 0
    }
  });
};

// Update learning progress
export const updateLearningProgress: RequestHandler = (req, res) => {
  const { moduleId } = req.params;
  const { userId, lessonId, progress, completed } = req.body;
  
  // In a real app, this would update progress in database
  res.json({
    success: true,
    message: 'Progress updated successfully',
    data: {
      moduleId,
      lessonId,
      progress,
      completed,
      updatedAt: new Date().toISOString()
    }
  });
};

// Enroll in learning path
export const enrollInLearningPath: RequestHandler = (req, res) => {
  const { pathId } = req.params;
  const { userId } = req.body;
  
  const path = LEARNING_PATHS.find(p => p.id === pathId);
  
  if (!path) {
    return res.status(404).json({
      success: false,
      message: 'Learning path not found'
    });
  }
  
  // In a real app, this would update enrollment in database
  res.json({
    success: true,
    message: 'Successfully enrolled in learning path',
    data: {
      pathId,
      enrolledAt: new Date().toISOString(),
      userId
    }
  });
};

// Get user's learning progress
export const getUserLearningProgress: RequestHandler = (req, res) => {
  const { userId } = req.params;
  
  // In a real app, this would fetch from database
  // For now, return mock progress data
  const mockProgress = {
    completedModules: LEARNING_MODULES.filter(m => m.completed).length,
    inProgressModules: LEARNING_MODULES.filter(m => m.progress > 0 && !m.completed).length,
    totalStudyTime: 45, // hours
    averageProgress: Math.round(
      LEARNING_MODULES.reduce((acc, m) => acc + m.progress, 0) / LEARNING_MODULES.length
    ),
    enrolledPaths: LEARNING_PATHS.filter(p => p.enrolled).length,
    recentActivity: [
      {
        type: 'module_started',
        moduleId: '1',
        moduleName: 'JavaScript Fundamentals',
        timestamp: new Date().toISOString()
      },
      {
        type: 'lesson_completed',
        moduleId: '2',
        lessonName: 'Binary Trees',
        timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ]
  };
  
  res.json({
    success: true,
    data: mockProgress
  });
};
