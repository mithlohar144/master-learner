import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Zap, 
  Calendar,
  BookOpen,
  Award,
  Flame
} from 'lucide-react';

interface ProfileStatsProps {
  stats: {
    totalStudyTime: number;
    questionsAnswered: number;
    topicsCompleted: string[];
    streakCount: number;
    xpPoints: number;
    level: number;
    achievements: Array<{
      id: string;
      title: string;
      description: string;
      earnedAt: string;
      xpReward: number;
    }>;
  };
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const getXPForNextLevel = (currentLevel: number) => {
    return currentLevel * 1000;
  };

  const currentLevelXP = (stats.level - 1) * 1000;
  const nextLevelXP = stats.level * 1000;
  const progressToNextLevel = ((stats.xpPoints - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Study Time */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="bg-white/50">
              This Month
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-700">{stats.totalStudyTime}h</div>
            <div className="text-sm text-blue-600">Total Study Time</div>
            <Progress value={Math.min((stats.totalStudyTime / 100) * 100, 100)} className="h-2" />
            <div className="text-xs text-blue-500">
              {100 - stats.totalStudyTime}h to reach 100h goal
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Answered */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="bg-white/50">
              All Time
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-700">{stats.questionsAnswered}</div>
            <div className="text-sm text-green-600">Questions Answered</div>
            <Progress value={Math.min((stats.questionsAnswered / 1000) * 100, 100)} className="h-2" />
            <div className="text-xs text-green-500">
              {1000 - stats.questionsAnswered} to reach 1000 milestone
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak Counter */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="bg-white/50">
              Current
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-orange-700">{stats.streakCount}</div>
            <div className="text-sm text-orange-600">Day Streak</div>
            <Progress value={Math.min((stats.streakCount / 30) * 100, 100)} className="h-2" />
            <div className="text-xs text-orange-500">
              {30 - stats.streakCount} days to 30-day badge
            </div>
          </div>
        </CardContent>
      </Card>

      {/* XP & Level */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="bg-white/50">
              Level {stats.level}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-purple-700">{stats.xpPoints}</div>
            <div className="text-sm text-purple-600">Experience Points</div>
            <Progress value={progressToNextLevel} className="h-2" />
            <div className="text-xs text-purple-500">
              {nextLevelXP - stats.xpPoints} XP to Level {stats.level + 1}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topics Completed */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-teal-50 to-teal-100 hover:shadow-xl transition-shadow md:col-span-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-500 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-teal-700">{stats.topicsCompleted.length}</div>
                <div className="text-sm text-teal-600">Topics Mastered</div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.topicsCompleted.map((topic, index) => (
              <Badge key={index} className="bg-teal-500 text-white">
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-xl transition-shadow md:col-span-2">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-700">Recent Achievements</div>
              <div className="text-sm text-yellow-600">{stats.achievements.length} total earned</div>
            </div>
          </div>
          <div className="space-y-3">
            {stats.achievements.slice(0, 3).map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-yellow-800">{achievement.title}</div>
                  <div className="text-sm text-yellow-600">{achievement.description}</div>
                </div>
                <Badge className="bg-yellow-500 text-white">
                  +{achievement.xpReward} XP
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStats;
