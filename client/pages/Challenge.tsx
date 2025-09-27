import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code2, 
  Brain, 
  Trophy, 
  Clock, 
  Star, 
  Play, 
  CheckCircle2,
  Target,
  Zap,
  Award,
  TrendingUp,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProfile {
  name: string;
  experience: string;
  focusAreas: string[];
  subjectLevels?: Record<string, { level: string; topics: string[] }>;
}

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
  completed?: boolean;
  accuracy?: number;
}

const CHALLENGES_DATA: Challenge[] = [
  // Data Structures & Algorithms
  {
    id: 'dsa-two-sum',
    title: 'Two Sum Problem',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    type: 'coding',
    difficulty: 'beginner',
    subject: 'Data Structures & Algorithms',
    topic: 'Arrays',
    estimatedTime: 15,
    xpReward: 50
  },
  {
    id: 'web-responsive-layout',
    title: 'Responsive Card Layout',
    description: 'Create a responsive card layout that displays 4 cards per row on desktop, 2 on tablet, and 1 on mobile.',
    type: 'coding',
    difficulty: 'beginner',
    subject: 'Web Development',
    topic: 'HTML/CSS',
    estimatedTime: 30,
    xpReward: 60
  },
  {
    id: 'dsa-2',
    title: 'Reverse Linked List',
    description: 'Implement an algorithm to reverse a singly linked list',
    type: 'coding',
    difficulty: 'intermediate',
    subject: 'Data Structures & Algorithms',
    topic: 'Linked Lists',
    estimatedTime: 25,
    xpReward: 75
  },
  {
    id: 'dsa-3',
    title: 'Binary Tree Traversal Quiz',
    description: 'Test your knowledge of different tree traversal methods',
    type: 'quiz',
    difficulty: 'intermediate',
    subject: 'Data Structures & Algorithms',
    topic: 'Trees',
    estimatedTime: 10,
    xpReward: 40
  },
  {
    id: 'web-2',
    title: 'React State Management',
    description: 'Build a todo app with proper state management',
    type: 'coding',
    difficulty: 'intermediate',
    subject: 'Web Development',
    topic: 'React',
    estimatedTime: 45,
    xpReward: 100
  },
  // Machine Learning
  {
    id: 'ml-1',
    title: 'Linear Regression Basics',
    description: 'Implement simple linear regression from scratch',
    type: 'coding',
    difficulty: 'beginner',
    subject: 'Machine Learning',
    topic: 'Linear Regression',
    estimatedTime: 35,
    xpReward: 80
  },
  // System Design
  {
    id: 'sys-1',
    title: 'Load Balancer Design',
    description: 'Design a simple load balancer system',
    type: 'algorithm',
    difficulty: 'advanced',
    subject: 'System Design',
    topic: 'Load Balancers',
    estimatedTime: 60,
    xpReward: 150
  }
];

