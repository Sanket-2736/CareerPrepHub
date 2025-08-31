import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ResumeBuilder from './components/ResumeBuilder';
import MockInterview from './components/MockInterview';
import JobPreparation from './components/JobPreparation';
import './App.css';

// Home Component
const Home = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Accelerate Your Career Journey
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your career prospects with our comprehensive platform featuring AI-powered resume building, 
            realistic mock interviews, and extensive job preparation resources.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Get Started Today
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Land Your Dream Job
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Resume Builder Feature */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4 text-center">📄</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              AI-Powered Resume Builder
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Create professional, ATS-friendly resumes with our intelligent builder. 
              Get real-time suggestions and formatting that catches recruiters' attention.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>✓ Professional templates</li>
              <li>✓ ATS optimization</li>
              <li>✓ Real-time preview</li>
              <li>✓ Download in multiple formats</li>
            </ul>
          </div>

          {/* Mock Interview Feature */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4 text-center">🎤</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Realistic Mock Interviews
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Practice with AI-powered interview simulations. Get detailed feedback 
              on your answers and improve your interview performance.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>✓ Industry-specific questions</li>
              <li>✓ AI-powered feedback</li>
              <li>✓ Performance tracking</li>
              <li>✓ Improvement suggestions</li>
            </ul>
          </div>

          {/* Job Preparation Feature */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4 text-center">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Comprehensive Test Prep
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Master technical, HR, and aptitude questions with our extensive 
              question bank. Track your progress and identify areas for improvement.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>✓ Multiple categories</li>
              <li>✓ Detailed explanations</li>
              <li>✓ Progress analytics</li>
              <li>✓ Performance insights</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Join Thousands of Successful Job Seekers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Resumes Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Mock Interviews</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-blue-100">Practice Questions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Sign Up & Get Started</h3>
            <p className="text-gray-600">
              Create your free account in seconds and access all our career preparation tools.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Build & Practice</h3>
            <p className="text-gray-600">
              Create your resume, practice interviews, and test your knowledge with our comprehensive resources.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Land Your Dream Job</h3>
            <p className="text-gray-600">
              Apply with confidence using your polished resume and improved interview skills.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have successfully advanced their careers with CareerPrep Hub.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Start Your Journey Now
          </button>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('home'); // Always start with home
  const [showAuth, setShowAuth] = useState('login');

  // Only redirect to dashboard if user was trying to access protected content and just logged in
  React.useEffect(() => {
    if (isAuthenticated && activeTab === 'auth') {
      setActiveTab('dashboard');
    }
  }, [isAuthenticated, activeTab]);

  const tabs = [
    { id: 'home', name: 'Home', icon: '🏠', public: true },
    { id: 'dashboard', name: 'Dashboard', icon: '📊', protected: true },
    { id: 'resume', name: 'Resume Builder', icon: '📄', protected: true },
    { id: 'interview', name: 'Mock Interview', icon: '🎤', protected: true },
    { id: 'practice', name: 'Job Preparation', icon: '📚', protected: true },
  ];

  const handleTabClick = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab.protected && !isAuthenticated) {
      setShowAuth('login');
      setActiveTab('auth');
    } else {
      setActiveTab(tabId);
    }
  };

  const renderContent = () => {
    if (activeTab === 'auth') {
      return showAuth === 'login' ? (
        <Login onToggleAuth={() => setShowAuth('signup')} />
      ) : (
        <Signup onToggleAuth={() => setShowAuth('login')} />
      );
    }

    switch (activeTab) {
      case 'home':
        return <Home onGetStarted={() => handleTabClick('dashboard')} />;
      case 'dashboard':
        return (
          <ProtectedRoute>
            <Dashboard userId={user?.id} />
          </ProtectedRoute>
        );
      case 'resume':
        return (
          <ProtectedRoute>
            <ResumeBuilder userId={user?.id} />
          </ProtectedRoute>
        );
      case 'interview':
        return (
          <ProtectedRoute>
            <MockInterview userId={user?.id} />
          </ProtectedRoute>
        );
      case 'practice':
        return (
          <ProtectedRoute>
            <JobPreparation userId={user?.id} />
          </ProtectedRoute>
        );
      default:
        return <Home onGetStarted={() => handleTabClick('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">CareerPrep Hub</h1>
              <p className="text-blue-100 mt-2">Your one-stop platform for career preparation</p>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-blue-100">Welcome, {user?.full_name || user?.username}!</span>
                  <button
                    onClick={() => {
                      logout();
                      setActiveTab('home');
                    }}
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setShowAuth('login');
                      setActiveTab('auth');
                    }}
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setShowAuth('signup');
                      setActiveTab('auth');
                    }}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {activeTab !== 'auth' && (
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                  {tab.protected && !isAuthenticated && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Login Required
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;