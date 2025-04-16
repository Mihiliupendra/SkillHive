import React from 'react';

export default function ProfileExperience({ experience }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#002B5B]">Experience</h2>
        <button className="text-[#F7931E] hover:text-[#F7931E]/80 transition-colors">
          <span className="material-icons">add</span>
        </button>
      </div>

      <div className="space-y-6">
        {experience.length === 0 ? (
          <p className="text-[#002B5B]/60 text-center py-4">No experience added yet</p>
        ) : (
          experience.map((exp) => (
            <div key={exp.id} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#002B5B]/5 rounded-lg flex items-center justify-center">
                <span className="material-icons text-[#002B5B]">business</span>
              </div>
              
              <div>
                <h3 className="font-medium text-[#002B5B]">{exp.title}</h3>
                <p className="text-[#002B5B]/80">{exp.company}</p>
                <p className="text-sm text-[#002B5B]/60">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
                <p className="text-sm text-[#002B5B]/60 mb-2">{exp.location}</p>
                <p className="text-[#002B5B]/80 whitespace-pre-wrap">{exp.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 