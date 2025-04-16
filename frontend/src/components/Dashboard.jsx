import React from 'react';
import { Paper } from '@mui/material';
import { Link } from 'react-router-dom';

function Dashboard({ profileData }) {
  return (
    <div className="space-y-6">
      {/* Profile Strength Card */}
      <Paper className="p-6 relative overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-[#002B5B] mb-3">Strengthen your profile</h2>
            <p className="text-[#002B5B]/70 mb-4">
              Members who include skills receive up to <span className="font-semibold">17x more profile views</span>.
            </p>
            <button className="bg-[#F7931E] text-white px-6 py-2 rounded-full hover:bg-[#F7931E]/90 transition-all duration-300 flex items-center group">
              Add skills
              <span className="material-icons ml-2 transform transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-r from-transparent to-[#F7931E]/20" />
        </div>
      </Paper>

      {/* Dashboard Stats */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#002B5B]">Your Dashboard</h2>
          <Link to="/stats" className="text-[#F7931E] hover:text-[#F7931E]/80 flex items-center group">
            View all stats
            <span className="material-icons ml-1 transform transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Profile Views */}
          <Paper className="p-4 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
            <div className="flex items-start justify-between">
              <div>
                <span className="material-icons text-[#F7931E] transition-transform duration-300 hover:scale-110">visibility</span>
                <h3 className="text-3xl font-bold text-[#002B5B] mt-2">152</h3>
                <p className="text-[#002B5B]/60 text-sm">Profile views</p>
                <div className="flex items-center text-green-500 text-sm mt-1">
                  <span className="text-xs animate-bounce">↑</span> 12% from last week
                </div>
              </div>
            </div>
          </Paper>

          {/* Search Appearances */}
          <Paper className="p-4 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
            <div className="flex items-start justify-between">
              <div>
                <span className="material-icons text-[#002B5B] transition-transform duration-300 hover:scale-110">search</span>
                <h3 className="text-3xl font-bold text-[#002B5B] mt-2">28</h3>
                <p className="text-[#002B5B]/60 text-sm">Search appearances</p>
                <p className="text-[#002B5B]/60 text-sm mt-1 hover:text-[#F7931E]">searches this week</p>
              </div>
            </div>
          </Paper>

          {/* Post Impressions */}
          <Paper className="p-4 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
            <div className="flex items-start justify-between">
              <div>
                <span className="material-icons text-[#002B5B] transition-transform duration-300 hover:scale-110">analytics</span>
                <h3 className="text-3xl font-bold text-[#002B5B] mt-2">95</h3>
                <p className="text-[#002B5B]/60 text-sm">Post impressions</p>
                <p className="text-[#002B5B]/60 text-sm mt-1 hover:text-[#F7931E]">views of your posts</p>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 