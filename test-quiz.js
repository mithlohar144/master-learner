// Simple test to verify quiz generation
import { createServer } from './server/index.js';
import express from 'express';

const app = createServer();
const port = 3001;

app.listen(port, () => {
  console.log(`Test server running on http://localhost:${port}`);
  
  // Test quiz generation
  const testRequest = {
    subjects: ['Data Structures & Algorithms', 'Web Development'],
    difficulty_levels: {
      'Data Structures & Algorithms': 'beginner',
      'Web Development': 'beginner'
    },
    topics_per_subject: {
      'Data Structures & Algorithms': ['Arrays & Strings', 'Linked Lists'],
      'Web Development': ['HTML & CSS', 'Basic JavaScript & DOM']
    },
    questions_per_subject: 2
  };
  
  console.log('Test request:', JSON.stringify(testRequest, null, 2));
  
  // Make a test request to the quiz endpoint
  fetch(`http://localhost:${port}/api/quiz/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testRequest)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Quiz response:', JSON.stringify(data, null, 2));
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
});
