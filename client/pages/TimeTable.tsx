import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TimeTableRequest, TimeTableResponse, TimeTableBlock, SubjectLevel, QuizRequest, QuizResponse, QuizSubmission, QuizResult } from '@shared/api';
import { Quiz, QuizResults } from '@/components/Quiz';
import { TimetableProgress } from '@/components/TimetableProgress';
import { Home, ArrowLeft, CheckCircle, CheckCircle2, Play, BookOpen, Code, Clock, Target, Users, Award, Brain } from 'lucide-react';

// Map onboarding focus areas to timetable subjects
const FOCUS_AREA_MAPPING: Record<string, string> = {
  'Data Structures & Algorithms': 'Data Structures & Algorithms',
  'Web Development': 'Web Development', 
  'Machine Learning': 'Machine Learning',
  'System Design': 'System Design'
};

const TimeTable = () => {
  console.log('🔧 TimeTable component mounting...');
  const navigate = useNavigate();
  const [dailyHours, setDailyHours] = useState(4);
  const [selfRating, setSelfRating] = useState<Record<string, number>>({});
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [goal, setGoal] = useState('Interview Prep');
  const [timetable, setTimetable] = useState<TimeTableResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState<'daily' | 'weekly'>('daily');
  const [studyDays, setStudyDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [showProgress, setShowProgress] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Quiz-related state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizResponse | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);

  // Adaptive timetable state
  const [weeklyProgress, setWeeklyProgress] = useState<Record<string, number>>({});
  const [lastWeeklyUpdate, setLastWeeklyUpdate] = useState<string | null>(null);
  const [dailyCompletions, setDailyCompletions] = useState<Record<string, boolean>>({});
  const [adaptiveMode, setAdaptiveMode] = useState(false); // Start disabled to avoid issues
  const [nextUpdateDate, setNextUpdateDate] = useState<string | null>(null);

  // Load user profile and initialize form data
  useEffect(() => {
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      setUserProfile(profile);
      setDailyHours(profile.timeCommitment || 4);
      
      // Extract subjects from user's focus areas
      const subjects = profile.focusAreas?.map((area: string) => FOCUS_AREA_MAPPING[area] || area) || [];
      if (subjects.length > 0) {
        setAvailableSubjects(subjects);
        const initialRatings: Record<string, number> = {};
        const initialScores: Record<string, number> = {};
        subjects.forEach((subject: string) => {
          initialRatings[subject] = 3;
          initialScores[subject] = 50;
        });
        setSelfRating(initialRatings);
        setQuizScores(initialScores);
      } else {
        // Default subjects if no profile
        const defaultSubjects = ['Data Structures & Algorithms', 'Web Development'];
        setAvailableSubjects(defaultSubjects);
        const initialRatings: Record<string, number> = {};
        const initialScores: Record<string, number> = {};
        defaultSubjects.forEach((subject: string) => {
          initialRatings[subject] = 3;
          initialScores[subject] = 50;
        });
        setSelfRating(initialRatings);
        setQuizScores(initialScores);
      }
    } else {
      // Default subjects if no profile
      const defaultSubjects = ['Data Structures & Algorithms', 'Web Development'];
      setAvailableSubjects(defaultSubjects);
      const initialRatings: Record<string, number> = {};
      const initialScores: Record<string, number> = {};
      defaultSubjects.forEach((subject: string) => {
        initialRatings[subject] = 3;
        initialScores[subject] = 50;
      });
      setSelfRating(initialRatings);
      setQuizScores(initialScores);
    }
    
    // Load saved timetable from localStorage
    loadSavedTimetable();
    
    // Load adaptive timetable data safely
    try {
      loadAdaptiveTimetableData();
      
      // Check if it's time for weekly update (Saturday)
      checkWeeklyUpdate();
      
      // Check if daily update is needed
      checkDailyUpdate();
    } catch (error) {
      console.error('Error initializing adaptive system:', error);
    }
  }, []);

  // Load saved timetable from localStorage
  const loadSavedTimetable = () => {
    try {
      const savedTimetable = localStorage.getItem('savedTimetable');
      const timetableTimestamp = localStorage.getItem('timetableGeneratedAt');
      
      if (savedTimetable && timetableTimestamp) {
        const generatedAt = new Date(timetableTimestamp);
        const now = new Date();
        const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
        
        // Check if timetable is still valid (less than 1 week old)
        if (now.getTime() - generatedAt.getTime() < oneWeekInMs) {
          console.log('📅 Loading saved timetable from localStorage');
          const parsedTimetable = JSON.parse(savedTimetable);
          setTimetable(parsedTimetable);
          
          // Show success message that timetable was restored
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
        } else {
          console.log('📅 Saved timetable expired, clearing from localStorage');
          // Clear expired timetable
          localStorage.removeItem('savedTimetable');
          localStorage.removeItem('timetableGeneratedAt');
        }
      }
    } catch (error) {
      console.error('Error loading saved timetable:', error);
      // Clear corrupted data
      localStorage.removeItem('savedTimetable');
      localStorage.removeItem('timetableGeneratedAt');
    }
  };

  // Save timetable to localStorage with timestamp
  const saveTimetableToStorage = (timetableData: TimeTableResponse) => {
    try {
      const timestamp = new Date().toISOString();
      localStorage.setItem('savedTimetable', JSON.stringify(timetableData));
      localStorage.setItem('timetableGeneratedAt', timestamp);
      console.log('💾 Timetable saved to localStorage with timestamp:', timestamp);
    } catch (error) {
      console.error('Error saving timetable to localStorage:', error);
    }
  };

  // Clear saved timetable from localStorage
  const clearSavedTimetable = () => {
    localStorage.removeItem('savedTimetable');
    localStorage.removeItem('timetableGeneratedAt');
    setTimetable(null);
    console.log('🗑️ Saved timetable cleared from localStorage');
  };

  // Check if current timetable is from storage
  const isTimetableFromStorage = () => {
    return localStorage.getItem('savedTimetable') && localStorage.getItem('timetableGeneratedAt');
  };

  // Load adaptive timetable data from localStorage
  const loadAdaptiveTimetableData = () => {
    try {
      const progressData = localStorage.getItem('weeklyProgress');
      const lastUpdate = localStorage.getItem('lastWeeklyUpdate');
      const dailyData = localStorage.getItem('dailyCompletions');
      const nextUpdate = localStorage.getItem('nextUpdateDate');
      
      if (progressData) setWeeklyProgress(JSON.parse(progressData));
      if (lastUpdate) setLastWeeklyUpdate(lastUpdate);
      if (dailyData) setDailyCompletions(JSON.parse(dailyData));
      if (nextUpdate) setNextUpdateDate(nextUpdate);
    } catch (error) {
      console.error('Error loading adaptive data:', error);
      // Reset to defaults if corrupted
      setWeeklyProgress({});
      setDailyCompletions({});
    }
  };

  // Check if weekly update is needed (every Saturday)
  const checkWeeklyUpdate = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const lastUpdate = lastWeeklyUpdate ? new Date(lastWeeklyUpdate) : null;
    const weeksSinceUpdate = lastUpdate ? Math.floor((today.getTime() - lastUpdate.getTime()) / (7 * 24 * 60 * 60 * 1000)) : 1;
    
    if (dayOfWeek === 6 && weeksSinceUpdate >= 1) { // Saturday and at least 1 week passed
      console.log('📅 Weekly update needed - triggering timetable refresh');
      scheduleWeeklyUpdate();
    }
    
    // Set next update date to next Saturday
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + (6 - dayOfWeek + 7) % 7);
    if (nextSaturday <= today) nextSaturday.setDate(nextSaturday.getDate() + 7);
    setNextUpdateDate(nextSaturday.toISOString());
    localStorage.setItem('nextUpdateDate', nextSaturday.toISOString());
  };

  // Check if daily update is needed based on previous day progress
  const checkDailyUpdate = () => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toDateString();
    
    // Check if yesterday's tasks were completed
    if (dailyCompletions[yesterdayKey] !== undefined && timetable) {
      console.log('📚 Daily update check - adjusting today\'s schedule based on yesterday\'s progress');
      updateDailySchedule(dailyCompletions[yesterdayKey]);
    }
  };

  // Schedule weekly timetable update
  const scheduleWeeklyUpdate = async () => {
    if (!adaptiveMode) return;
    
    try {
      console.log('🔄 Starting weekly timetable update...');
      
      // Calculate weekly progress
      const progressSummary = calculateWeeklyProgress();
      
      // Update self-ratings based on progress
      const updatedRatings = adjustRatingsBasedOnProgress(progressSummary);
      setSelfRating(updatedRatings);
      
      // Regenerate timetable with updated data
      await regenerateTimetableWithProgress(progressSummary);
      
      // Update last update timestamp
      const now = new Date().toISOString();
      setLastWeeklyUpdate(now);
      localStorage.setItem('lastWeeklyUpdate', now);
      
      console.log('✅ Weekly timetable update completed');
    } catch (error) {
      console.error('❌ Error during weekly update:', error);
    }
  };

  // Calculate weekly progress based on completed tasks
  const calculateWeeklyProgress = () => {
    const progress: Record<string, { completed: number; total: number; accuracy: number }> = {};
    
    availableSubjects.forEach(subject => {
      const subjectProgress = weeklyProgress[subject] || 0;
      const completedTasks = Object.values(dailyCompletions).filter(Boolean).length;
      const totalTasks = Object.keys(dailyCompletions).length || 7;
      
      progress[subject] = {
        completed: completedTasks,
        total: totalTasks,
        accuracy: Math.min(100, Math.max(0, subjectProgress + (completedTasks / totalTasks) * 20))
      };
    });
    
    return progress;
  };

  // Adjust self-ratings based on weekly progress
  const adjustRatingsBasedOnProgress = (progressSummary: Record<string, any>) => {
    const updatedRatings = { ...selfRating };
    
    Object.keys(progressSummary).forEach(subject => {
      const progress = progressSummary[subject];
      const currentRating = selfRating[subject] || 3;
      
      // Increase rating if high accuracy, decrease if low
      if (progress.accuracy >= 80) {
        updatedRatings[subject] = Math.min(5, currentRating + 0.5);
      } else if (progress.accuracy < 50) {
        updatedRatings[subject] = Math.max(1, currentRating - 0.5);
      }
    });
    
    return updatedRatings;
  };

  // Update daily schedule based on previous day's progress
  const updateDailySchedule = (yesterdayCompleted: boolean) => {
    if (!timetable || !adaptiveMode) return;
    
    const today = new Date().toDateString();
    
    // If yesterday was not completed, add extra review time today
    if (!yesterdayCompleted) {
      console.log('📝 Adding extra review time due to incomplete yesterday');
      // This would modify today's schedule to include review of yesterday's topics
    }
    
    // Mark today's schedule as updated
    localStorage.setItem(`dailyUpdate_${today}`, 'true');
  };

  // Regenerate timetable with progress data
  const regenerateTimetableWithProgress = async (progressSummary: Record<string, any>) => {
    if (!userProfile) return;
    
    setLoading(true);
    
    try {
      // Update quiz scores based on progress
      const updatedQuizScores: Record<string, number> = {};
      Object.keys(progressSummary).forEach(subject => {
        updatedQuizScores[subject] = progressSummary[subject].accuracy;
      });
      setQuizScores(updatedQuizScores);
      
      // Prepare enhanced subject levels based on progress
      const enhancedSubjectLevels: Record<string, SubjectLevel> = {};
      availableSubjects.forEach(subject => {
        const progress = progressSummary[subject];
        const currentLevel = userProfile.subjectLevels?.[subject]?.level || 'beginner';
        
        // Upgrade level if high progress
        let newLevel = currentLevel;
        if (progress.accuracy >= 85 && currentLevel === 'beginner') {
          newLevel = 'intermediate';
        } else if (progress.accuracy >= 90 && currentLevel === 'intermediate') {
          newLevel = 'advanced';
        }
        
        enhancedSubjectLevels[subject] = {
          level: newLevel as 'beginner' | 'intermediate' | 'advanced',
          topics: userProfile.subjectLevels?.[subject]?.topics || ['Arrays & Strings']
        };
      });
      
      const requestData: TimeTableRequest = {
        daily_hours: dailyHours,
        self_rating: selfRating,
        quiz_scores: updatedQuizScores,
        goal: `${goal} - Week ${Math.ceil((new Date().getTime() - new Date(lastWeeklyUpdate || new Date()).getTime()) / (7 * 24 * 60 * 60 * 1000))}`,
        subject_levels: enhancedSubjectLevels,
        schedule_type: scheduleType,
        study_days: studyDays,
      };

      const response = await fetch('/api/generate-timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...requestData,
          userId: userProfile?.id || `user_${Date.now()}`,
          isWeeklyUpdate: true,
          progressData: progressSummary
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Timetable regeneration failed: ${response.status}`);
      }
      
      const data: TimeTableResponse = await response.json();
      console.log('✅ Adaptive timetable regenerated:', data);
      setTimetable(data);
      
      // Save updated timetable to localStorage
      saveTimetableToStorage(data);
      
      // Show update notification
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
      
    } catch (error) {
      console.error('❌ Error regenerating timetable:', error);
    }
    
    setLoading(false);
  };

  // Mark daily task as completed
  const markDayCompleted = (date: string, completed: boolean) => {
    const updatedCompletions = { ...dailyCompletions, [date]: completed };
    setDailyCompletions(updatedCompletions);
    localStorage.setItem('dailyCompletions', JSON.stringify(updatedCompletions));
    
    // Update weekly progress
    const subject = availableSubjects[0]; // Simplified - in real app, track per subject
    const currentProgress = weeklyProgress[subject] || 0;
    const progressIncrement = completed ? 10 : -5;
    const updatedProgress = { ...weeklyProgress, [subject]: Math.max(0, Math.min(100, currentProgress + progressIncrement)) };
    setWeeklyProgress(updatedProgress);
    localStorage.setItem('weeklyProgress', JSON.stringify(updatedProgress));
  };

  const handleRatingChange = (subject: string, value: number[]) => {
    setSelfRating((prev) => ({ ...prev, [subject]: value[0] }));
  };

  const handleScoreChange = (subject: string, value: string) => {
    setQuizScores((prev) => ({ ...prev, [subject]: parseInt(value, 10) || 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // First, generate and show the quiz
    await generateQuiz();
  };
  
  const generateQuiz = async () => {
    setQuizLoading(true);
    
    try {
      console.log('🎯 Starting quiz generation...');
      console.log('Available subjects:', availableSubjects);
      console.log('User profile:', userProfile);
      
      // Ensure we have subjects - use fallback if none available
      let subjects = availableSubjects;
      if (!subjects || subjects.length === 0) {
        console.log('No subjects from profile, using default subjects');
        subjects = ['Data Structures & Algorithms', 'Web Development'];
        setAvailableSubjects(subjects);
      }
      
      console.log('Using subjects for quiz:', subjects);
      
      // Prepare subject levels for the quiz request
      let subjectLevels: Record<string, SubjectLevel> = {};
      
      if (userProfile?.subjectLevels) {
        console.log('Using user profile subject levels:', userProfile.subjectLevels);
        // Map from focus areas to subjects
        Object.keys(userProfile.subjectLevels).forEach((focusArea: string) => {
          const mappedSubject = FOCUS_AREA_MAPPING[focusArea] || focusArea;
          const subjectLevel = userProfile.subjectLevels[focusArea];
          subjectLevels[mappedSubject] = subjectLevel;
        });
      } else {
        console.log('Creating fallback subject levels');
        // Create fallback subject levels
        subjects.forEach(subject => {
          subjectLevels[subject] = {
            level: 'beginner',
            topics: subject === 'Data Structures & Algorithms' ? ['Arrays & Strings', 'Linked Lists'] :
                   subject === 'Web Development' ? ['HTML & CSS', 'JavaScript Fundamentals'] :
                   subject === 'Machine Learning' ? ['Python & NumPy'] :
                   subject === 'System Design' ? ['Client-Server Architecture'] :
                   ['Arrays & Strings'] // Default fallback
          };
        });
      }
      
      console.log('Final subject levels being sent:', subjectLevels);
      
      const quizRequest: QuizRequest = {
        subjects: subjects,
        subject_levels: subjectLevels
      };
      
      console.log('Quiz request:', quizRequest);
      
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizRequest),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Quiz generation failed:', response.status, errorText);
        throw new Error(`Quiz generation failed: ${response.status}`);
      }
      
      const quizData: QuizResponse = await response.json();
      console.log('✅ Quiz generated successfully:', quizData);
      setQuizQuestions(quizData);
      setShowQuiz(true);
    } catch (error) {
      console.error('Error generating quiz:', error);
    }
    setQuizLoading(false);
  };
  
  const handleQuizComplete = async (submission: QuizSubmission) => {
    try {
      // Get userId from userProfile
      const userId = userProfile?.id || `user_${Date.now()}`;
      
      // Evaluate quiz results
      const response = await fetch('/api/quiz/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...submission,
          userId
        }),
      });
      
      const result: QuizResult = await response.json();
      setQuizResult(result);
      setShowQuiz(false);
      
      // Update quiz scores based on results
      const updatedQuizScores: Record<string, number> = {};
      Object.entries(result.subjectResults).forEach(([subject, data]) => {
        updatedQuizScores[subject] = data.accuracy;
      });
      setQuizScores(updatedQuizScores);
      
    } catch (error) {
      console.error('Error evaluating quiz:', error);
    }
  };
  
  const generateTimetableFromQuiz = async () => {
    if (!quizResult) {
      console.log('❌ No quiz result available');
      return;
    }
    
    setLoading(true);
    console.log('📅 Starting timetable generation from quiz...');
    
    try {
      // Prepare subject levels data, potentially adjusted based on quiz results
      const subjectLevels: Record<string, SubjectLevel> = {};
      if (userProfile?.subjectLevels) {
        console.log('Using user profile subject levels');
        Object.keys(userProfile.subjectLevels).forEach((focusArea: string) => {
          const mappedSubject = FOCUS_AREA_MAPPING[focusArea] || focusArea;
          const originalLevel = userProfile.subjectLevels[focusArea];
          
          // Check if quiz recommends a different level
          const recommendation = quizResult.recommendedAdjustments[mappedSubject];
          const adjustedLevel = recommendation?.recommendedLevel || originalLevel.level;
          
          subjectLevels[mappedSubject] = {
            ...originalLevel,
            level: adjustedLevel as 'beginner' | 'intermediate' | 'advanced'
          };
        });
      } else {
        console.log('Creating fallback subject levels for timetable');
        // Create fallback subject levels based on available subjects
        availableSubjects.forEach(subject => {
          subjectLevels[subject] = {
            level: 'beginner',
            topics: subject === 'Data Structures & Algorithms' ? ['Arrays & Strings', 'Linked Lists'] :
                   subject === 'Web Development' ? ['HTML & CSS', 'JavaScript Fundamentals'] :
                   subject === 'Machine Learning' ? ['Python & NumPy'] :
                   subject === 'System Design' ? ['Client-Server Architecture'] :
                   ['Arrays & Strings']
          };
        });
      }
      
      console.log('Subject levels for timetable:', subjectLevels);
      
      const requestData: TimeTableRequest = {
        daily_hours: dailyHours,
        self_rating: selfRating,
        quiz_scores: quizScores, // Now contains actual quiz results
        goal,
        subject_levels: subjectLevels,
        schedule_type: scheduleType,
        study_days: studyDays,
      };

      console.log('Sending timetable request:', requestData);
      
      const response = await fetch('/api/generate-timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...requestData,
          userId: userProfile?.id || `user_${Date.now()}`
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Timetable generation failed:', response.status, errorText);
        throw new Error(`Timetable generation failed: ${response.status} - ${errorText}`);
      }
      
      const data: TimeTableResponse = await response.json();
      console.log('✅ Timetable received:', data);
      console.log('📋 Day Plan blocks:', data["Day Plan"]?.length);
      console.log('📅 Schedule type:', scheduleType);
      setTimetable(data);
      
      // Save timetable to localStorage for persistence
      saveTimetableToStorage(data);
      
      // Clear quiz result to show timetable
      setQuizResult(null);
      
      // Show success message
      setShowSuccessMessage(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('❌ Error generating timetable:', error);
      // You could add a user-visible error message here
      alert(`Failed to generate timetable: ${error.message || error}`);
    }
    setLoading(false);
  };
  
  const handleQuizCancel = () => {
    setShowQuiz(false);
    setQuizQuestions(null);
  };
  
  const handleRetakeQuiz = () => {
    setQuizResult(null);
    generateQuiz();
  };

  // Show quiz if active
  if (showQuiz && quizQuestions) {
    return (
      <Quiz
        questions={quizQuestions.questions}
        timeLimit={quizQuestions.timeLimit}
        onComplete={handleQuizComplete}
        onCancel={handleQuizCancel}
      />
    );
  }
  
  // Show quiz results if available
  if (quizResult) {
    return (
      <QuizResults
        result={quizResult}
        onRetake={handleRetakeQuiz}
        onContinue={generateTimetableFromQuiz}
      />
    );
  }

  // Error boundary for adaptive system
  if (loading && !timetable && !showQuiz && !quizResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading timetable system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 print:bg-white">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Modern Header */}
        <div className="relative mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="absolute left-0 top-0 flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl px-4 py-2 backdrop-blur-sm border border-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/30 px-4 py-2 text-sm text-gray-600 mb-4">
              <Brain className="h-4 w-4 text-purple-600" />
              <span>AI-Powered Learning Assistant</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent mb-3">
              Smart Timetable Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create your personalized study schedule with AI-driven recommendations and adaptive learning paths
            </p>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Study Planner
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create a personalized study schedule based on your learning goals and preferences
          </p>
          
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mt-6 mx-auto max-w-md">
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    {isTimetableFromStorage() ? 'Study plan restored from saved data!' : 'Study plan created successfully!'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Timetable Status Info */}
          {timetable && (
            <div className="mt-6 mx-auto max-w-2xl">
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className="text-sm">
                      {(() => {
                        const timestamp = localStorage.getItem('timetableGeneratedAt');
                        if (timestamp) {
                          const date = new Date(timestamp);
                          const now = new Date();
                          const daysAgo = Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
                          const expiresIn = 7 - daysAgo;
                          return `Timetable valid for ${expiresIn} more days (expires ${new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()})`;
                        }
                        return 'Timetable generated just now';
                      })()}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearSavedTimetable}
                    className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Generate New
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Configuration Form */}
        <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-t-lg">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-semibold text-white">Study Preferences</CardTitle>
              </div>
              <p className="text-blue-100">Configure your AI-powered learning schedule</p>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Daily Hours */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <Label htmlFor="daily-hours" className="text-base font-medium text-gray-900">
                    Daily Study Hours: <span className="text-blue-600 font-semibold">{dailyHours}</span>
                  </Label>
                </div>
                <div className="px-3">
                  <Slider
                    id="daily-hours"
                    min={1}
                    max={12}
                    step={1}
                    value={[dailyHours]}
                    onValueChange={(value) => setDailyHours(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 hour</span>
                    <span>12 hours</span>
                  </div>
                </div>
              </div>
              
              {/* Schedule Type */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-gray-500" />
                  <Label className="text-base font-medium text-gray-900">Schedule Type</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    scheduleType === 'daily' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="daily"
                      checked={scheduleType === 'daily'}
                      onChange={(e) => setScheduleType(e.target.value as 'daily' | 'weekly')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        scheduleType === 'daily' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {scheduleType === 'daily' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>}
                      </div>
                      <span className="font-medium">Daily Plan</span>
                    </div>
                  </label>
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    scheduleType === 'weekly' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="weekly"
                      checked={scheduleType === 'weekly'}
                      onChange={(e) => setScheduleType(e.target.value as 'daily' | 'weekly')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        scheduleType === 'weekly' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {scheduleType === 'weekly' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>}
                      </div>
                      <span className="font-medium">Weekly Plan</span>
                    </div>
                  </label>
                </div>
              </div>

              {scheduleType === 'weekly' && (
                <div className="space-y-2">
                  <Label>Study Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <label key={day} className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={studyDays.includes(day)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setStudyDays([...studyDays, day]);
                            } else {
                              setStudyDays(studyDays.filter(d => d !== day));
                            }
                          }}
                        />
                        <span className="text-sm">{day.slice(0, 3)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

            <div className="space-y-4">
              <h3 className="font-semibold">Self-Rating (1-5)</h3>
              {availableSubjects.map((subject) => (
                <div key={subject} className="space-y-2">
                  <Label htmlFor={`rating-${subject}`}>{subject}: {selfRating[subject] || 3}</Label>
                  <Slider
                    id={`rating-${subject}`}
                    min={1}
                    max={5}
                    step={1}
                    value={[selfRating[subject] || 3]}
                    onValueChange={(value) => handleRatingChange(subject, value)}
                  />
                </div>
              ))}
            </div>

            <Button type="submit" disabled={loading || quizLoading} className="w-full">
              {quizLoading ? 'Preparing Quiz...' : loading ? 'Generating...' : 'Take Knowledge Quiz & Generate Timetable'}
            </Button>
            
            {!quizResult && (
              <div className="text-center text-sm text-muted-foreground mt-2">
                📝 We'll start with a quick 10-minute quiz to assess your knowledge and create the perfect timetable for you!
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {userProfile && (
        <Card className="mt-6 max-w-4xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold">👤 Your Learning Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Experience Level:</strong> {userProfile.experience}
              </div>
              <div>
                <strong>Daily Commitment:</strong> {dailyHours} hours
              </div>
              <div>
                <strong>Learning Style:</strong> {userProfile.preferredStyle}
              </div>
            </div>
            {userProfile.subjectLevels && (
              <div className="mt-4">
                <strong>Subject Focus:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(userProfile.subjectLevels).map(([subject, level]: [string, any]) => (
                    <Badge key={subject} variant="secondary">
                      {subject} ({level.level}) - {level.topics.length} topics
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Adaptive Mode Toggle */}
      {!adaptiveMode && (
        <Card className="mt-6 max-w-4xl mx-auto shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">🚀 Enable Adaptive Learning</h3>
              <p className="text-gray-600 mb-4">
                Turn on adaptive mode to automatically adjust your timetable based on weekly progress
              </p>
              <Button
                onClick={() => setAdaptiveMode(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                ✨ Enable Adaptive Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Adaptive Timetable Status */}
      {adaptiveMode && availableSubjects.length > 0 && (
        <Card className="mt-6 max-w-4xl mx-auto shadow-lg border-0 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              🔄 Adaptive Learning System
              <Badge variant="secondary" className="bg-white/20 text-white">
                {adaptiveMode ? 'Active' : 'Disabled'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Weekly Progress */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">📊 Weekly Progress</h4>
                {availableSubjects.map(subject => (
                  <div key={subject} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{subject}</span>
                      <span className="font-medium">{Math.round(weeklyProgress[subject] || 0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(100, Math.max(0, weeklyProgress[subject] || 0))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Update Schedule */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">📅 Update Schedule</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Last Update:</span>
                    <span className="font-medium">
                      {lastWeeklyUpdate ? new Date(lastWeeklyUpdate).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Update:</span>
                    <span className="font-medium text-blue-600">
                      {nextUpdateDate ? new Date(nextUpdateDate).toLocaleDateString() : 'This Saturday'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days Completed:</span>
                    <span className="font-medium">
                      {Object.values(dailyCompletions).filter(Boolean).length} / {Object.keys(dailyCompletions).length || 7}
                    </span>
                  </div>
                </div>
              </div>

              {/* Manual Controls */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">⚙️ Controls</h4>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      try {
                        scheduleWeeklyUpdate();
                      } catch (error) {
                        console.error('Error in weekly update:', error);
                        alert('Error updating timetable. Please try again.');
                      }
                    }}
                    disabled={loading}
                    className="w-full"
                  >
                    🔄 Force Weekly Update
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const today = new Date().toDateString();
                      markDayCompleted(today, true);
                    }}
                    className="w-full"
                  >
                    ✅ Mark Today Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAdaptiveMode(!adaptiveMode)}
                    className="w-full"
                  >
                    {adaptiveMode ? '⏸️ Disable' : '▶️ Enable'} Adaptive Mode
                  </Button>
                </div>
              </div>
            </div>

            {/* Weekly Update Notification */}
            {new Date().getDay() === 6 && ( // Show on Saturday
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">Saturday Review Day!</span>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  It's time for your weekly timetable review. Your schedule will be automatically updated based on this week's progress.
                </p>
                <Button
                  size="sm"
                  className="mt-3 bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => scheduleWeeklyUpdate()}
                  disabled={loading}
                >
                  🔄 Start Weekly Review
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}


      {timetable && (
        <div className="mt-8 max-w-6xl mx-auto space-y-6">
          {/* Metadata Card */}
          {timetable.metadata && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  📊 Study Plan Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{timetable.metadata.totalStudyTime}</p>
                    <p className="text-sm text-muted-foreground">Total Study Time</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{timetable.metadata.subjectsCount}</p>
                    <p className="text-sm text-muted-foreground">Subjects</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{timetable.metadata.topicsCount}</p>
                    <p className="text-sm text-muted-foreground">Topics</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{scheduleType === 'weekly' ? studyDays.length : 1}</p>
                    <p className="text-sm text-muted-foreground">Study Days</p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">💡 Study Tips:</h4>
                  <ul className="text-sm space-y-1">
                    {timetable.metadata.recommendedBreaks.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weekly Plan Display - Table Format */}
          {scheduleType === 'weekly' && timetable["Weekly Plan"] && (
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="border-b border-gray-100 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">📅 Weekly Schedule</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Your personalized weekly learning plan</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Day
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Activity
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Resources
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(timetable["Weekly Plan"]).map(([day, blocks]) => 
                        blocks.map((block, blockIndex) => {
                          const startHour = 9 + blockIndex * 2; // 2 hour intervals
                          const endHour = startHour + Math.floor(parseInt(block.duration) / 60);
                          const timeSlot = `${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`;
                          
                          return (
                            <tr key={`${day}-${blockIndex}`} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {day}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {timeSlot}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{block.subject}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 max-w-xs">
                                  {block.activity}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {block.duration}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  {block.resources.video !== "N/A" && (
                                    <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                      <Play className="h-3 w-3" />
                                      <span>Video</span>
                                    </div>
                                  )}
                                  {block.resources.docs !== "N/A" && (
                                    <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                      <BookOpen className="h-3 w-3" />
                                      <span>Docs</span>
                                    </div>
                                  )}
                                  {block.resources.practice !== "N/A" && (
                                    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                                      <Code className="h-3 w-3" />
                                      <span>Practice</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Complete
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Weekly Summary */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <span>Study Days: {Object.keys(timetable["Weekly Plan"]).length}</span>
                    <span>Total Sessions: {Object.values(timetable["Weekly Plan"]).flat().length}</span>
                    <span>Daily Hours: {timetable.metadata?.totalStudyTime}</span>
                    <span>Subjects: {timetable.metadata?.subjectsCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Plan Display - Table Format */}
          {timetable && timetable["Day Plan"] && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="text-xl font-semibold">📋 Daily Study Plan</CardTitle>
                <p className="text-sm text-orange-100">
                  Your personalized daily study schedule
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time Slot
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Activity
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Resources
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {timetable["Day Plan"].map((block, index) => {
                        // Generate time slots (starting from 9:00 AM)
                        const startHour = 9 + Math.floor(index * 1.5); // 1.5 hour intervals
                        const startMinute = (index * 30) % 60; // 30 min offset for variety
                        const endHour = startHour + Math.floor(parseInt(block.duration) / 60);
                        const endMinute = startMinute + (parseInt(block.duration) % 60);
                        
                        const timeSlot = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')} - ${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {timeSlot}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900">{block.subject}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs">
                                {block.activity}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {block.duration}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge 
                                variant={block.activity.includes('Practice') ? 'default' : 'secondary'}
                                className={block.activity.includes('Practice') 
                                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }
                              >
                                {block.activity.includes('Practice') ? '💻 Practice' : '📚 Study'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                {block.resources.video !== "N/A" && (
                                  <div className="flex items-center gap-1 text-xs text-red-600">
                                    <Play className="h-3 w-3" />
                                    <span>Video</span>
                                  </div>
                                )}
                                {block.resources.docs !== "N/A" && (
                                  <div className="flex items-center gap-1 text-xs text-blue-600">
                                    <BookOpen className="h-3 w-3" />
                                    <span>Docs</span>
                                  </div>
                                )}
                                {block.resources.practice !== "N/A" && (
                                  <div className="flex items-center gap-1 text-xs text-green-600">
                                    <Code className="h-3 w-3" />
                                    <span>Practice</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => {
                                    const today = new Date().toDateString();
                                    const blockKey = `${today}_${block.subject}_${index}`;
                                    markDayCompleted(blockKey, true);
                                  }}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Complete
                                </button>
                                <button 
                                  onClick={() => {
                                    const today = new Date().toDateString();
                                    const blockKey = `${today}_${block.subject}_${index}`;
                                    markDayCompleted(blockKey, false);
                                  }}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                                >
                                  Skip
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Summary with Adaptive Info */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>Total Study Blocks: {timetable["Day Plan"].length}</span>
                      <span>Total Duration: {timetable.metadata?.totalStudyTime}</span>
                      <span>Subjects: {timetable.metadata?.subjectsCount}</span>
                      {adaptiveMode && (
                        <span className="text-purple-600 font-medium">
                          🔄 Adaptive Mode Active
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.print()}
                        className="text-xs"
                      >
                        📄 Print Schedule
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          const csvContent = [
                            ['Time Slot', 'Subject', 'Activity', 'Duration', 'Type'],
                            ...timetable["Day Plan"].map((block, index) => {
                              const startHour = 9 + Math.floor(index * 1.5);
                              const startMinute = (index * 30) % 60;
                              const endHour = startHour + Math.floor(parseInt(block.duration) / 60);
                              const endMinute = startMinute + (parseInt(block.duration) % 60);
                              const timeSlot = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')} - ${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
                              return [
                                timeSlot,
                                block.subject,
                                block.activity,
                                block.duration,
                                block.activity.includes('Practice') ? 'Practice' : 'Study'
                              ];
                            })
                          ].map(row => row.join(',')).join('\n');
                          
                          const blob = new Blob([csvContent], { type: 'text/csv' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'study-timetable.csv';
                          a.click();
                          window.URL.revokeObjectURL(url);
                        }}
                        className="text-xs"
                      >
                        📊 Export CSV
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Tracking */}
          {timetable && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between text-xl font-semibold">
                  🎯 Study Session Tracker
                  <Button
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    onClick={() => setShowProgress(!showProgress)}
                  >
                    {showProgress ? 'Hide Tracker' : 'Start Study Session'}
                  </Button>
                </CardTitle>
              </CardHeader>
              {showProgress && (
                <CardContent>
                  <TimetableProgress
                    blocks={timetable["Day Plan"]}
                    onComplete={(completedBlocks) => {
                      console.log('Completed blocks:', completedBlocks);
                      // Save progress to localStorage
                      localStorage.setItem('completedStudyBlocks', JSON.stringify(completedBlocks));
                      
                      // Show success message and redirect after completion
                      if (completedBlocks.length === timetable["Day Plan"].length) {
                        setTimeout(() => {
                          navigate('/', { 
                            state: { 
                              message: 'Congratulations! You completed your study session!',
                              type: 'success'
                            }
                          });
                        }, 2000);
                      }
                    }}
                  />
                </CardContent>
              )}
            </Card>
          )}

          {/* Action Buttons */}
          {timetable && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    onClick={() => {
                      // Save timetable to localStorage
                      localStorage.setItem('savedTimetable', JSON.stringify(timetable));
                      localStorage.setItem('timetableGeneratedAt', new Date().toISOString());
                      
                      // Navigate to home with success message
                      navigate('/', { 
                        state: { 
                          message: 'Timetable saved successfully! Ready to start your learning journey.',
                          type: 'success'
                        }
                      });
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Save & Go to Dashboard
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTimetable(null);
                      setShowProgress(false);
                      setShowSuccessMessage(false);
                    }}
                    className="flex items-center gap-2 px-6 py-3"
                  >
                    Generate New Timetable
                  </Button>
                </div>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    💡 Your timetable will be saved and accessible from your dashboard
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default TimeTable;
