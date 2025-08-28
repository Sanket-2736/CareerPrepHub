import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

const MockInterview = ({ userId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await apiCall('/api/interview/questions');
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert('Please provide an answer before proceeding.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiCall('/api/interview/answer', {
        method: 'POST',
     
        body: JSON.stringify({
          question: questions[currentQuestionIndex].question,
          answer: answer,
          user_id: userId
        })
      });

      const data = await response.json();
      
      const newResult = {
        question: questions[currentQuestionIndex].question,
        answer: answer,
        score: data.score,
        feedback: data.feedback,
        suggestions: data.suggestions
      };

      setResults([...results, newResult]);
      setAnswer('');

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Error submitting answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startNewInterview = () => {
    setCurrentQuestionIndex(0);
    setAnswer('');
    setResults([]);
    setShowResults(false);
    fetchQuestions();
  };

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showResults) {
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const averageScore = totalScore / results.length;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Interview Results</h2>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Overall Performance</h3>
            <p className="text-blue-700">
              Average Score: <span className="font-bold">{averageScore.toFixed(1)}/10</span>
            </p>
          </div>

          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Question {index + 1}: {result.question}
                </h4>
                <div className="bg-gray-50 p-3 rounded mb-3">
                  <p className="text-gray-700"><strong>Your Answer:</strong> {result.answer}</p>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-green-600 mb-1">
                      <strong>Score:</strong> {result.score}/10
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Feedback:</strong> {result.feedback}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={startNewInterview}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mock Interview</h2>
          <span className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="mb-8">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              {questions[currentQuestionIndex].question}
            </h3>
            <p className="text-blue-600 text-sm">
              Take your time to think and provide a detailed answer.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Your Answer:
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your answer here... Try to provide specific examples and be detailed in your response."
            />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {answer.length} characters
              </span>
              <button
                onClick={submitAnswer}
                disabled={loading || !answer.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Answer'}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
