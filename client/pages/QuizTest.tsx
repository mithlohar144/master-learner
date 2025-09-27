import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizRequest, QuizResponse } from '@shared/api';

const QuizTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testQuizGeneration = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 Testing quiz generation...');
      
      const quizRequest: QuizRequest = {
        subjects: ['Data Structures & Algorithms', 'Web Development'],
        subject_levels: {
          'Data Structures & Algorithms': {
            level: 'beginner',
            topics: ['Arrays & Strings', 'Linked Lists']
          },
          'Web Development': {
            level: 'intermediate',
            topics: ['JavaScript Fundamentals', 'HTML & CSS']
          }
        }
      };

      console.log('Quiz request:', quizRequest);

      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizRequest),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Quiz generation failed:', response.status, errorText);
        throw new Error(`Quiz generation failed: ${response.status} - ${errorText}`);
      }

      const quizData: QuizResponse = await response.json();
      console.log('✅ Quiz generated successfully:', quizData);
      
      setResult({
        success: true,
        data: quizData,
        message: `Quiz generated with ${quizData.questions.length} questions`
      });

    } catch (error) {
      console.error('❌ Quiz test failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Quiz Generation Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testQuizGeneration} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing Quiz Generation...' : 'Test Quiz Generation'}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800">❌ Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {result && (
              <div className={`p-4 rounded-lg border ${
                result.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <h3 className={`font-semibold ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? '✅ Success' : '❌ Failed'}
                </h3>
                
                {result.success && result.data && (
                  <div className="mt-2 space-y-2">
                    <p className="text-green-700">{result.message}</p>
                    <div className="text-sm text-green-600">
                      <p>• Questions: {result.data.questions.length}</p>
                      <p>• Time limit: {result.data.timeLimit} seconds</p>
                      <p>• Subjects: {result.data.subjects?.join(', ')}</p>
                      <p>• Topics: {result.data.topics?.join(', ')}</p>
                      <p>• Difficulties: {result.data.difficulties?.join(', ')}</p>
                    </div>
                    
                    {result.data.questions.length > 0 && (
                      <div className="mt-4 p-3 bg-white rounded border">
                        <h4 className="font-medium text-gray-800">Sample Question:</h4>
                        <div className="text-sm text-gray-600 mt-1">
                          <p><strong>Subject:</strong> {result.data.questions[0].subject}</p>
                          <p><strong>Topic:</strong> {result.data.questions[0].topic}</p>
                          <p><strong>Difficulty:</strong> {result.data.questions[0].difficulty}</p>
                          <p><strong>Question:</strong> {result.data.questions[0].question}</p>
                          <p><strong>Options:</strong> {result.data.questions[0].options.join(', ')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {!result.success && (
                  <p className="text-red-700 mt-2">{result.error}</p>
                )}
              </div>
            )}

            <div className="text-sm text-gray-600">
              <p><strong>Test Details:</strong></p>
              <p>• API Endpoint: POST /api/quiz/generate</p>
              <p>• Test Subjects: Data Structures & Algorithms, Web Development</p>
              <p>• Expected: Quiz with personalized questions</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizTest;
