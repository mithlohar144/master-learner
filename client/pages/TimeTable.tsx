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
import { Home, ArrowLeft, CheckCircle, Play, BookOpen, Code, Clock, Target, Users, Award } from 'lucide-react';

// Map onboarding focus areas to timetable subjects
const FOCUS_AREA_MAPPING: Record<string, string> = {
  'Data Structures & Algorithms': 'Data Structures & Algorithms',
  'Web Development': 'Web Development', 
  'Machine Learning': 'Machine Learning',
  'System Design': 'System Design'
};

const TimeTable = () => {
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

  // Load user profile and initialize form data
  useEffect(() => {
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      setUserProfile(profile);
      setDailyHours(profile.timeCommitment || 4);
      
      // Extract subjects from user's focus areas
      const subjects = profile.focusAreas?.map((area: string) => FOCUS_AREA_MAPPING[area] || area) || [];
      setAvailableSubjects(subjects);
      
      // Initialize ratings and scores for selected subjects
      const initialRatings: Record<string, number> = {};
      const initialScores: Record<string, number> = {};
      subjects.forEach((subject: string) => {
        initialRatings[subject] = 3; // Default rating
        initialScores[subject] = 50; // Default score
      });
      setSelfRating(initialRatings);
      setQuizScores(initialScores);
      
      // Set goal from profile
      if (profile.goals && profile.goals.length > 0) {
        setGoal(profile.goals[0]);
      }
    } else {
      // Fallback to default subjects if no profile
      const defaultSubjects = ["DSA", "WebDev", "AI/ML", "System Design"];
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
  }, []);

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
                   subject === 'Machine Learning' ? ['Python & NumPy', 'Linear Regression'] :
                   subject === 'System Design' ? ['Client-Server Architecture'] :
                   ['Arrays & Strings'] // Default fallback
          };
        });
      }
      
      console.log('Final subject levels for quiz:', subjectLevels);
      
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
    if (!quizResult) return;
    
    setLoading(true);
    
    try {
      // Prepare subject levels data, potentially adjusted based on quiz results
      const subjectLevels: Record<string, SubjectLevel> = {};
      if (userProfile?.subjectLevels) {
        Object.keys(userProfile.subjectLevels).forEach((focusArea: string) => {
          const mappedSubject = FOCUS_AREA_MAPPING[focusArea] || focusArea;
          const originalLevel = userProfile.subjectLevels[focusArea];
          
          // Check if quiz recommends a different level
          const recommendation = quizResult.recommendedAdjustments[mappedSubject];
          const adjustedLevel = recommendation?.suggestedLevel || originalLevel.level;
          
          subjectLevels[mappedSubject] = {
            ...originalLevel,
            level: adjustedLevel as 'beginner' | 'intermediate' | 'advanced'
          };
        });
      }
      
      const requestData: TimeTableRequest = {
        daily_hours: dailyHours,
        self_rating: selfRating,
        quiz_scores: quizScores, // Now contains actual quiz results
        goal,
        subject_levels: subjectLevels,
        schedule_type: scheduleType,
        study_days: studyDays,
      };

      const response = await fetch('/api/generate-timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...requestData,
          userId: userProfile?.id || `user_${Date.now()}`
        }),
      });
      const data: TimeTableResponse = await response.json();
      setTimetable(data);
      
      // Clear quiz result to show timetable
      setQuizResult(null);
      
      // Show success message
      setShowSuccessMessage(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error generating timetable:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          {timetable && (
            <Button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          )}
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
                  <span className="font-medium">Study plan created successfully!</span>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Configuration Form */}
        <Card className="max-w-4xl mx-auto bg-white shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Study Preferences</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Configure your learning schedule</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="space-y-4">
                <h3 className="font-semibold">Quiz Scores (%)</h3>
                {availableSubjects.map((subject) => (
                  <div key={subject} className="space-y-2">
                    <Label htmlFor={`score-${subject}`}>{subject}</Label>
                    <Input
                      id={`score-${subject}`}
                      type="number"
                      min={0}
                      max={100}
                      value={quizScores[subject] || 50}
                      onChange={(e) => handleScoreChange(subject, e.target.value)}
                    />
                  </div>
                ))}
              </div>
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
    </div>

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

          {/* Weekly Plan Display */}
          {scheduleType === 'weekly' && timetable["Weekly Plan"] && (
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="border-b border-gray-100 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Weekly Schedule</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Your personalized learning plan</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {Object.entries(timetable["Weekly Plan"]).map(([day, blocks]) => (
                    <div key={day} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg text-gray-900">{day}</h3>
                        <Badge variant="outline" className="text-xs">{blocks.length} sessions</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {blocks.map((block, index) => (
                          <div key={index} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{block.subject}</span>
                              <Badge variant={block.activity.includes('Practice') ? 'default' : 'secondary'} className="text-xs">
                                {block.activity.includes('Practice') ? 'Practice' : 'Study'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{block.activity}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{block.duration}</span>
                            </div>
                            
                            {/* Simple Resource Links */}
                            <div className="mt-3 space-y-2">
                              {block.resources.video !== "N/A" && (
                                <div className="flex items-center gap-2 text-xs">
                                  <Play className="h-3 w-3 text-red-500" />
                                  <span className="text-gray-600">Video Tutorial</span>
                                </div>
                              )}
                              {block.resources.docs !== "N/A" && (
                                <div className="flex items-center gap-2 text-xs">
                                  <BookOpen className="h-3 w-3 text-blue-500" />
                                  <span className="text-gray-600">Documentation</span>
                                </div>
                              )}
                              {block.resources.practice !== "N/A" && (
                                <div className="flex items-center gap-2 text-xs">
                                  <Code className="h-3 w-3 text-green-500" />
                                  <span className="text-gray-600">Practice Exercises</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : timetable ? (
            /* Daily Plan Display */
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="text-xl font-semibold">📋 Daily Study Plan</CardTitle>
                <p className="text-sm text-orange-100">
{{ ... }}
                </p>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {timetable["Day Plan"].map((block, index) => (
                  <Card key={index} className="flex flex-col shadow-md hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span className="font-semibold text-gray-800">{block.subject}</span>
                        <Badge 
                          variant={block.activity.includes('Practice') ? 'default' : 'secondary'}
                          className={block.activity.includes('Practice') 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-blue-500 hover:bg-blue-600'
                          }
                        >
                          {block.activity.includes('Practice') ? '💻 Practice' : '📚 Study'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                      <div>
                        <p className="font-medium">{block.activity}</p>
                        <p className="text-sm text-muted-foreground">⏱️ Duration: {block.duration}</p>
                      </div>
                      
                      <div className="space-y-4">
                        {block.resources.video !== "N/A" && (
                          <div className="flex items-center gap-2 text-xs">
                            <Play className="h-3 w-3 text-red-500" />
                            <span className="text-gray-600">Video Tutorial ({block.resources.video})</span>
                          </div>
                        )}
                        {block.resources.docs !== "N/A" && (
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start gap-2">
                              <BookOpen className="h-3 w-3 text-blue-500" />
                              <span className="text-gray-600">Documentation ({block.resources.docs})</span>
                              <span className="text-blue-700">{block.resources.docs}</span>
                            </div>
                          </div>
                        )}
                        {block.resources.practice !== "N/A" && (
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-start gap-2">
                              <span className="text-green-600 font-semibold">💻 Practice:</span>
                              <span className="text-green-700">{block.resources.practice}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 py-3 text-lg"
                  >
                    <Home className="h-5 w-5" />
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
