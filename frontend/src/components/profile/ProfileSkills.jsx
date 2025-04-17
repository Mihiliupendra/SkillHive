import React, { useState, useEffect } from 'react';
import AddSkillModal from '../AddSkillModal';

export default function ProfileSkills({ skills, isOwnProfile, onSkillsUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log('ProfileSkills received skills:', skills);
  }, [skills]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveSkills = (updatedSkills) => {
    console.log('Saving skills in ProfileSkills:', updatedSkills);
    if (onSkillsUpdate) {
      onSkillsUpdate(updatedSkills);
    }
  };

  // Ensure skills is always an array
  const skillsArray = Array.isArray(skills) ? skills : [];
  console.log('Rendering skills:', skillsArray);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#002B5B]">Skills</h2>
        {isOwnProfile && (
          <button 
            className="text-[#F7931E] hover:text-[#F7931E]/80 transition-colors"
            onClick={handleOpenModal}
          >
            <span className="material-icons">add</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {skillsArray.length === 0 ? (
          <p className="text-[#002B5B]/60 text-center py-4">No skills added yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skillsArray.map((skill, index) => (
              <div
                key={skill.id || index}
                className="bg-[#002B5B]/5 text-[#002B5B] px-3 py-1 rounded-full text-sm hover:bg-[#002B5B]/10 transition-colors"
              >
                {skill.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <AddSkillModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSkills}
        currentSkills={skillsArray.map(skill => skill.name)}
      />
    </div>
  );
} 