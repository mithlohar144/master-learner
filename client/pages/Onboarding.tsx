import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, ArrowLeft, CheckCircle2, Target, Clock, BookOpen, Code2, Brain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectLevel {
  level: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
}

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
  subjectLevels: Record<string, SubjectLevel>;
  preferredStyle: 'visual' | 'practical' | 'theoretical';
  socialLinks?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', desc: 'New to programming', icon: BookOpen },
  { id: 'intermediate', label: 'Intermediate', desc: 'Some coding experience', icon: Code2 },
  { id: 'advanced', label: 'Advanced', desc: 'Experienced developer', icon: Brain }
];

const FOCUS_AREAS = [
  'Data Structures & Algorithms',
  'Web Development',
  'Machine Learning',
  'System Design',
];

const LEARNING_GOALS = [
  'Get a job in tech', 'Improve coding skills', 'Learn new technologies',
  'Prepare for interviews', 'Build projects', 'Contribute to open source'
];

const SUBJECT_TOPICS: Record<string, Record<string, string[]>> = {
  'Data Structures & Algorithms': {
    beginner: ['Arrays & Strings', 'Linked Lists', 'Stacks & Queues', 'Basic Sorting'],
    intermediate: ['Trees & Tries', 'Heaps & HashMaps', 'Graphs (BFS, DFS)', 'Divide and Conquer'],
    advanced: ['Dynamic Programming', 'Advanced Graph Algorithms', 'Segment Trees', 'Complexity Analysis'],
  },
  'Web Development': {
    beginner: ['HTML & CSS', 'Basic JavaScript & DOM', 'Responsive Design', 'Version Control (Git)'],
    intermediate: ['React/Vue/Angular Basics', 'APIs & Fetch', 'Node.js & Express', 'Databases (SQL/NoSQL)'],
    advanced: ['Server-Side Rendering', 'Micro-frontends', 'Web Performance', 'Authentication & Security'],
  },
  'Machine Learning': {
    beginner: ['Python & NumPy', 'Pandas & Data Viz', 'Linear Regression', 'Intro to Scikit-Learn'],
    intermediate: ['Classification Models', 'Decision Trees & Ensembles', 'Intro to Neural Networks', 'Feature Engineering'],
    advanced: ['Deep Learning (CNNs, RNNs)', 'Natural Language Processing', 'MLOps', 'Reinforcement Learning'],
  },
  'System Design': {
    beginner: ['Client-Server Model', 'Load Balancers', 'Databases (SQL vs NoSQL)', 'Caching Basics'],
    intermediate: ['Scaling Web Apps', 'Designing for Resiliency', 'Message Queues', 'CDNs'],
    advanced: ['Distributed Systems', 'CAP Theorem', 'Microservices Architecture', 'System Design Patterns'],
  },
};

