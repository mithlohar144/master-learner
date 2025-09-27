import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { syncAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Brain, TrendingUp, HelpCircle, Layout, BookOpen, Trophy,
  ArrowRight, Clock, Target, Flame, Star, CheckCircle2, PlayCircle,
  BarChart3, Users, Zap, Award, ChevronRight, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectLevel {
  level: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
}

interface UserProfile {
  name: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  timeCommitment: number;
  focusAreas: string[];
  subjectLevels?: Record<string, SubjectLevel>;
  preferredStyle: 'visual' | 'practical' | 'theoretical';
}

interface DashboardStats {
  streak: number;
  totalXP: number;
  completedTopics: number;
  questionsAnswered: number;
  weeklyGoal: number;
  weeklyProgress: number;
  accuracy: number;
  totalStudyTime: number;
  rank: string;
  todayProgress: number;
}

interface AIRecommendation {
  id: string;
  type: 'topic' | 'practice' | 'review' | 'challenge';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  subject: string;
  action: string;
  path: string;
}

interface LearningInsight {
  id: string;
  type: 'strength' | 'weakness' | 'suggestion' | 'milestone';
  title: string;
  description: string;
  icon: any;
  color: string;
}

const QUICK_ACTIONS = [
  { id: 'daily-challenge', label: 'Daily Challenge', icon: Target, color: 'text-orange-500', path: '/challenge' },
  { id: 'continue-learning', label: 'Continue Learning', icon: PlayCircle, color: 'text-blue-500', path: '/learn' },
  { id: 'ask-doubt', label: 'Ask a Doubt', icon: HelpCircle, color: 'text-purple-500', path: '/doubts' },
  { id: 'practice', label: 'Practice Questions', icon: Brain, color: 'text-green-500', path: '/practice' }
];

const LEARNING_MODULES = [
  {
    id: 'timetable',
    title: 'My Learning Path',
    description: 'Personalized schedule and roadmap',
    icon: Calendar,
    progress: 65,
    status: 'active',
    nextAction: 'Continue today\'s session',
    path: '/timetable'
  },
  {
    id: 'practice',
    title: 'Adaptive Practice',
    description: 'AI-powered questions that adapt to your level',
    icon: Brain,
    progress: 45,
    status: 'available',
    nextAction: 'Start practice session',
    path: '/practice'
  },
  {
    id: 'trending',
    title: 'Tech Trends',
    description: 'Stay updated with latest technologies',
    icon: TrendingUp,
    progress: 20,
    status: 'available',
    nextAction: 'Explore trending topics',
    path: '/trending'
  },
  {
    id: 'doubts',
    title: 'Doubt Resolver',
    description: 'Get instant help with explanations',
    icon: HelpCircle,
    progress: 30,
    status: 'available',
    nextAction: 'Ask your first question',
    path: '/doubts'
  },
  {
    id: 'flowcharts',
    title: 'Visual Learning',
    description: 'Interactive flowcharts and diagrams',
    icon: Layout,
    progress: 10,
    status: 'locked',
    nextAction: 'Unlock with 500 XP',
    path: '/flowcharts'
  },
  {
    id: 'projects',
    title: 'Build Projects',
    description: 'Hands-on coding projects',
    icon: BookOpen,
    progress: 0,
    status: 'locked',
    nextAction: 'Unlock with 1000 XP',
    path: '/projects'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    streak: 5,
    totalXP: 1250,
    completedTopics: 8,
    questionsAnswered: 142,
    weeklyGoal: 10,
    weeklyProgress: 7,
    accuracy: 87,
    totalStudyTime: 47.5,
    rank: 'Top 15%',
    todayProgress: 2.5
  });
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [learningInsights, setLearningInsights] = useState<LearningInsight[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Generate AI recommendations based on user profile and progress
  const generateAIRecommendations = (userProfile: UserProfile, userStats: DashboardStats): AIRecommendation[] => {
    const recommendations: AIRecommendation[] = [];
    
    // Analyze user's subject levels and generate personalized recommendations
    if (userProfile.subjectLevels) {
      Object.entries(userProfile.subjectLevels).forEach(([subject, level]) => {
        if (level.topics.length > 0) {
          // Recommend next topic based on current progress
          recommendations.push({
            id: `topic-${subject}`,
            type: 'topic',
            title: `Master ${level.topics[0]}`,
            description: `Continue your ${level.level} level journey in ${subject}`,
            priority: 'high',
            estimatedTime: 45,
            subject,
            action: 'Start Learning',
            path: '/timetable'
          });
        }
      });
    }
    
    // Recommend practice based on accuracy
    if (userStats.accuracy < 80) {
      recommendations.push({
        id: 'practice-weak-areas',
        type: 'practice',
        title: 'Practice Weak Areas',
        description: 'Focus on topics where you need improvement',
        priority: 'high',
        estimatedTime: 30,
        subject: 'Mixed',
        action: 'Start Practice',
        path: '/practice'
      });
    }
    
    // Suggest daily challenge if streak is good
    if (userStats.streak >= 3) {
      recommendations.push({
        id: 'daily-challenge',
        type: 'challenge',
        title: 'Take Daily Challenge',
        description: 'Keep your streak alive with today\'s challenge',
        priority: 'medium',
        estimatedTime: 15,
        subject: 'Mixed',
        action: 'Start Challenge',
        path: '/challenge'
      });
    }
    
    return recommendations.slice(0, 3); // Return top 3 recommendations
  };
  
  // Generate learning insights based on user data
  const generateLearningInsights = (userProfile: UserProfile, userStats: DashboardStats): LearningInsight[] => {
    const insights: LearningInsight[] = [];
    
    // Strength insight
    if (userStats.accuracy > 85) {
      insights.push({
        id: 'high-accuracy',
        type: 'strength',
        title: 'Excellent Accuracy',
        description: `You're maintaining ${userStats.accuracy}% accuracy - keep it up!`,
        icon: Target,
        color: 'text-green-500'
      });
    }
    
    // Streak insight
    if (userStats.streak >= 5) {
      insights.push({
        id: 'good-streak',
        type: 'milestone',
        title: 'Consistency Champion',
        description: `${userStats.streak} days streak! You're building great habits.`,
        icon: Flame,
        color: 'text-orange-500'
      });
    }
    
    // Learning pace insight
    if (userStats.weeklyProgress >= userStats.weeklyGoal) {
      insights.push({
        id: 'goal-achieved',
        type: 'milestone',
        title: 'Weekly Goal Achieved',
        description: 'You\'ve met your weekly learning target!',
        icon: Trophy,
        color: 'text-yellow-500'
      });
    } else {
      insights.push({
        id: 'catch-up-needed',
        type: 'suggestion',
        title: 'Catch Up Opportunity',
        description: `${userStats.weeklyGoal - userStats.weeklyProgress} hours left to reach your weekly goal`,
        icon: Clock,
        color: 'text-blue-500'
      });
    }
    
    return insights;
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Try to sync with database first
        const userId = await syncAPI.syncToDatabase();
        
        if (userId) {
          // Load fresh data from database
          await syncAPI.loadFromDatabase(userId);
        }
        
        // Load user profile from localStorage (now synced with DB)
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile(parsedProfile);
          
          // Generate AI recommendations and insights
          setAiRecommendations(generateAIRecommendations(parsedProfile, stats));
          setLearningInsights(generateLearningInsights(parsedProfile, stats));
        } else {
          // Redirect to onboarding if no profile
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to localStorage only
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile(parsedProfile);
          setAiRecommendations(generateAIRecommendations(parsedProfile, stats));
          setLearningInsights(generateLearningInsights(parsedProfile, stats));
        } else {
          navigate('/onboarding');
        }
      }
    };

    loadUserData();
  }, [navigate, stats]);

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getRecommendedModule = () => {
    return LEARNING_MODULES.find(m => m.status === 'active') || LEARNING_MODULES[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">
                {getGreeting()}, {profile.name}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Ready to continue your coding journey?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current Streak</div>
                <div className="flex items-center gap-1 font-semibold">
                  <Flame className="h-4 w-4 text-orange-500" />
                  {stats.streak} days
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total XP</div>
                <div className="flex items-center gap-1 font-semibold">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {stats.totalXP.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Weekly Goal</div>
                  <div className="font-semibold">{stats.weeklyProgress}/{stats.weeklyGoal} hours</div>
                </div>
              </div>
              <Progress value={(stats.weeklyProgress / stats.weeklyGoal) * 100} className="mt-2 h-2" />
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Topics Completed</div>
                  <div className="font-semibold">{stats.completedTopics}</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Questions Solved</div>
                  <div className="font-semibold">{stats.questionsAnswered}</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Trophy className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Rank</div>
                  <div className="font-semibold">Top 15%</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="learning">Modules</TabsTrigger>
            <TabsTrigger value="progress">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Jump into your learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => navigate(action.path)}
                      className="p-4 rounded-lg border hover:shadow-md transition-all text-left group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <action.icon className={cn("h-6 w-6", action.color)} />
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors ml-auto" />
                      </div>
                      <div className="font-medium text-sm">{action.label}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI-Powered Recommendations */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Recommendations
                  <Badge variant="secondary" className="ml-auto">Personalized</Badge>
                </CardTitle>
                <CardDescription>Smart suggestions based on your learning patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiRecommendations.map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          rec.priority === 'high' ? "bg-red-500/10" :
                          rec.priority === 'medium' ? "bg-yellow-500/10" : "bg-blue-500/10"
                        )}>
                          <Target className={cn(
                            "h-4 w-4",
                            rec.priority === 'high' ? "text-red-500" :
                            rec.priority === 'medium' ? "text-yellow-500" : "text-blue-500"
                          )} />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{rec.title}</div>
                          <div className="text-xs text-muted-foreground">{rec.description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{rec.subject}</Badge>
                            <span className="text-xs text-muted-foreground">~{rec.estimatedTime}min</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => navigate(rec.path)} 
                        size="sm" 
                        variant="outline"
                        className="gap-1"
                      >
                        {rec.action}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Learning Insights
                </CardTitle>
                <CardDescription>AI analysis of your progress and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {learningInsights.map((insight) => (
                    <div key={insight.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <insight.icon className={cn("h-4 w-4", insight.color)} />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{insight.title}</div>
                        <div className="text-xs text-muted-foreground">{insight.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's Focus Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today's Focus
                </CardTitle>
                <CardDescription>Based on your learning goals and schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.focusAreas.slice(0, 3).map((area, index) => (
                    <div key={area} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                          index === 0 ? "bg-green-500/10 text-green-500" :
                          index === 1 ? "bg-blue-500/10 text-blue-500" :
                          "bg-purple-500/10 text-purple-500"
                        )}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{area}</div>
                          <div className="text-sm text-muted-foreground">
                            {profile.timeCommitment / 3} hours allocated
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2">
                        Start
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Today Tab */}
          <TabsContent value="today" className="space-y-6">
            {/* Today's Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Today's Progress
                </CardTitle>
                <CardDescription>Your learning activity for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Study Time</span>
                    <span className="font-semibold">{stats.todayProgress}h / {profile.timeCommitment}h</span>
                  </div>
                  <Progress value={(stats.todayProgress / profile.timeCommitment) * 100} className="h-3" />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-green-500">{Math.floor(stats.todayProgress * 60)}</div>
                      <div className="text-xs text-muted-foreground">Minutes Studied</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-blue-500">12</div>
                      <div className="text-xs text-muted-foreground">Questions Solved</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-purple-500">3</div>
                      <div className="text-xs text-muted-foreground">Topics Covered</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-orange-500">{stats.streak}</div>
                      <div className="text-xs text-muted-foreground">Day Streak</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>Personalized learning plan for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.focusAreas.slice(0, 3).map((area, index) => {
                    const timeSlot = ['9:00 AM', '11:00 AM', '2:00 PM'][index];
                    const duration = Math.floor(profile.timeCommitment / 3 * 60);
                    const isCompleted = index < Math.floor(stats.todayProgress / (profile.timeCommitment / 3));
                    
                    return (
                      <div key={area} className={cn(
                        "flex items-center justify-between p-4 rounded-lg border",
                        isCompleted ? "bg-green-50 border-green-200" : "bg-background"
                      )}>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            isCompleted ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                          )}>
                            {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="font-medium">{area}</div>
                            <div className="text-sm text-muted-foreground">{timeSlot} • {duration} minutes</div>
                          </div>
                        </div>
                        <Button 
                          variant={isCompleted ? "outline" : "default"} 
                          size="sm"
                          onClick={() => navigate('/timetable')}
                        >
                          {isCompleted ? 'Review' : 'Start'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Practice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Quick Practice
                </CardTitle>
                <CardDescription>5-minute practice sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Arrays', 'Strings', 'Loops', 'Functions', 'Objects', 'Algorithms'].map((topic) => (
                    <button
                      key={topic}
                      className="p-3 rounded-lg border hover:shadow-md transition-all text-left"
                      onClick={() => navigate('/practice')}
                    >
                      <div className="font-medium text-sm">{topic}</div>
                      <div className="text-xs text-muted-foreground">~5 min</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Modules Tab */}
          <TabsContent value="learning" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {LEARNING_MODULES.map((module) => (
                <Card key={module.id} className={cn(
                  "transition-all hover:shadow-md",
                  module.status === 'active' && "border-primary/50 shadow-md",
                  module.status === 'locked' && "opacity-60"
                )}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          module.status === 'active' ? "bg-primary/10" :
                          module.status === 'available' ? "bg-muted" :
                          "bg-muted/50"
                        )}>
                          <module.icon className={cn(
                            "h-5 w-5",
                            module.status === 'active' ? "text-primary" :
                            module.status === 'available' ? "text-foreground" :
                            "text-muted-foreground"
                          )} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </div>
                      {module.status === 'active' && (
                        <Badge variant="default" className="bg-green-500/10 text-green-500">Active</Badge>
                      )}
                      {module.status === 'locked' && (
                        <Badge variant="secondary">Locked</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-medium">{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                      <Button
                        onClick={() => navigate(module.path)}
                        disabled={module.status === 'locked'}
                        variant={module.status === 'active' ? 'default' : 'outline'}
                        className="w-full gap-2"
                      >
                        {module.nextAction}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Progress/Analytics Tab */}
          <TabsContent value="progress" className="space-y-6">
            {/* Performance Overview */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Learning Velocity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500 mb-2">{stats.totalStudyTime}h</div>
                  <div className="text-sm text-muted-foreground mb-4">Total study time</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This week</span>
                      <span className="font-medium">{stats.weeklyProgress}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Daily average</span>
                      <span className="font-medium">{profile.timeCommitment}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Efficiency</span>
                      <span className="font-medium text-green-500">+12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Accuracy Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-500 mb-2">{stats.accuracy}%</div>
                  <div className="text-sm text-muted-foreground mb-4">Overall accuracy</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Best subject</span>
                      <span className="font-medium">Web Dev (94%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Needs focus</span>
                      <span className="font-medium">DSA (78%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Improvement</span>
                      <span className="font-medium text-green-500">+5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Ranking & XP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.rank}</div>
                  <div className="text-sm text-muted-foreground mb-4">Global ranking</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total XP</span>
                      <span className="font-medium">{stats.totalXP.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>This week</span>
                      <span className="font-medium">+340 XP</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Next level</span>
                      <span className="font-medium">250 XP</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subject-wise Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Subject Progress
                </CardTitle>
                <CardDescription>Your mastery level across different topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.focusAreas.map((area, index) => {
                    const progress = [85, 72, 68, 91, 45][index] || 50;
                    const questionsCount = [45, 32, 28, 67, 15][index] || 20;
                    
                    return (
                      <div key={area} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="font-medium">{area}</div>
                            <Badge variant="outline" className="text-xs">
                              {questionsCount} questions
                            </Badge>
                          </div>
                          <div className="text-sm font-medium">{progress}%</div>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Activity & Achievements */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Weekly Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const activity = [2.5, 3.1, 1.8, 2.9, 3.5, 1.2, 0][index];
                      const isToday = index === new Date().getDay() - 1;
                      
                      return (
                        <div key={day} className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">{day}</div>
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                            activity > 2 ? "bg-green-500 text-white" :
                            activity > 1 ? "bg-yellow-500 text-white" :
                            activity > 0 ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground",
                            isToday && "ring-2 ring-primary"
                          )}>
                            {activity > 0 ? activity.toFixed(1) : '-'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    Hours studied per day
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-transparent border border-orange-200">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <Flame className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">5-Day Streak Master</div>
                      <div className="text-xs text-muted-foreground">Consistency is key!</div>
                    </div>
                    <Badge variant="secondary" className="ml-auto">New</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-transparent border border-blue-200">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Brain className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Problem Solver</div>
                      <div className="text-xs text-muted-foreground">100+ questions solved</div>
                    </div>
                    <Badge variant="outline" className="ml-auto">+50 XP</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-transparent border border-green-200">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Topic Master</div>
                      <div className="text-xs text-muted-foreground">Arrays & Strings completed</div>
                    </div>
                    <Badge variant="outline" className="ml-auto">+100 XP</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
