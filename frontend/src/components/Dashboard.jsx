import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

const Dashboard = ({ userId }) => {
  const [progress, setProgress] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
    fetchStats();
  }, [userId]);

  const fetchProgress = async () => {
    try {
      const data = await apiCall(`/api/dashboard/progress/${userId}`);
      setProgress(data.progress);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await apiCall('/api/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const progressCards = [
    {
      title: 'Resume Builder',
      status: progress?.resume_completed ? 'Completed' : 'Get Started',
      completed: progress?.resume_completed,
      icon: '📄',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-800',
      statusColor: progress?.resume_completed ? 'text-emerald-600' : 'text-amber-600',
      accentColor: 'text-emerald-600'
    },
    {
      title: 'Mock Interviews',
      status: `${progress?.interviews_taken || 0} Completed`,
      completed: (progress?.interviews_taken || 0) > 0,
      icon: '🎤',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      statusColor: 'text-blue-600',
      accentColor: 'text-blue-600'
    },
    {
      title: 'Practice Score',
      status: `${progress?.practice_score || 0}%`,
      completed: (progress?.practice_score || 0) > 70,
      icon: '📊',
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      statusColor: 'text-purple-600',
      accentColor: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Welcome back to CareerPrep Hub
              </h1>
              <p className="mt-2 text-lg text-gray-600 max-w-2xl">
                Your comprehensive platform for career preparation. Track progress, access tools, and advance your professional journey.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {userId ? userId.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Your Progress</h2>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              <span>Completed</span>
              <div className="w-3 h-3 bg-gray-300 rounded-full ml-4"></div>
              <span>In Progress</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {progressCards.map((card, index) => (
              <div 
                key={index}
                className={`${card.bgColor} ${card.borderColor} border-2 rounded-xl p-6 
                          hover:shadow-lg transition-all duration-300 cursor-pointer 
                          hover:scale-105 relative overflow-hidden`}
              >
                {/* Completion Badge */}
                {card.completed && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-4">
                  <div className={`text-4xl ${card.accentColor} bg-white bg-opacity-70 rounded-lg p-3 shadow-sm`}>
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${card.textColor} mb-2`}>
                      {card.title}
                    </h3>
                    <p className={`text-base font-medium ${card.statusColor}`}>
                      {card.status}
                    </p>
                    {!card.completed && (
                      <p className="text-gray-500 text-sm mt-1">
                        Click to continue
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Progress Bar for Practice Score */}
                {card.title === 'Practice Score' && (
                  <div className="mt-4">
                    <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-violet-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress?.practice_score || 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Platform Statistics */}
        {stats && (
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="mr-3">📈</span>
                  Platform Insights
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  See how you're performing alongside our community
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stats.total_resumes?.toLocaleString() || '0'}
                    </div>
                    <div className="text-gray-600 font-medium">Resumes Created</div>
                    <div className="text-xs text-gray-500 mt-1">Across all users</div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 group-hover:bg-emerald-200 transition-colors">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stats.total_users?.toLocaleString() || '0'}
                    </div>
                    <div className="text-gray-600 font-medium">Active Users</div>
                    <div className="text-xs text-gray-500 mt-1">This month</div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200 transition-colors">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stats.avg_practice_score || '0'}%
                    </div>
                    <div className="text-gray-600 font-medium">Average Score</div>
                    <div className="text-xs text-gray-500 mt-1">Community average</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">New Resume</h4>
                  <p className="text-sm text-gray-500">Start building</p>
                </div>
              </div>
            </button>
            
            <button className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all duration-200 text-left group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Practice Interview</h4>
                  <p className="text-sm text-gray-500">Start session</p>
                </div>
              </div>
            </button>
            
            <button className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all duration-200 text-left group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Skill Assessment</h4>
                  <p className="text-sm text-gray-500">Take test</p>
                </div>
              </div>
            </button>
            
            <button className="bg-white border border-gray-200 rounded-lg p-4 hover:border-amber-300 hover:shadow-md transition-all duration-200 text-left group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Study Resources</h4>
                  <p className="text-sm text-gray-500">Browse library</p>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Progress Cards */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Progress Overview</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {progressCards.map((card, index) => (
              <div 
                key={index}
                className={`${card.bgColor} ${card.borderColor} border rounded-xl p-6 
                          hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`text-3xl ${card.accentColor} bg-white bg-opacity-80 rounded-lg p-2 shadow-sm`}>
                      {card.icon}
                    </div>
                    {card.completed && (
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium">Complete</span>
                      </div>
                    )}
                  </div>
                  
                  <h4 className={`text-lg font-semibold ${card.textColor} mb-2`}>
                    {card.title}
                  </h4>
                  
                  <p className={`text-lg font-bold ${card.statusColor} mb-2`}>
                    {card.status}
                  </p>
                  
                  {card.title === 'Practice Score' && progress?.practice_score && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{progress.practice_score}%</span>
                      </div>
                      <div className="w-full bg-white bg-opacity-60 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-violet-600 h-2 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${progress.practice_score}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Continue Your Journey</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🎯</span>
                  Recommended Next Steps
                </h4>
                <div className="space-y-3">
                  {!progress?.resume_completed && (
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Complete your resume</span>
                    </div>
                  )}
                  {(progress?.interviews_taken || 0) < 3 && (
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Take more practice interviews</span>
                    </div>
                  )}
                  {(progress?.practice_score || 0) < 80 && (
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Improve your practice score</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">💡</span>
                  Tips for Success
                </h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Practice interview questions daily for better confidence</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Tailor your resume for each job application</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Review feedback from practice sessions regularly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;