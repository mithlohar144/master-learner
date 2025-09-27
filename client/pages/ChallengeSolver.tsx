import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Code2, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Star, 
  BookOpen,
  ArrowLeft,
  Lightbulb,
  Terminal,
  FileText,
  Trophy,
  Settings,
  Save,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  testCases: TestCase[];
  starterCode?: Record<string, string>;
  hints?: string[];
  supportedLanguages?: string[];
}

interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
  hidden?: boolean;
}

interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
}

// Programming language configurations
const LANGUAGES = {
  javascript: {
    name: 'JavaScript',
    extension: 'js',
    comment: '//',
    template: 'function solution() {\n    // Write your code here\n}'
  },
  python: {
    name: 'Python',
    extension: 'py',
    comment: '#',
    template: 'def solution():\n    # Write your code here\n    pass'
  },
  java: {
    name: 'Java',
    extension: 'java',
    comment: '//',
    template: 'public class Solution {\n    public void solution() {\n        // Write your code here\n    }\n}'
  },
  cpp: {
    name: 'C++',
    extension: 'cpp',
    comment: '//',
    template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
  }
};

// Sample challenges with coding problems
const CODING_CHALLENGES: Challenge[] = [
  {
    id: 'dsa-two-sum',
    title: 'Two Sum Problem',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    type: 'coding',
    difficulty: 'beginner',
    subject: 'Data Structures & Algorithms',
    topic: 'Arrays',
    estimatedTime: 15,
    xpReward: 50,
    supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your solution here
    // Return an array of two indices
    
}

// Example usage:
// twoSum([2,7,11,15], 9) should return [0,1]`,
      python: `def two_sum(nums, target):
    # Write your solution here
    # Return a list of two indices
    pass

# Example usage:
# two_sum([2,7,11,15], 9) should return [0,1]`,
      java: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        // Return an array of two indices
        return new int[]{};
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        // Return a vector of two indices
        return {};
    }
};`
    },
    testCases: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        expectedOutput: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      },
      {
        input: 'nums = [3,3], target = 6',
        expectedOutput: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].'
      }
    ],
    hints: [
      'Try using a hash map to store numbers you\'ve seen',
      'For each number, check if target - number exists in your hash map',
      'Don\'t forget to return the indices, not the values'
    ]
  },
  {
    id: 'web-responsive-layout',
    title: 'Responsive Card Layout',
    description: 'Create a responsive card layout that displays 4 cards per row on desktop, 2 on tablet, and 1 on mobile. Use CSS Grid and make it responsive without media queries.',
    type: 'coding',
    difficulty: 'beginner',
    subject: 'Web Development',
    topic: 'HTML/CSS',
    estimatedTime: 30,
    xpReward: 60,
    supportedLanguages: ['javascript'],
    starterCode: {
      javascript: `<!-- HTML Structure -->
<div class="card-container">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
  <div class="card">Card 5</div>
  <div class="card">Card 6</div>
</div>

<style>
/* Write your CSS here */
.card-container {
  /* Your grid styles here */
}

