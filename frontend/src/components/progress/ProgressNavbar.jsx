import React from 'react';
import { NavLink } from 'react-router-dom';

const ProgressNavbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-10 py-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6">
        <h1 className="text-xl font-bold text-[#002B5B] flex items-center">
          <span className="mr-2">📚</span>
          Learning Tracker
        </h1>
        <div className="flex gap-6">
          <NavLink
            to="/projects/"
            className={({ isActive }) =>
              isActive
                ? "text-[#002B5B] font-semibold px-4 py-2 rounded-md relative after:content-[''] after:absolute after:bottom-[-5px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-5 after:h-[3px] after:bg-[#F7931E] after:rounded-md"
                : "text-[#4a5568] font-medium px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover:text-[#F7931E] hover:bg-[#FFF5EB]"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/projects/add"
            className={({ isActive }) =>
              isActive
                ? "text-[#002B5B] font-semibold px-4 py-2 rounded-md relative after:content-[''] after:absolute after:bottom-[-5px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-5 after:h-[3px] after:bg-[#F7931E] after:rounded-md"
                : "text-[#4a5568] font-medium px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover:text-[#F7931E] hover:bg-[#FFF5EB]"
            }
          >
            Add Progress
          </NavLink>
          <NavLink
            to="/projects/achievements"
            className={({ isActive }) =>
              isActive
                ? "text-[#002B5B] font-semibold px-4 py-2 rounded-md relative after:content-[''] after:absolute after:bottom-[-5px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-5 after:h-[3px] after:bg-[#F7931E] after:rounded-md"
                : "text-[#4a5568] font-medium px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover:text-[#F7931E] hover:bg-[#FFF5EB]"
            }
          >
            Achievements
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default ProgressNavbar;
