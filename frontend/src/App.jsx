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

const App = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuth, setShowAuth] = useState('login'); // 'login' or 'signup'

  if (!isAuthenticated) {
    return showAuth === 'login' ? (
      <Login onToggleAuth={() => setShowAuth('signup')} />
    ) : (
      <Signup onToggleAuth={() => setShowAuth('login')} />
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'resume', name: 'Resume Builder', icon: '📄' },
    { id: 'interview', name: 'Mock Interview', icon: '🎤' },
    { id: 'practice', name: 'Job Preparation', icon: '📚' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'resume':
        return <ResumeBuilder />;
      case 'interview':
        return <MockInterview />;
      case 'practice':
        return <JobPreparation />;
      default:
        return <Dashboard />;
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
              <span className="text-blue-100">Welcome, {user?.full_name || user?.username}!</span>
              <button
                onClick={logout}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

 
      
          {renderContent()}

      
    </div>
  );
};



export default App;
