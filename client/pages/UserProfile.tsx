import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Calendar, 
  Clock, 
  Target, 
  BookOpen, 
  Trophy, 
  TrendingUp,
  Settings,
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  Award,
  Star,
  Zap
} from 'lucide-react';

interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  timeCommitment: number;
  focusAreas: string[];
  subjectLevels: Record<string, {
    level: 'beginner' | 'intermediate' | 'advanced';
    topics: string[];
  }>;
  preferredStyle: 'visual' | 'practical' | 'theoretical';
  socialLinks?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
  joinDate?: string;
  lastActive?: string;
}

interface UserStats {
  totalStudyTime: number;
  questionsAnswered: number;
  topicsCompleted: string[];
  streakCount: number;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    earnedAt: string;
    xpReward: number;
  }>;
  xpPoints: number;
  level: number;
}

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Load user profile and stats
  useEffect(() => {
    const loadUserData = () => {
      // Load profile from localStorage
      const profileData = localStorage.getItem('userProfile');
      if (profileData) {
        const parsedProfile = JSON.parse(profileData);
        const enhancedProfile: UserProfile = {
          ...parsedProfile,
          email: parsedProfile.email || '',
          phone: parsedProfile.phone || '',
          location: parsedProfile.location || '',
          bio: parsedProfile.bio || '',
          avatar: parsedProfile.avatar || '',
          socialLinks: parsedProfile.socialLinks || {},
          joinDate: parsedProfile.joinDate || new Date().toISOString(),
          lastActive: new Date().toISOString()
        };
        setProfile(enhancedProfile);
        setEditedProfile(enhancedProfile);
      }

      // Load or generate stats
      const statsData = localStorage.getItem('userStats');
      if (statsData) {
        setStats(JSON.parse(statsData));
      } else {
        // Generate initial stats
        const initialStats: UserStats = {
          totalStudyTime: Math.floor(Math.random() * 100) + 20,
          questionsAnswered: Math.floor(Math.random() * 500) + 50,
          topicsCompleted: ['Arrays', 'React Basics', 'Python Fundamentals'],
          streakCount: Math.floor(Math.random() * 15) + 1,
          achievements: [
            {
              id: '1',
              title: 'First Steps',
              description: 'Completed your first study session',
              earnedAt: new Date().toISOString(),
              xpReward: 100
            },
            {
              id: '2',
              title: 'Knowledge Seeker',
              description: 'Answered 50+ questions correctly',
              earnedAt: new Date().toISOString(),
              xpReward: 250
            }
          ],
          xpPoints: 850,
          level: 3
        };
        setStats(initialStats);
        localStorage.setItem('userStats', JSON.stringify(initialStats));
      }
    };

    loadUserData();
  }, []);

  const handleSaveProfile = () => {
    if (editedProfile) {
      setProfile(editedProfile);
      localStorage.setItem('userProfile', JSON.stringify(editedProfile));
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const updateEditedProfile = (field: string, value: any) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value
      });
    }
  };

  const updateSocialLinks = (platform: string, url: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        socialLinks: {
          ...editedProfile.socialLinks,
          [platform]: url
        }
      });
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getXPForNextLevel = (currentLevel: number) => {
    return currentLevel * 1000;
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    profile.name.charAt(0).toUpperCase()
                  )}
                </div>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    {isEditing ? (
                      <Input
                        value={editedProfile?.name || ''}
                        onChange={(e) => updateEditedProfile('name', e.target.value)}
                        className="text-2xl font-bold mb-2"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {profile.name}
                      </h1>
                    )}
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getExperienceColor(profile.experience)} text-white`}>
                        {profile.experience.charAt(0).toUpperCase() + profile.experience.slice(1)}
                      </Badge>
                      {stats && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Level {stats.level}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* XP Progress */}
                  {stats && (
                    <div className="bg-white/50 rounded-lg p-3 min-w-[200px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">XP Progress</span>
                        <span className="text-sm text-gray-600">{stats.xpPoints} XP</span>
                      </div>
                      <Progress 
                        value={(stats.xpPoints % 1000) / 10} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {1000 - (stats.xpPoints % 1000)} XP to Level {stats.level + 1}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div className="mb-4">
                  {isEditing ? (
                    <div>
                      <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                      <Input
                        id="bio"
                        value={editedProfile?.bio || ''}
                        onChange={(e) => updateEditedProfile('bio', e.target.value)}
                        placeholder="Tell us about yourself..."
                        className="mt-1"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      {profile.bio || 'Passionate learner on a coding journey! 🚀'}
                    </p>
                  )}
                </div>

                {/* Quick Stats */}
                {stats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalStudyTime}h</div>
                      <div className="text-xs text-gray-500">Study Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.questionsAnswered}</div>
                      <div className="text-xs text-gray-500">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{stats.topicsCompleted.length}</div>
                      <div className="text-xs text-gray-500">Topics</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{stats.streakCount}</div>
                      <div className="text-xs text-gray-500">Day Streak</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px] mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedProfile?.email || ''}
                          onChange={(e) => updateEditedProfile('email', e.target.value)}
                          placeholder="your.email@example.com"
                          className="flex-1"
                        />
                      ) : (
                        <span>{profile.email || 'Not provided'}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {isEditing ? (
                        <Input
                          value={editedProfile?.phone || ''}
                          onChange={(e) => updateEditedProfile('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="flex-1"
                        />
                      ) : (
                        <span>{profile.phone || 'Not provided'}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {isEditing ? (
                        <Input
                          value={editedProfile?.location || ''}
                          onChange={(e) => updateEditedProfile('location', e.target.value)}
                          placeholder="City, Country"
                          className="flex-1"
                        />
                      ) : (
                        <span>{profile.location || 'Not provided'}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Social Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Github className="h-4 w-4 text-gray-500" />
                      {isEditing ? (
                        <Input
                          value={editedProfile?.socialLinks?.github || ''}
                          onChange={(e) => updateSocialLinks('github', e.target.value)}
                          placeholder="https://github.com/username"
                          className="flex-1"
                        />
                      ) : (
                        <span>{profile.socialLinks?.github || 'Not connected'}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-4 w-4 text-gray-500" />
                      {isEditing ? (
                        <Input
                          value={editedProfile?.socialLinks?.linkedin || ''}
                          onChange={(e) => updateSocialLinks('linkedin', e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="flex-1"
                        />
                      ) : (
                        <span>{profile.socialLinks?.linkedin || 'Not connected'}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-gray-500" />
                      {isEditing ? (
                        <Input
                          value={editedProfile?.socialLinks?.website || ''}
                          onChange={(e) => updateSocialLinks('website', e.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="flex-1"
                        />
                      ) : (
                        <span>{profile.socialLinks?.website || 'Not provided'}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity Timeline */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Joined SmartCode Mentor</p>
                      <p className="text-sm text-gray-600">
                        {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Last Active</p>
                      <p className="text-sm text-gray-600">
                        {profile.lastActive ? new Date(profile.lastActive).toLocaleDateString() : 'Today'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Learning Preferences */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Learning Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {profile.goals.map((goal, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>{goal}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Daily Commitment</span>
                      <Badge variant="outline">{profile.timeCommitment} hours</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Learning Style</span>
                      <Badge variant="outline">{profile.preferredStyle}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Focus Areas */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {profile.focusAreas.map((area, index) => (
                      <div key={index} className="p-3 bg-indigo-50 rounded-lg">
                        <div className="font-medium">{area}</div>
                        {profile.subjectLevels[area] && (
                          <div className="mt-2">
                            <Badge className={`${getExperienceColor(profile.subjectLevels[area].level)} text-white text-xs`}>
                              {profile.subjectLevels[area].level}
                            </Badge>
                            <div className="mt-1 text-sm text-gray-600">
                              {profile.subjectLevels[area].topics.length} topics selected
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            {stats && (
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.totalStudyTime}</div>
                      <div className="text-sm text-gray-600">Hours Studied</div>
                      <Progress value={Math.min((stats.totalStudyTime / 100) * 100, 100)} className="mt-2" />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{stats.questionsAnswered}</div>
                      <div className="text-sm text-gray-600">Questions Answered</div>
                      <Progress value={Math.min((stats.questionsAnswered / 1000) * 100, 100)} className="mt-2" />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">{stats.streakCount}</div>
                      <div className="text-sm text-gray-600">Day Streak</div>
                      <Progress value={Math.min((stats.streakCount / 30) * 100, 100)} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.achievements.map((achievement) => (
                  <Card key={achievement.id} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
                      <div className="flex items-center justify-center gap-2">
                        <Badge className="bg-yellow-500 text-white">
                          <Zap className="h-3 w-3 mr-1" />
                          +{achievement.xpReward} XP
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">Reset Learning Progress</h3>
                      <p className="text-sm text-gray-600">Clear all progress and start fresh</p>
                    </div>
                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                      Reset Progress
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">Export Data</h3>
                      <p className="text-sm text-gray-600">Download your learning data</p>
                    </div>
                    <Button variant="outline">
                      Export Data
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <h3 className="font-medium text-red-800">Delete Account</h3>
                      <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfilePage;
