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
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to CareerPrep Hub</h2>
        <p className="text-gray-600 mb-6">Track your progress and access all career preparation tools in one place.</p>
        
        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-green-600 text-2xl mr-3">📄</div>
              <div>
                <h3 className="font-semibold text-green-800">Resume</h3>
                <p className="text-green-600">
                  {progress?.resume_completed ? 'Completed' : 'Not Started'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-blue-600 text-2xl mr-3">🎤</div>
              <div>
                <h3 className="font-semibold text-blue-800">Mock Interviews</h3>
                <p className="text-blue-600">{progress?.interviews_taken || 0} completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-purple-600 text-2xl mr-3">📚</div>
              <div>
                <h3 className="font-semibold text-purple-800">Practice Score</h3>
                <p className="text-purple-600">{progress?.practice_score || 0}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        {stats && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total_resumes}</div>
                <div className="text-gray-600">Resumes Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.total_users}</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.avg_practice_score}%</div>
                <div className="text-gray-600">Avg Practice Score</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