const LEARNING_STYLES = [
  { id: 'visual', label: 'Visual Learner', desc: 'Diagrams, flowcharts, videos', icon: '👁️' },
  { id: 'practical', label: 'Hands-on', desc: 'Coding exercises, projects', icon: '⚡' },
  { id: 'theoretical', label: 'Conceptual', desc: 'Theory, documentation, articles', icon: '📚' }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    experience: 'beginner',
    goals: [],
    timeCommitment: 2,
    focusAreas: [],
    subjectLevels: {},
    preferredStyle: 'practical'
  });

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const saveProfileToDatabase = async () => {
    try {
      // Create user in database
      const userData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        avatar: profile.avatar,
        experience: profile.experience,
        time_commitment: profile.timeCommitment,
        preferred_style: profile.preferredStyle,
        goals: profile.goals,
        focus_areas: profile.focusAreas,
        subject_levels: profile.subjectLevels || {},
        social_links: profile.socialLinks || {}
      };

      const user = await userAPI.create(userData);
      
      // Store user ID and profile in localStorage
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userProfile', JSON.stringify({
        ...profile,
        id: user.id
      }));
      
      console.log('✅ User created successfully:', user.id);
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Error creating user:', error);
      // Fallback to localStorage only
      localStorage.setItem('userProfile', JSON.stringify(profile));
      navigate('/dashboard');
    }
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      // When moving from focus areas to subject levels, initialize subject levels
      if (step === 4) {
        const newSubjectLevels: Record<string, SubjectLevel> = {};
        for (const area of profile.focusAreas) {
          newSubjectLevels[area] = profile.subjectLevels[area] || {
            level: profile.experience,
            topics: [],
          };
        }
        setProfile(p => ({ ...p, subjectLevels: newSubjectLevels }));
      }
      setStep(step + 1);
    } else {
      // Save profile to both localStorage and database
      await saveProfileToDatabase();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleSelection = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const handleSubjectLevelChange = (subject: string, level: 'beginner' | 'intermediate' | 'advanced') => {
    setProfile(p => ({
      ...p,
      subjectLevels: {
        ...p.subjectLevels,
        [subject]: { level, topics: [] }, // Reset topics when level changes
      },
    }));
  };

  const handleTopicToggle = (subject: string, topic: string) => {
    const currentTopics = profile.subjectLevels[subject]?.topics || [];
    const newTopics = currentTopics.includes(topic)
      ? currentTopics.filter(t => t !== topic)
      : [...currentTopics, topic];
    setProfile(p => ({
      ...p,
      subjectLevels: {
        ...p.subjectLevels,
        [subject]: { ...p.subjectLevels[subject], topics: newTopics },
      },
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return profile.name.trim().length > 0;
      case 2: return true; // Experience level always has default
      case 3: return profile.goals.length > 0;
      case 4: return profile.focusAreas.length > 0;
      case 5: return Object.values(profile.subjectLevels).every(s => s.topics.length > 0);
      case 6: return true; // Learning style always has default
      default: return false;
    }
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
          <p className="text-muted-foreground">Let's personalize your learning journey</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Setup Progress</span>
            <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">
                {step === 1 && "Welcome! What's your name?"}
                {step === 2 && "What's your coding experience?"}
                {step === 3 && "What are your learning goals?"}
                {step === 4 && "Which areas interest you most?"}
                {step === 5 && "Fine-tune your focus areas"}
                {step === 6 && "How do you prefer to learn?"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "We'll use this to personalize your experience"}
                {step === 2 && "This helps us recommend the right difficulty level"}
                {step === 3 && "Select all that apply - we'll tailor your journey"}
                {step === 4 && "Choose your focus areas for customized content"}
                {step === 5 && "Select your comfort level and topics for each area"}
                {step === 6 && "We'll adapt our teaching style to match your preferences"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Name & Time Commitment */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="text-lg"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Daily Time Commitment</Label>
                    <div className="px-4">
                      <input
                        type="range"
                        min="0.5"
                        max="8"
                        step="0.5"
                        value={profile.timeCommitment}
                        onChange={(e) => setProfile({ ...profile, timeCommitment: Number(e.target.value) })}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>30 min</span>
                        <span className="font-medium text-foreground">
                          {profile.timeCommitment} hour{profile.timeCommitment !== 1 ? 's' : ''} per day
                        </span>
                        <span>8 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Experience Level */}
              {step === 2 && (
                <div className="grid gap-4">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setProfile({ ...profile, experience: level.id as any })}
                      className={cn(
                        "p-4 rounded-lg border-2 text-left transition-all hover:shadow-md",
                        profile.experience === level.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <level.icon className="h-6 w-6 text-primary" />
                        <div>
                          <div className="font-semibold">{level.label}</div>
                          <div className="text-sm text-muted-foreground">{level.desc}</div>
                        </div>
                        {profile.experience === level.id && (
                          <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Learning Goals */}
              {step === 3 && (
                <div className="grid gap-3">
                  {LEARNING_GOALS.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => toggleSelection(profile.goals, goal, (goals) => setProfile({ ...profile, goals }))}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all hover:shadow-sm",
                        profile.goals.includes(goal)
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{goal}</span>
                        {profile.goals.includes(goal) && (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 4: Focus Areas */}
              {step === 4 && (
                <div className="grid gap-3">
                  {FOCUS_AREAS.map((area) => (
                    <button
                      key={area}
                      onClick={() => toggleSelection(profile.focusAreas, area, (areas) => setProfile({ ...profile, focusAreas: areas }))}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all hover:shadow-sm",
                        profile.focusAreas.includes(area)
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{area}</span>
                        {profile.focusAreas.includes(area) && (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 5: Subject-Specific Difficulty & Topics */}
              {step === 5 && (
                <Tabs defaultValue={profile.focusAreas[0]} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                    {profile.focusAreas.map((area) => (
                      <TabsTrigger key={area} value={area} className="text-xs">
                        {area.split(' ')[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {profile.focusAreas.map((subject) => (
                    <TabsContent key={subject} value={subject} className="space-y-4 mt-4">
                      <div className="text-center">
                        <h3 className="font-semibold text-lg">{subject}</h3>
                        <p className="text-sm text-muted-foreground">Choose your comfort level and topics</p>
                      </div>
                      
                      {/* Difficulty Level Selection */}
                      <div className="space-y-2">
                        <Label>Difficulty Level</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {EXPERIENCE_LEVELS.map((level) => (
                            <button
                              key={level.id}
                              onClick={() => handleSubjectLevelChange(subject, level.id as any)}
                              className={cn(
                                "p-2 rounded-lg border text-center transition-all",
                                profile.subjectLevels[subject]?.level === level.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <div className="text-sm font-medium">{level.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Topics Selection */}
                      {profile.subjectLevels[subject]?.level && (
                        <div className="space-y-2">
                          <Label>Topics to Focus On</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {SUBJECT_TOPICS[subject]?.[profile.subjectLevels[subject].level]?.map((topic) => (
                              <button
                                key={topic}
                                onClick={() => handleTopicToggle(subject, topic)}
                                className={cn(
                                  "p-2 rounded-lg border text-left text-sm transition-all",
                                  profile.subjectLevels[subject]?.topics.includes(topic)
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{topic}</span>
                                  {profile.subjectLevels[subject]?.topics.includes(topic) && (
                                    <CheckCircle2 className="h-3 w-3 text-primary" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              )}

              {/* Step 6: Learning Style */}
              {step === 6 && (
                <div className="grid gap-4">
                  {LEARNING_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setProfile({ ...profile, preferredStyle: style.id as any })}
                      className={cn(
                        "p-4 rounded-lg border-2 text-left transition-all hover:shadow-md",
                        profile.preferredStyle === style.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{style.icon}</span>
                        <div>
                          <div className="font-semibold">{style.label}</div>
                          <div className="text-sm text-muted-foreground">{style.desc}</div>
                        </div>
                        {profile.preferredStyle === style.id && (
                          <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="gap-2"
            >
              {step === totalSteps ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
