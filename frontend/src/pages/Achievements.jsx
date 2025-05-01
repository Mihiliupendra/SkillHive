import React, { useState, useEffect } from 'react';
import { fetchAllProgress, deleteProgress } from '../api/api';
import EditModal from '../components/progress/EditModal';
import Alert from '../components/progress/Alert';

const Achievements = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [editingProgress, setEditingProgress] = useState(null);
  const [alert, setAlert] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const tabs = [
    { id: 'projects', label: 'Projects', template: 'Completed Project/Task' },
    { id: 'certifications', label: 'Certifications', template: 'Certification/Qualification' },
    { id: 'challenges', label: 'Challenges', template: 'Challenges/Competitions' },
    { id: 'workshops', label: 'Workshops', template: 'Workshops/Bootcamps' }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProgress();
      setProgressData(data);
      setLoading(false);
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to load achievements. Please try again.'
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleEdit = (progress) => {
    setEditingProgress(progress);
  };

  const handleSave = () => {
    setEditingProgress(null);
    fetchData();
    setAlert({
      type: 'success',
      message: 'Progress updated successfully!'
    });
  };

  const handleCloseModal = () => {
    setEditingProgress(null);
  };

  const handleDeleteConfirm = (progress) => {
    setConfirmDelete(progress);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteProgress(confirmDelete.id);
      setConfirmDelete(null);
      await fetchData();
      setAlert({
        type: 'success',
        message: 'Progress deleted successfully!'
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to delete progress. Please try again.'
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  // Filter achievements based on active tab
  const filteredAchievements = progressData.filter(
    progress => tabs.find(tab => tab.id === activeTab)?.template === progress.template
  );

  // Render template-specific details
  const renderTemplateDetails = (progress) => {
    switch (progress.template) {
      case 'Completed Project/Task':
        return (
          <>
            {progress.projectName && (
              <div className="mb-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Project Name:</span> {progress.projectName}
              </div>
            )}
            {progress.projectLink && (
              <div className="mb-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Project Link:</span> <a href={progress.projectLink} target="_blank" rel="noopener noreferrer" className="text-[#0a9bdf] hover:underline">{progress.projectLink}</a>
              </div>
            )}
          </>
        );
      case 'Certification/Qualification':
        return (
          <>
            {progress.certificationName && (
              <div className="mb-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Certification:</span> {progress.certificationName}
              </div>
            )}
            {progress.provider && (
              <div className="mb-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Provider:</span> {progress.provider}
              </div>
            )}
            {progress.dateObtained && (
              <div className="mb-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Date Obtained:</span> {progress.dateObtained}
              </div>
            )}
          </>
        );
      case 'Challenges/Competitions':
        return (
          <>
            {progress.challengeName && (
              <div className="mb-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Challenge:</span> {progress.challengeName}
              </div>
            )}
            {progress.result && (
              <div className="mb-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Result:</span> {progress.result}
              </div>
            )}
          </>
        );
      case 'Workshops/Bootcamps':
        return (
          <>
            {progress.workshopName && (
              <div className="mb-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Workshop:</span> {progress.workshopName}
              </div>
            )}
            {progress.provider && (
              <div className="mb-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Provider:</span> {progress.provider}
              </div>
            )}
            {progress.duration && (
              <div className="mb-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Duration:</span> {progress.duration}
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
        <div className="w-10 h-10 border-3 border-[rgba(74,144,226,0.3)] rounded-full border-t-[#0a9bdf] animate-spin mb-4"></div>
        <p>Loading your achievements...</p>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-6">
      <h1 className="text-2xl font-bold text-[#2b6cb0] mb-8 relative pl-4 flex items-center before:content-[''] before:absolute before:left-0 before:top-[10px] before:h-[65%] before:w-[5px] before:bg-[#0a9bdf] before:rounded-md">
        My Achievements
      </h1>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-5 py-3 bg-white rounded-md font-medium transition-all duration-300 whitespace-nowrap shadow-sm ${activeTab === tab.id
              ? 'bg-[#0a9bdf] text-[] shadow-[0_4px_12px_rgba(74,144,226,0.25)]'
              : 'text-gray-600 hover:bg-[#f5f9ff] hover:text-[#0a9bdf]'
              }`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-8">
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-12 px-6 text-gray-500 bg-white rounded-lg shadow-sm">
            <p>No {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map(progress => (
              <div key={progress.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="flex justify-between p-4 bg-[rgba(245,249,255,0.7)] border-b border-[#e2e8f0]">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium 
                    ${progress.status.toLowerCase() === 'inprogress' ? 'bg-[rgba(74,144,226,0.2)] text-[#2b6cb0]' : ''} 
                    ${progress.status.toLowerCase() === 'completed' ? 'bg-[rgba(52,211,153,0.2)] text-[#065f46]' : ''} 
                    ${progress.status.toLowerCase() === 'onhold' ? 'bg-[rgba(251,191,36,0.2)] text-[#92400e]' : ''} 
                    ${progress.status.toLowerCase() === 'planned' ? 'bg-[rgba(139,92,246,0.2)] text-[#5521b5]' : ''}`}>
                    {progress.status}
                  </span>
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-[rgba(203,213,225,0.3)] text-gray-600">
                    {progress.template}
                  </span>
                </div>

                <h3 className="text-lg font-semibold p-4 pb-2 text-[#2b6cb0]">{progress.topic}</h3>
                <p className="px-4 mt-0 text-gray-600 flex-grow">{progress.description}</p>

                <div className="px-4">
                  {renderTemplateDetails(progress)}
                </div>

                {progress.resourceLink && (
                  <div className="px-4 pb-4">
                    <a
                      href={progress.resourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium text-[#0a9bdf] border border-[#0a9bdf] rounded-md transition-all duration-300 hover:bg-[#0a9bdf] hover:text-white"
                    >
                      View Resource
                    </a>
                  </div>
                )}

                {(progress.nextSteps || progress.reflection) && (
                  <div className="p-4 mt-4 bg-[rgba(245,249,255,0.5)] border-t border-[#e2e8f0]">
                    {progress.nextSteps && (
                      <div className="text-sm mb-2 text-gray-600">
                        <span className="font-medium">Next Steps:</span> {progress.nextSteps}
                      </div>
                    )}
                    {progress.reflection && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Reflection:</span> {progress.reflection}
                      </div>
                    )}
                  </div>
                )}

                <div className="px-3 py-2 bg-[rgba(245,249,255,0.3)] border-t border-[#e2e8f0] text-xs text-gray-500">
                  <span>Added: {new Date(progress.timestamp).toLocaleDateString()}</span>
                </div>

                <div className="flex border-t border-[#e2e8f0]">
                  <button
                    className="flex-1 py-3 flex items-center justify-center border-r border-[#e2e8f0] bg-white cursor-pointer transition-all duration-300 text-sm text-gray-600 hover:bg-[#f5f9ff] hover:text-[#0a9bdf]"
                    onClick={() => handleEdit(progress)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="flex-1 py-3 flex items-center justify-center bg-white cursor-pointer transition-all duration-300 text-sm text-gray-600 hover:bg-[rgba(248,113,113,0.1)] hover:text-[#f87171]"
                    onClick={() => handleDeleteConfirm(progress)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingProgress && (
        <EditModal
          progress={editingProgress}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100 overflow-hidden animate-fadeIn">
          <div className="bg-white rounded-lg w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto p-5 shadow-lg animate-slideIn">
            <div className="flex justify-between items-center p-5 border-b border-[#e2e8f0]">
              <h2 className="text-xl font-semibold text-[#2b6cb0] m-0">Confirm Delete</h2>
              <button className="bg-transparent border-0 text-2xl cursor-pointer text-gray-500" onClick={cancelDelete}>&times;</button>
            </div>
            <div className="p-5">
              <p>Are you sure you want to delete "{confirmDelete.topic}"?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-4 p-5 border-t border-[#e2e8f0]">
              <button
                className="px-4 py-2 text-sm font-medium text-[#0a9bdf] border border-[#0a9bdf] rounded-md transition-all duration-300 hover:bg-[#0a9bdf] hover:text-white"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium bg-[#f87171] text-white rounded-md transition-all duration-300 hover:bg-[#e05252] disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;