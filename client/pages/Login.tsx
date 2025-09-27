import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Calendar, 
  Target, 
  TrendingUp,
  CheckCircle2,
  User,
  Clock,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExistingProfile {
  name: string;
  experience: string;
  focusAreas: string[];
  timeCommitment: number;
  goals: string[];
  lastActive?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [existingProfiles, setExistingProfiles] = useState<ExistingProfile[]>([]);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState("");

  useEffect(() => {
    // Check for existing profiles
    const profiles = getStoredProfiles();
    setExistingProfiles(profiles);
    
    // If no profiles exist, show new user form immediately
    if (profiles.length === 0) {
      setShowNewUserForm(true);
    }
  }, []);

  const getStoredProfiles = (): ExistingProfile[] => {
    const profiles: ExistingProfile[] = [];
    
    // Check main profile
    const mainProfile = localStorage.getItem('userProfile');
    if (mainProfile) {
      try {
        const parsed = JSON.parse(mainProfile);
        profiles.push({
          name: parsed.name || 'User',
          experience: parsed.experience || 'beginner',
          focusAreas: parsed.focusAreas || [],
          timeCommitment: parsed.timeCommitment || 2,
          goals: parsed.goals || [],
          lastActive: localStorage.getItem('lastActive') || new Date().toISOString()
        });
      } catch (e) {
        console.error('Error parsing profile:', e);
      }
    }

    // Could extend to support multiple profiles in the future
    return profiles;
  };

  const handleExistingUserLogin = (profile: ExistingProfile) => {
    // Update last active timestamp
    localStorage.setItem('lastActive', new Date().toISOString());
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const handleNewUserStart = () => {
    if (newUserName.trim()) {
      // Pre-populate the onboarding with the entered name
      const initialProfile = { name: newUserName.trim() };
      localStorage.setItem('tempProfile', JSON.stringify(initialProfile));
    }
    navigate('/onboarding');
  };

  const handleCreateNewProfile = () => {
    setShowNewUserForm(true);
  };

  const formatLastActive = (lastActive?: string) => {
    if (!lastActive) return 'Never';
    
    const date = new Date(lastActive);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">SmartCode Mentor</h1>
          </div>
          <p className="text-muted-foreground">
            {existingProfiles.length > 0 
              ? "Welcome back! Continue your learning journey" 
              : "AI-powered coding mentor for personalized learning"
            }
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Existing Users */}
          {existingProfiles.length > 0 && !showNewUserForm && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <User className="h-6 w-6 text-primary" />
                  Continue Learning
                </CardTitle>
                <CardDescription>
                  Pick up where you left off with your personalized study plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {existingProfiles.map((profile, index) => (
                  <button
                    key={index}
                    onClick={() => handleExistingUserLogin(profile)}
                    className="w-full p-4 rounded-lg border-2 text-left transition-all hover:shadow-md hover:border-primary/50 bg-card"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{profile.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Last active: {formatLastActive(profile.lastActive)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 ml-13">
                          <Badge variant="secondary" className="text-xs">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {profile.experience}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {profile.timeCommitment}h/day
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            {profile.focusAreas.length} subjects
                          </Badge>
                        </div>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </button>
                ))}
                
                <Separator className="my-4" />
                
                <Button 
                  variant="outline" 
                  onClick={handleCreateNewProfile}
                  className="w-full"
                >
                  Create New Learning Profile
                </Button>
              </CardContent>
            </Card>
          )}

          {/* New User Form */}
          {(showNewUserForm || existingProfiles.length === 0) && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Start Your Journey
                </CardTitle>
                <CardDescription>
                  Let's create your personalized learning experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">What should we call you?</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="text-lg"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newUserName.trim()) {
                        handleNewUserStart();
                      }
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-medium">What you'll get:</div>
                  <div className="grid gap-3">
                    {[
                      { icon: Brain, text: "AI-powered skill assessment quiz", desc: "10-minute personalized evaluation" },
                      { icon: Calendar, text: "Personalized study timetable", desc: "Based on your goals and availability" },
                      { icon: Target, text: "Topic-specific learning paths", desc: "Focused on your chosen subjects" },
                      { icon: TrendingUp, text: "Progress tracking & gamification", desc: "XP, badges, and achievement system" }
                    ].map(({ icon: Icon, text, desc }) => (
                      <div key={text} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                        <Icon className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">{text}</div>
                          <div className="text-xs text-muted-foreground">{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleNewUserStart}
                  disabled={!newUserName.trim()}
                  className="w-full gap-2"
                  size="lg"
                >
                  Begin Personalized Setup
                  <ArrowRight className="h-4 w-4" />
                </Button>

                {existingProfiles.length > 0 && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowNewUserForm(false)}
                    className="w-full"
                  >
                    Back to Existing Profiles
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Features Preview */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-lg">Why SmartCode Mentor?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center space-y-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                    <div className="font-medium">Smart Assessment</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="font-medium">Personalized Schedule</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div className="font-medium">Focused Learning</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="font-medium">Track Progress</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
