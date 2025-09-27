import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Star, 
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
  Code,
  Video,
  FileText,
  Lightbulb,
  Target,
  TrendingUp,
  Award,
  Zap,
  Brain,
  Rocket,
  Users,
  Globe,
  Heart
} from 'lucide-react';

interface LearningModule {
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
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: string[];
  totalDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completionRate: number;
  enrolled: boolean;
}

const LearnPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [userProfile, setUserProfile] = useState<any>(null);

  // Sample learning modules data
  const [learningModules] = useState<LearningModule[]>([
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
      type: 'interactive'
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
  ]);

  // Sample learning paths
  const [learningPaths] = useState<LearningPath[]>([
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
  ]);

  const categories = ['all', 'Web Development', 'Data Structures & Algorithms', 'Machine Learning', 'System Design'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      setUserProfile(JSON.parse(profileData));
    }
  }, []);

  const filteredModules = learningModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || module.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'interactive': return <Code className="h-4 w-4" />;
      case 'reading': return <FileText className="h-4 w-4" />;
      case 'practice': return <Target className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const startLearning = (moduleId: string) => {
    // In a real app, this would navigate to the learning module
    console.log('Starting module:', moduleId);
    // For now, simulate progress update
    const updatedProgress = Math.min(100, Math.random() * 30 + 10);
    console.log('Progress updated to:', updatedProgress);
  };

  const enrollInPath = (pathId: string) => {
    console.log('Enrolling in path:', pathId);
    // Update enrollment status
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 hover:bg-blue-50 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎓 Learn & Grow
            </h1>
            <p className="text-gray-600 text-lg mt-2">Discover new skills and advance your coding journey</p>
          </div>
          
          {userProfile && (
            <div className="text-right">
              <div className="text-sm text-gray-600">Welcome back,</div>
              <div className="font-semibold text-lg">{userProfile.name}</div>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {userProfile.experience} Level
              </Badge>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          {/* Explore Tab */}
          <TabsContent value="explore" className="space-y-6">
            {/* Search and Filters */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search courses, topics, or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border rounded-md bg-white"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="px-3 py-2 border rounded-md bg-white"
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Courses */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Rocket className="h-6 w-6 text-blue-600" />
                Featured Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.map((module) => (
                  <Card key={module.id} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-0">
                      {/* Thumbnail */}
                      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-6xl relative overflow-hidden">
                        {module.thumbnail}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                        <div className="absolute top-4 right-4">
                          <Badge className={`${getDifficultyColor(module.difficulty)} text-white`}>
                            {module.difficulty}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                          {getTypeIcon(module.type)}
                          <span className="text-sm capitalize">{module.type}</span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                            {module.title}
                          </h3>
                          {module.completed && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {module.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {module.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {module.lessons} lessons
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {module.students.toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{module.rating}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">by {module.instructor}</span>
                        </div>
                        
                        {module.progress > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600">Progress</span>
                              <span className="text-sm font-medium">{module.progress}%</span>
                            </div>
                            <Progress value={module.progress} className="h-2" />
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {module.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button
                          onClick={() => startLearning(module.id)}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          {module.progress > 0 ? (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Continue Learning
                            </>
                          ) : (
                            <>
                              <Rocket className="h-4 w-4 mr-2" />
                              Start Course
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Learning Paths Tab */}
          <TabsContent value="paths" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
                Structured Learning Paths
              </h2>
              <p className="text-gray-600 mb-6">Follow curated paths designed by experts to master specific skills</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {learningPaths.map((path) => (
                  <Card key={path.id} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                      <CardTitle className="flex items-center justify-between">
                        <span>{path.title}</span>
                        <Badge className={`${getDifficultyColor(path.difficulty)} text-white`}>
                          {path.difficulty}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4">{path.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {path.totalDuration}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {path.modules.length} modules
                        </div>
                      </div>
                      
                      {path.enrolled && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Overall Progress</span>
                            <span className="text-sm font-medium">{path.completionRate}%</span>
                          </div>
                          <Progress value={path.completionRate} className="h-2" />
                        </div>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        <h4 className="font-medium">Included Modules:</h4>
                        {path.modules.map((moduleId) => {
                          const module = learningModules.find(m => m.id === moduleId);
                          return module ? (
                            <div key={moduleId} className="flex items-center gap-2 text-sm">
                              <CheckCircle className={`h-4 w-4 ${module.completed ? 'text-green-500' : 'text-gray-300'}`} />
                              {module.title}
                            </div>
                          ) : null;
                        })}
                      </div>
                      
                      <Button
                        onClick={() => enrollInPath(path.id)}
                        variant={path.enrolled ? "outline" : "default"}
                        className={!path.enrolled ? "w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600" : "w-full"}
                      >
                        {path.enrolled ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Continue Path
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Enroll Now
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* My Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Overview */}
              <Card className="lg:col-span-2 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {learningModules.filter(m => m.progress > 0).map((module) => (
                      <div key={module.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{module.thumbnail}</span>
                            <div>
                              <h4 className="font-medium">{module.title}</h4>
                              <p className="text-sm text-gray-600">{module.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{module.progress}%</div>
                            <div className="text-sm text-gray-500">{module.lessons} lessons</div>
                          </div>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-700 mb-2">
                      {learningModules.filter(m => m.completed).length}
                    </div>
                    <div className="text-sm text-blue-600">Courses Completed</div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-700 mb-2">
                      {learningModules.filter(m => m.progress > 0).length}
                    </div>
                    <div className="text-sm text-green-600">Courses In Progress</div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-700 mb-2">
                      {Math.round(learningModules.reduce((acc, m) => acc + m.progress, 0) / learningModules.length)}%
                    </div>
                    <div className="text-sm text-purple-600">Average Progress</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Favorites Yet</h3>
              <p className="text-gray-500 mb-6">
                Start exploring courses and add your favorites to see them here
              </p>
              <Button
                onClick={() => setActiveTab('explore')}
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
              >
                <Globe className="h-4 w-4 mr-2" />
                Explore Courses
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LearnPage;
