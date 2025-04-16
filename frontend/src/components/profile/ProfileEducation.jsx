import React from 'react';

export default function ProfileEducation({ education }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#002B5B]">Education</h2>
        <button className="text-[#F7931E] hover:text-[#F7931E]/80 transition-colors">
          <span className="material-icons">add</span>
        </button>
      </div>

      <div className="space-y-6">
        {education.length === 0 ? (
          <p className="text-[#002B5B]/60 text-center py-4">No education added yet</p>
        ) : (
          education.map((edu) => (
            <div key={edu.id} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#002B5B]/5 rounded-lg flex items-center justify-center">
                <span className="material-icons text-[#002B5B]">school</span>
              </div>
              
              <div>
                <h3 className="font-medium text-[#002B5B]">{edu.school}</h3>
                <p className="text-[#002B5B]/80">{edu.degree} • {edu.field}</p>
                <p className="text-sm text-[#002B5B]/60">
                  {edu.startDate} - {edu.endDate}
                </p>
                {edu.grade && (
                  <p className="text-sm text-[#002B5B]/60 mt-1">
                    Grade: {edu.grade}
                  </p>
                )}
                {edu.activities && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-[#002B5B]">Activities and Societies:</p>
                    <p className="text-[#002B5B]/80 whitespace-pre-wrap">{edu.activities}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 