import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllProgress } from '../api/api';

const Dashboard = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllProgress();
        setProgressData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load progress data. Please try again later.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Count statistics
  const stats = {
    total: progressData.length,
    completed: progressData.filter(item => item.status === 'Completed').length,
    inProgress: progressData.filter(item => item.status === 'In Progress').length,
    projects: progressData.filter(item => item.template === 'Completed Project/Task').length,
    certifications: progressData.filter(item => item.template === 'Certification/Qualification').length,
    challenges: progressData.filter(item => item.template === 'Challenges/Competitions').length,
    workshops: progressData.filter(item => item.template === 'Workshops/Bootcamps').length,
  };

  // Get recent activities (last 5)
  const recentActivities = [...progressData]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="px-6 py-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[300px] text-gray-500">
        <div className="w-10 h-10 border-3 border-blue-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p>Loading your progress data...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-[#0a9bdf] pl-4 relative">
        <span className="absolute left-0 top-2.5 h-2/3 w-1.5 bg-[#0a9bdf] rounded"></span>
        Learning Progress Dashboard
      </h1>

      {error && (
        <div className="p-4 rounded mb-6 bg-red-100 text-red-800 border-l-4 border-red-500 flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            ×
          </button>
        </div>
      )}

      <div className="mb-8">
        <div className="bg-white rounded-lg shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#0a9bdf]">Statistics</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-6">
            <div className="bg-gradient-to-b from-white to-blue-50 rounded p-6 text-center shadow-sm hover:shadow hover:-translate-y-1 transition-all border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#0a9bdf] to-blue-300"></div>
              <h3 className="text-4xl font-bold mb-2 text-[#0a9bdf]">{stats.total}</h3>
              <p className="text-sm text-gray-600 font-medium">Total Entries</p>
            </div>
            <div className="bg-gradient-to-b from-white to-blue-50 rounded p-6 text-center shadow-sm hover:shadow hover:-translate-y-1 transition-all border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#0a9bdf] to-blue-300"></div>
              <h3 className="text-4xl font-bold mb-2 text-[#0a9bdf]">{stats.completed}</h3>
              <p className="text-sm text-gray-600 font-medium">Completed</p>
            </div>
            <div className="bg-gradient-to-b from-white to-blue-50 rounded p-6 text-center shadow-sm hover:shadow hover:-translate-y-1 transition-all border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#0a9bdf] to-blue-300"></div>
              <h3 className="text-4xl font-bold mb-2 text-[#0a9bdf]">{stats.inProgress}</h3>
              <p className="text-sm text-gray-600 font-medium">In Progress</p>
            </div>
            <div className="bg-gradient-to-b from-white to-blue-50 rounded p-6 text-center shadow-sm hover:shadow hover:-translate-y-1 transition-all border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#0a9bdf] to-blue-300"></div>
              <h3 className="text-4xl font-bold mb-2 text-[#0a9bdf]">{stats.projects}</h3>
              <p className="text-sm text-gray-600 font-medium">Projects</p>
            </div>
            <div className="bg-gradient-to-b from-white to-blue-50 rounded p-6 text-center shadow-sm hover:shadow hover:-translate-y-1 transition-all border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#0a9bdf] to-blue-300"></div>
              <h3 className="text-4xl font-bold mb-2 text-[#0a9bdf]">{stats.certifications}</h3>
              <p className="text-sm text-gray-600 font-medium">Certifications</p>
            </div>
            <div className="bg-gradient-to-b from-white to-blue-50 rounded p-6 text-center shadow-sm hover:shadow hover:-translate-y-1 transition-all border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#0a9bdf] to-blue-300"></div>
              <h3 className="text-4xl font-bold mb-2 text-[#0a9bdf]">{stats.challenges}</h3>
              <p className="text-sm text-gray-600 font-medium">Challenges</p>
            </div>
            <div className="bg-gradient-to-b from-white to-blue-50 rounded p-6 text-center shadow-sm hover:shadow hover:-translate-y-1 transition-all border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#0a9bdf] to-blue-300"></div>
              <h3 className="text-4xl font-bold mb-2 text-[#0a9bdf]">{stats.workshops}</h3>
              <p className="text-sm text-gray-600 font-medium">Workshops</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white rounded-lg shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#0a9bdf]">Recent Activities</h2>
            <Link to="/achievements" className="py-2 px-4 text-sm font-medium rounded border border-blue-500 text-[#0a9bdf] hover:bg-[#0a9bdf] hover:text-white transition-all">
              View All
            </Link>
          </div>

          {recentActivities.length === 0 ? (
            <p className="p-6">No activities found. Start by adding your progress!</p>
          ) : (
            <div className="px-6">
              {recentActivities.map(activity => (
                <div key={activity.id} className="py-5 px-4 border-b border-gray-200 transition-all hover:bg-blue-50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-[#0a9bdf]">{activity.topic}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'In Progress' ? 'bg-blue-100 text-[#0a9bdf]' :
                        activity.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                      }`}>
                      {activity.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2 line-clamp-2">{activity.description}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{activity.template}</span>
                    <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <Link to="/add" className="py-2 px-4 rounded text-sm font-medium bg-[#0a9bdf] text-white hover:bg-blue-700 transition-all">
              Add New Progress
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;