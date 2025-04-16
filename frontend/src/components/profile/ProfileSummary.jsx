import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ProfileSummary({
  name,
  title,
  profileViews,
  connections,
  profileImage
}) {
  const userId = Cookies.get('userId');

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Background Cover */}
      <div className="h-14 bg-gradient-to-r from-[#002B5B] to-[#F7931E]"></div>
      
      {/* Profile Info */}
      <div className="relative px-4 pt-12 pb-4">
        {/* Profile Image */}
        <div className="absolute -top-10 left-4">
          <Link to={`/profile/${userId}`}>
            <img
              src={profileImage}
              alt={name}
              className="w-[72px] h-[72px] rounded-full border-4 border-white hover:border-[#F7931E] transition-colors object-cover"
            />
          </Link>
        </div>

        {/* User Info */}
        <div className="mb-4">
          <Link to={`/profile/${userId}`} className="hover:underline">
            <h2 className="text-xl font-semibold text-[#002B5B] hover:text-[#F7931E] transition-colors">{name}</h2>
          </Link>
          <p className="text-sm text-[#002B5B]/80">{title}</p>
        </div>

        {/* Stats */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div>
            <Link to="/profile-views" className="block hover:bg-gray-50 p-2 rounded group">
              <div className="flex justify-between text-sm">
                <span className="text-[#002B5B]/80">Profile views</span>
                <span className="text-[#F7931E] font-medium group-hover:text-[#F7931E]/80">{profileViews}</span>
              </div>
            </Link>
          </div>
          <div>
            <Link to="/connections" className="block hover:bg-gray-50 p-2 rounded group">
              <div className="flex justify-between text-sm">
                <span className="text-[#002B5B]/80">Connections</span>
                <span className="text-[#F7931E] font-medium group-hover:text-[#F7931E]/80">{connections}</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="border-t border-gray-200 mt-4 pt-4">
          <h3 className="text-sm font-medium mb-3 text-[#002B5B]">Recent</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/groups" className="flex items-center text-sm text-[#002B5B]/70 hover:text-[#F7931E] transition-colors">
                <span className="material-icons text-lg mr-2">group</span>
                Web Development
              </Link>
            </li>
            <li>
              <Link to="/groups" className="flex items-center text-sm text-[#002B5B]/70 hover:text-[#F7931E] transition-colors">
                <span className="material-icons text-lg mr-2">code</span>
                JavaScript Group
              </Link>
            </li>
            <li>
              <Link to="/groups" className="flex items-center text-sm text-[#002B5B]/70 hover:text-[#F7931E] transition-colors">
                <span className="material-icons text-lg mr-2">school</span>
                UI/UX Design
              </Link>
            </li>
          </ul>
        </div>

        {/* Groups Section */}
        <div className="border-t border-gray-200 mt-4 pt-4">
          <h3 className="text-sm font-medium mb-3 text-[#002B5B]">Groups</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/groups" className="flex items-center text-sm text-[#002B5B]/70 hover:text-[#F7931E] transition-colors">
                <span className="material-icons text-lg mr-2">people</span>
                Tech Professionals
              </Link>
            </li>
            <li>
              <Link to="/groups" className="flex items-center text-sm text-[#002B5B]/70 hover:text-[#F7931E] transition-colors">
                <span className="material-icons text-lg mr-2">work</span>
                Job Seekers
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 