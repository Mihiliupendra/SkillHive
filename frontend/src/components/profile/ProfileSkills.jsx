import React from 'react';

export default function ProfileSkills({ skills }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#002B5B]">Skills</h2>
        <button className="text-[#F7931E] hover:text-[#F7931E]/80 transition-colors">
          <span className="material-icons">add</span>
        </button>
      </div>

      <div className="space-y-4">
        {skills.length === 0 ? (
          <p className="text-[#002B5B]/60 text-center py-4">No skills added yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-[#002B5B]/5 text-[#002B5B] px-3 py-1 rounded-full text-sm hover:bg-[#002B5B]/10 transition-colors"
              >
                {skill.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 