export default function Challenge() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('recommended');

  useEffect(() => {
    // Load user profile
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      try {
        const parsed = JSON.parse(profile);
        setUserProfile(parsed);
      } catch (e) {
        console.error('Error parsing profile:', e);
      }
    }

    // Load challenges with personalization
    const personalizedChallenges = getPersonalizedChallenges();
    setChallenges(personalizedChallenges);
  }, []);

  const getPersonalizedChallenges = (): Challenge[] => {
    const profile = localStorage.getItem('userProfile');
    if (!profile) return CHALLENGES_DATA;

    try {
      const parsed = JSON.parse(profile);
      const userFocusAreas = parsed.focusAreas || [];
      const userExperience = parsed.experience || 'beginner';

      // Filter challenges based on user's focus areas
      let filteredChallenges = CHALLENGES_DATA.filter(challenge => 
        userFocusAreas.includes(challenge.subject)
      );

      // If no focus area matches, include all challenges
      if (filteredChallenges.length === 0) {
        filteredChallenges = CHALLENGES_DATA;
      }

      // Adjust difficulty based on user experience
      return filteredChallenges.map(challenge => ({
        ...challenge,
        // Add some completed challenges for demo
        completed: Math.random() > 0.7,
        accuracy: Math.random() > 0.5 ? Math.floor(Math.random() * 40) + 60 : undefined
      }));
    } catch (e) {
      return CHALLENGES_DATA;
    }
  };

  const getFilteredChallenges = () => {
    return challenges.filter(challenge => {
      const difficultyMatch = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
      const subjectMatch = selectedSubject === 'all' || challenge.subject === selectedSubject;
      return difficultyMatch && subjectMatch;
    });
  };

  const getRecommendedChallenges = () => {
    if (!userProfile) return challenges.slice(0, 6);
    
    const userExperience = userProfile.experience;
    const focusAreas = userProfile.focusAreas || [];
    
    return challenges
      .filter(challenge => 
        focusAreas.includes(challenge.subject) && 
        (challenge.difficulty === userExperience || 
         (userExperience === 'beginner' && challenge.difficulty === 'intermediate'))
      )
      .slice(0, 6);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'coding': return Code2;
      case 'quiz': return Brain;
      case 'algorithm': return Target;
      default: return Code2;
    }
  };

  const handleStartChallenge = (challengeId: string) => {
    // Navigate to the challenge solver
    window.location.href = `/challenge/${challengeId}`;
  };

  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalXP = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.xpReward, 0);
  const averageAccuracy = challenges.filter(c => c.completed && c.accuracy).reduce((sum, c, _, arr) => sum + (c.accuracy || 0) / arr.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Coding Challenges</h1>
          </div>
          <p className="text-muted-foreground">
            Sharpen your skills with personalized coding challenges
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{completedChallenges}</div>
                  <div className="text-sm text-muted-foreground font-medium">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{totalXP}</div>
                  <div className="text-sm text-muted-foreground font-medium">XP Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{Math.round(averageAccuracy)}%</div>
                  <div className="text-sm text-muted-foreground font-medium">Avg Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-100">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{challenges.length - completedChallenges}</div>
                  <div className="text-sm text-muted-foreground font-medium">Available</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenge Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="recommended" className="font-medium">
              Recommended
            </TabsTrigger>
            <TabsTrigger value="all" className="font-medium">
              All Challenges
            </TabsTrigger>
            <TabsTrigger value="completed" className="font-medium">
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommended" className="space-y-6">
            {getRecommendedChallenges().length > 0 ? (
              <div className="grid gap-6">
                {getRecommendedChallenges().map((challenge) => (
                  <ChallengeCard 
                    key={challenge.id} 
                    challenge={challenge} 
                    onStart={handleStartChallenge}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="space-y-3">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-semibold">No Recommended Challenges</h3>
                  <p className="text-muted-foreground">
                    Complete your onboarding to get personalized challenge recommendations.
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            {/* Filters */}
            <Card className="p-4">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  Filter by difficulty:
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDifficulty('all')}
                    className="h-8"
                  >
                    All Levels
                  </Button>
                  <Button
                    variant={selectedDifficulty === 'beginner' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDifficulty('beginner')}
                    className="h-8"
                  >
                    Beginner
                  </Button>
                  <Button
                    variant={selectedDifficulty === 'intermediate' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDifficulty('intermediate')}
                    className="h-8"
                  >
                    Intermediate
                  </Button>
                  <Button
                    variant={selectedDifficulty === 'advanced' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDifficulty('advanced')}
                    className="h-8"
                  >
                    Advanced
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid gap-6">
              {getFilteredChallenges().map((challenge) => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  onStart={handleStartChallenge}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {challenges.filter(c => c.completed).length > 0 ? (
              <div className="grid gap-6">
                {challenges.filter(c => c.completed).map((challenge) => (
                  <ChallengeCard 
                    key={challenge.id} 
                    challenge={challenge} 
                    onStart={handleStartChallenge}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="space-y-3">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-semibold">No Completed Challenges</h3>
                  <p className="text-muted-foreground">
                    Start solving challenges to see your completed work here.
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface ChallengeCardProps {
  challenge: Challenge;
  onStart: (id: string) => void;
}

function ChallengeCard({ challenge, onStart }: ChallengeCardProps) {
  const TypeIcon = getTypeIcon(challenge.type);
  
  return (
    <Card className={cn(
      "transition-all hover:shadow-lg hover:border-primary/20",
      challenge.completed && "bg-green-50/50 border-green-200"
    )}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                <TypeIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg text-foreground truncate">
                    {challenge.title}
                  </h3>
                  {challenge.completed && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {challenge.description}
                </p>
              </div>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="secondary" 
                className={cn("font-medium", getDifficultyColor(challenge.difficulty))}
              >
                {challenge.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                {challenge.subject}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {challenge.estimatedTime}min
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                {challenge.xpReward} XP
              </Badge>
            </div>

            {/* Progress for completed challenges */}
            {challenge.completed && challenge.accuracy && (
              <div className="space-y-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-700 font-medium">Accuracy</span>
                  <span className="font-semibold text-green-800">{challenge.accuracy}%</span>
                </div>
                <Progress 
                  value={challenge.accuracy} 
                  className="h-2 bg-green-100" 
                />
              </div>
            )}
          </div>
          
          {/* Action Button */}
          <div className="flex-shrink-0 sm:ml-4">
            <Button
              onClick={() => onStart(challenge.id)}
              disabled={challenge.completed}
              className={cn(
                "w-full sm:w-auto gap-2 font-medium",
                challenge.completed 
                  ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-300" 
                  : "bg-primary hover:bg-primary/90"
              )}
              variant={challenge.completed ? "outline" : "default"}
            >
              {challenge.completed ? (
                <>
                  <Award className="h-4 w-4" />
                  Completed
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start Challenge
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'coding': return Code2;
    case 'quiz': return Brain;
    case 'algorithm': return Target;
    default: return Code2;
  }
}
