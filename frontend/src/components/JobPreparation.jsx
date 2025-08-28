import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

const JobPreparation = ({ userId }) => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Technical', 'HR', 'Aptitude'];

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, selectedCategory]);

  const fetchQuestions = async () => {
    try {
      const data = await apiCall('/api/practice/questions');
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const filterQuestions = () => {
    if (selectedCategory === 'All') {
      setFilteredQuestions(questions);
    } else {
      setFilteredQuestions(questions.filter(q => q.category === selectedCategory));
    }
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers({
      ...answers,
      [questionId]: selectedOption
    });
  };

  const submitAnswers = async () => {
    if (Object.keys(answers).length === 0) {
      alert('Please answer at least one question before submitting.');
      return;
    }

    setLoading(true);
    try {
      const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
        question_id: parseInt(questionId),
        selected_option: selectedOption
      }));

      const data = await apiCall('/api/practice/submit', {
        method: 'POST',
        body: JSON.stringify({
          answers: answersArray,
          user_id: userId
        })
      });

      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Error submitting answers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setResults(null);
    setShowResults(false);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Preparation Q&A</h2>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {showResults ? (
          /* Results View */
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Quiz Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(results.percentage)}`}>
                    {results.score}/{results.total}
                  </div>
                  <div className="text-gray-600">Correct Answers</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(results.percentage)}`}>
                    {results.percentage}%
                  </div>
                  <div className="text-gray-600">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {selectedCategory}
                  </div>
                  <div className="text-gray-600">Category</div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">Detailed Results:</h4>
              {results.results.map((result, index) => (
                <div 
                  key={result.question_id}
                  className={`border rounded-lg p-4 ${
                    result.is_correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <h5 className="font-medium text-gray-800 mb-2">
                    {index + 1}. {result.question}
                  </h5>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Your answer:</span>
                      <span className={result.is_correct ? 'text-green-600' : 'text-red-600'}>
                        {' '}{result.selected}
                      </span>
                    </p>
                    {!result.is_correct && (
                      <p>
                        <span className="font-medium">Correct answer:</span>
                        <span className="text-green-600"> {result.correct_answer}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={resetQuiz}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Take Another Quiz
              </button>
            </div>
          </div>
        ) : (
          /* Questions View */
          <div className="space-y-6">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No questions available for this category.</p>
              </div>
            ) : (
              <>
                {filteredQuestions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-gray-800">
                        {index + 1}. {question.question}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {question.category}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <label 
                          key={optionIndex}
                          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="radio"
                            name={`question_${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={() => handleAnswerChange(question.id, option)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="text-center pt-6">
                  <button
                    onClick={submitAnswers}
                    disabled={loading || Object.keys(answers).length === 0}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Answers'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPreparation;
