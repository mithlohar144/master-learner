import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, CheckCircle2, XCircle, Brain, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuizQuestion, QuizSubmission, QuizResult } from '@shared/api';

interface QuizProps {
  questions: QuizQuestion[];
  timeLimit: number; // in minutes
  onComplete: (submission: QuizSubmission) => void;
  onCancel: () => void;
}

interface QuizResultsProps {
  result: QuizResult;
  onRetake: () => void;
  onContinue: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, timeLimit, onComplete, onCancel }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert to seconds
  const [startTime] = useState(new Date().toISOString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const endTime = new Date().toISOString();
    const timeSpent = timeLimit * 60 - timeLeft;

    const submission: QuizSubmission = {
      answers,
      questionIds: questions.map(q => q.id),
      timeSpent
    };

    onComplete(submission);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;
  const currentQ = questions[currentQuestion];

  if (!currentQ) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Knowledge Assessment Quiz</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full",
              timeLeft < 120 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
            )}>
              <Clock className="h-4 w-4" />
              <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
            </div>
            <Badge variant="outline">
              {answeredQuestions}/{questions.length} answered
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{currentQ.subject}</Badge>
              <Badge variant="outline">{currentQ.topic}</Badge>
              <Badge variant={
                currentQ.difficulty === 'beginner' ? 'default' :
                currentQ.difficulty === 'intermediate' ? 'secondary' : 'destructive'
              }>
                {currentQ.difficulty}
              </Badge>
            </div>
            {answers[currentQ.id] !== undefined && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
          </div>
          <CardTitle className="text-lg leading-relaxed">
            {currentQ.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={currentQ.options.findIndex(opt => opt === answers[currentQ.id]).toString()}
            onValueChange={(value) => handleAnswerSelect(currentQ.id, currentQ.options[parseInt(value)])}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer text-sm leading-relaxed"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel Quiz
          </Button>
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || isSubmitting}
          >
            Previous
          </Button>
        </div>

        <div className="flex gap-2">
          {currentQuestion < questions.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="gap-2"
            >
              Next Question
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || answeredQuestions === 0}
              className="gap-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Question Overview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Question Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                disabled={isSubmitting}
                className={cn(
                  "w-10 h-10 rounded-lg border text-sm font-medium transition-colors",
                  index === currentQuestion ? "border-primary bg-primary text-primary-foreground" :
                  answers[questions[index].id] !== undefined ? "border-green-500 bg-green-50 text-green-700" :
                  "border-muted-foreground/20 hover:border-muted-foreground/40"
                )}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const QuizResults: React.FC<QuizResultsProps> = ({ result, onRetake, onContinue }) => {
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "text-green-600";
    if (accuracy >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getAccuracyBadge = (accuracy: number) => {
    if (accuracy >= 80) return "Excellent";
    if (accuracy >= 60) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          {result.totalAccuracy >= 70 ? (
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          ) : (
            <XCircle className="h-8 w-8 text-red-500" />
          )}
          <h1 className="text-3xl font-bold">Quiz Complete!</h1>
        </div>
        <p className="text-muted-foreground">
          Here's how you performed and our recommendations for your learning path
        </p>
      </div>

      {/* Overall Results */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overall Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={cn("text-3xl font-bold", getAccuracyColor(result.totalAccuracy))}>
                {result.totalAccuracy.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
              <Badge className="mt-1" variant={result.totalAccuracy >= 70 ? "default" : "destructive"}>
                {getAccuracyBadge(result.totalAccuracy)}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {result.correctAnswers}/{result.totalQuestions}
              </div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {Object.keys(result.subjectResults).length}
              </div>
              <div className="text-sm text-muted-foreground">Subjects Tested</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise Results */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(result.subjectResults).map(([subject, data]) => (
            <div key={subject} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{subject}</h3>
                <div className="flex items-center gap-2">
                  <span className={cn("font-medium", getAccuracyColor(data.accuracy))}>
                    {data.accuracy}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({data.correct}/{data.total})
                  </span>
                </div>
              </div>
              <Progress value={data.accuracy} className="h-2" />
              
              {/* Topic breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                {Object.entries(data.topics).map(([topic, topicData]) => (
                  <div key={topic} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{topic}</span>
                    <span className={cn("font-medium", getAccuracyColor(topicData.accuracy))}>
                      {topicData.accuracy}% ({topicData.correct}/{topicData.total})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(result.recommendedAdjustments).map(([subject, adjustment]) => (
            <div key={subject} className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{subject}</h3>
                <div className="flex items-center gap-2">
                  {adjustment.currentLevel !== adjustment.recommendedLevel && (
                    <>
                      <Badge variant="outline">{adjustment.currentLevel}</Badge>
                      <ArrowRight className="h-4 w-4" />
                      <Badge variant="default">{adjustment.recommendedLevel}</Badge>
                    </>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{adjustment.reason}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" onClick={onRetake} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Retake Quiz
        </Button>
        <Button onClick={onContinue} className="gap-2">
          Generate My Timetable
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Quiz;
