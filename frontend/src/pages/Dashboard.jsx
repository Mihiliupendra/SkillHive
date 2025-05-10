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

  const stats = {
    total: progressData.length,
    completed: progressData.filter(item => item.status === 'Completed').length,
    inProgress: progressData.filter(item => item.status === 'In Progress').length,
    projects: progressData.filter(item => item.template === 'Completed Project/Task').length,
    certifications: progressData.filter(item => item.template === 'Certification/Qualification').length,
    challenges: progressData.filter(item => item.template === 'Challenges/Competitions').length,
    workshops: progressData.filter(item => item.template === 'Workshops/Bootcamps').length,
  };

  const recentActivities = [...progressData]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="px-6 py-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[300px] text-gray-500">
        <div className="w-10 h-10 border-3 border-orange-300 border-t-brand-orange rounded-full animate-spin mb-4"></div>
        <p>Loading your progress data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c3372] to-[#f97316] relative text-black">
      {/* Floating Blurs */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-300 opacity-30 rounded-full blur-2xl z-0"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 opacity-20 rounded-full blur-2xl z-0"></div>

      <div className="py-8 px-6 max-w-7xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-white pl-4 relative">
          <span className="absolute left-0 top-2.5 h-2/3 w-1.5 bg-white rounded"></span>
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
              <h2 className="text-xl font-semibold text-brand-blue hover:text-brand-orange transition-colors duration-200">Statistics</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-6">
              {[
                { label: 'Total Entries', value: stats.total },
                { label: 'Completed', value: stats.completed },
                { label: 'In Progress', value: stats.inProgress },
                { label: 'Projects', value: stats.projects },
                { label: 'Certifications', value: stats.certifications },
                { label: 'Challenges', value: stats.challenges },
                { label: 'Workshops', value: stats.workshops }
              ].map((stat, index) => (
                <div key={index} className="bg-gradient-to-b from-white to-orange-50 rounded p-6 text-center shadow-sm hover:shadow hover:-translate-y-1 transition-all border border-gray-100 relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-orange to-brand-blue"></div>
                  <h3 className="text-4xl font-bold mb-2 text-brand-orange">{stat.value}</h3>
                  <p className="text-sm text-gray-600 font-medium hover:text-brand-orange transition-colors duration-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-brand-blue hover:text-brand-orange transition-colors duration-200">Recent Activities</h2>
              <Link to="/projects/achievements" className="py-2 px-4 rounded text-sm font-medium bg-[#df6a0a] text-black hover:bg-orange-700 transition-all">
                View All
              </Link>
            </div>

            {recentActivities.length === 0 ? (
              <p className="p-6">No activities found. Start by adding your progress!</p>
            ) : (
              <div className="px-6">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="py-5 px-4 border-b border-gray-200 transition-all hover:bg-orange-50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-brand-blue hover:text-brand-orange transition-colors duration-200">{activity.topic}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'In Progress' ? 'bg-orange-100 text-brand-orange' :
                            activity.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-purple-100 text-purple-800'
                        }`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2 line-clamp-2 hover:text-brand-orange transition-colors duration-200">{activity.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span className="hover:text-brand-orange transition-colors duration-200">{activity.template}</span>
                      <span className="hover:text-brand-orange transition-colors duration-200">{new Date(activity.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <Link to="/projects/add" className="py-2 px-4 rounded text-sm font-medium bg-[#df6a0a] text-black hover:bg-orange-700 transition-all">
                Add New Progress
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