.card {
  /* Your card styles here */
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
  text-align: center;
}
</style>`
    },
    testCases: [
      {
        input: 'Desktop view (1200px+)',
        expectedOutput: '4 cards per row',
        explanation: 'Cards should display in a 4-column grid on large screens'
      },
      {
        input: 'Tablet view (768px-1199px)',
        expectedOutput: '2 cards per row',
        explanation: 'Cards should display in a 2-column grid on medium screens'
      },
      {
        input: 'Mobile view (<768px)',
        expectedOutput: '1 card per row',
        explanation: 'Cards should stack vertically on small screens'
      }
    ],
    hints: [
      'Use CSS Grid with repeat() and minmax()',
      'Try grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
      'Add gap property for spacing between cards'
    ]
  }
];

export default function ChallengeSolver() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Find the challenge by ID
    const foundChallenge = CODING_CHALLENGES.find(c => c.id === challengeId);
    if (foundChallenge) {
      setChallenge(foundChallenge);
      // Set default language to first supported language
      const defaultLang = foundChallenge.supportedLanguages?.[0] || 'javascript';
      setSelectedLanguage(defaultLang);
      setCode(foundChallenge.starterCode?.[defaultLang] || '');
    }

    // Start timer
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [challengeId]);

  useEffect(() => {
    // Update code when language changes
    if (challenge && challenge.starterCode) {
      setCode(challenge.starterCode[selectedLanguage] || '');
    }
  }, [selectedLanguage, challenge]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const runCode = async () => {
    if (!challenge) return;
    
    setIsRunning(true);
    
    // Simulate code execution (in a real app, this would be sent to a backend service)
    setTimeout(() => {
      const results: TestResult[] = challenge.testCases.map((testCase, index) => {
        // Simple simulation - in reality, you'd execute the code safely
        const passed = Math.random() > 0.3; // 70% pass rate for demo
        return {
          passed,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: passed ? testCase.expectedOutput : 'undefined',
          error: passed ? undefined : 'Runtime Error: Check your logic'
        };
      });
      
      setTestResults(results);
      setIsRunning(false);
      
      // Check if all tests passed
      const allPassed = results.every(r => r.passed);
      if (allPassed) {
        setIsCompleted(true);
        // Save completion to localStorage
        const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
        if (!completedChallenges.includes(challengeId)) {
          completedChallenges.push(challengeId);
          localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
        }
      }
    }, 2000);
  };

  const nextHint = () => {
    if (challenge && currentHint < challenge.hints!.length - 1) {
      setCurrentHint(prev => prev + 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="space-y-3">
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-semibold">Challenge Not Found</h3>
            <p className="text-muted-foreground">
              The challenge you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/challenge')}>
              Back to Challenges
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/challenge')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Challenges
            </Button>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
              <Badge variant="outline">
                <BookOpen className="h-3 w-3 mr-1" />
                {challenge.subject}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {formatTime(timeSpent)}
            </div>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-800 gap-1">
                <Trophy className="h-3 w-3" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  {challenge.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {challenge.estimatedTime}min
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {challenge.xpReward} XP
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{challenge.description}</p>
              </CardContent>
            </Card>

            {/* Test Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  Test Cases
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {challenge.testCases.map((testCase, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Input:</span> {testCase.input}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Expected Output:</span> {testCase.expectedOutput}
                      </div>
                      {testCase.explanation && (
                        <div className="text-xs text-muted-foreground">
                          {testCase.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Hints */}
            {challenge.hints && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Hints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!showHints ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowHints(true)}
                      className="w-full"
                    >
                      Show Hints
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          💡 {challenge.hints[currentHint]}
                        </p>
                      </div>
                      {currentHint < challenge.hints.length - 1 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={nextHint}
                        >
                          Next Hint ({currentHint + 1}/{challenge.hints.length})
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

            {/* Code Editor and Results */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Code Editor
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    {/* Language Selector */}
                    {challenge?.supportedLanguages && challenge.supportedLanguages.length > 1 && (
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {challenge.supportedLanguages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {LANGUAGES[lang as keyof typeof LANGUAGES]?.name || lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (challenge?.starterCode?.[selectedLanguage]) {
                            setCode(challenge.starterCode[selectedLanguage]);
                          }
                        }}
                        className="gap-2"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reset
                      </Button>
                      
                      <Button 
                        onClick={runCode} 
                        disabled={isRunning}
                        className="gap-2"
                      >
                        {isRunning ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            Run Code
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <CardDescription>
                  Language: {LANGUAGES[selectedLanguage as keyof typeof LANGUAGES]?.name || selectedLanguage}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`Write your ${LANGUAGES[selectedLanguage as keyof typeof LANGUAGES]?.name || selectedLanguage} code here...`}
                  className="min-h-[400px] font-mono text-sm resize-none"
                />
                
                {/* Code Stats */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Lines: {code.split('\n').length}</span>
                  <span>Characters: {code.length}</span>
                  <span>Language: {LANGUAGES[selectedLanguage as keyof typeof LANGUAGES]?.name || selectedLanguage}</span>
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            {testResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {testResults.map((result, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "p-3 rounded-lg border",
                        result.passed 
                          ? "bg-green-50 border-green-200" 
                          : "bg-red-50 border-red-200"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {result.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium text-sm">
                          Test Case {index + 1}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div><span className="font-medium">Input:</span> {result.input}</div>
                        <div><span className="font-medium">Expected:</span> {result.expectedOutput}</div>
                        <div><span className="font-medium">Actual:</span> {result.actualOutput}</div>
                        {result.error && (
                          <div className="text-red-600">
                            <span className="font-medium">Error:</span> {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isCompleted && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                      <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-green-800">Challenge Completed!</h3>
                      <p className="text-sm text-green-700">
                        You earned {challenge?.xpReward} XP points!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
