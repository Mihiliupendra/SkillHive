import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProgress } from '../api/api';

const Alert = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500';

  return (
    <div className={`p-4 rounded-md mb-6 flex items-center justify-between ${bgColor} ${textColor} ${borderColor}`}>
      <div>{message}</div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
    </div>
  );
};

const AddProgress = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    resourceLink: '',
    status: 'In Progress',
    nextSteps: '',
    reflection: '',
    template: '',
    // Template-specific fields will be added dynamically
  });

  const [showTemplateFields, setShowTemplateFields] = useState(false);

  const statusOptions = ['In Progress', 'Completed', 'On Hold', 'Planned'];

  const templateOptions = [
    'Completed Project/Task',
    'Certification/Qualification',
    'Challenges/Competitions',
    'Workshops/Bootcamps'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Show template-specific fields when template is selected
    if (name === 'template') {
      setShowTemplateFields(true);
    }
  };

  const renderTemplateFields = () => {
    switch (formData.template) {
      case 'Completed Project/Task':
        return (
          <>
            <div className="mb-6">
              <label htmlFor="projectName" className="block mb-2 font-medium text-gray-600">Project Name</label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={formData.projectName || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="projectLink" className="block mb-2 font-medium text-gray-600">Project Link</label>
              <input
                type="text"
                id="projectLink"
                name="projectLink"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={formData.projectLink || ''}
                onChange={handleInputChange}
              />
            </div>
          </>
        );
      case 'Certification/Qualification':
        return (
          <>
            <div className="mb-6">
              <label htmlFor="certificationName" className="block mb-2 font-medium text-gray-600">Certification Name</label>
              <input
                type="text"
                id="certificationName"
                name="certificationName"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={formData.certificationName || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="provider" className="block mb-2 font-medium text-gray-600">Provider</label>
              <input
                type="text"
                id="provider"
                name="provider"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={formData.provider || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="dateObtained" className="block mb-2 font-medium text-gray-600">Date Obtained</label>
              <input
                type="date"
                id="dateObtained"
                name="dateObtained"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={formData.dateObtained || ''}
                onChange={handleInputChange}
              />
            </div>
          </>
        );
      case 'Challenges/Competitions':
        return (
          <>
            <div className="mb-6">
              <label htmlFor="challengeName" className="block mb-2 font-medium text-gray-600">Challenge Name</label>
              <input
                type="text"
                id="challengeName"
                name="challengeName"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={formData.challengeName || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="result" className="block mb-2 font-medium text-gray-600">Result</label>
              <input
                type="text"
                id="result"
                name="result"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={formData.result || ''}
                onChange={handleInputChange}
              />
            </div>
          </>
        );
      case 'Workshops/Bootcamps':
        return (
          <>
            <div className="mb-6">
              <label htmlFor="workshopName" className="block mb-2 font-medium text-gray-600">Workshop Name</label>
              <input
                type="text"
                id="workshopName"
                name="workshopName"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={formData.workshopName || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="provider" className="block mb-2 font-medium text-gray-600">Provider</label>
              <input
                type="text"
                id="provider"
                name="provider"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={formData.provider || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="duration" className="block mb-2 font-medium text-gray-600">Duration</label>
              <input
                type="text"
                id="duration"
                name="duration"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={formData.duration || ''}
                onChange={handleInputChange}
                placeholder="e.g. 4 weeks, 2 days"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add timestamp
    const dataToSubmit = {
      ...formData,
      timestamp: new Date().toISOString(),
    };

    try {
      setLoading(true);
      await createProgress(dataToSubmit);
      setAlert({
        type: 'success',
        message: 'Progress added successfully!'
      });

      // Reset form after successful submission
      setTimeout(() => {
        navigate('/achievements');
      }, 2000);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to add progress. Please try again.'
      });
      setLoading(false);
    }
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden max-w-3xl mx-auto">
        <h1 className="text-center py-8 px-8 m2-0 text-4xl font-bold text-[#2b6cb0] bg-blue-50 bg-opacity-80 border-b border-gray-200 relative">
          Add Learning Progress
        </h1>

        {alert && (
          <div className="px-8 pt-6">
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="py-6 px-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-[#2b6cb0] flex items-center">
              <span className="inline-block w-5 h-0.5 bg-blue-500 mr-2 rounded"></span>
              Basic Information
            </h2>

            <div className="mb-6">
              <label htmlFor="topic" className="block mb-2 font-medium text-gray-600">Topic</label>
              <input
                type="text"
                id="topic"
                name="topic"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="What did you learn?"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block mb-2 font-medium text-gray-600">Description</label>
              <textarea
                id="description"
                name="description"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white min-h-32 resize-y"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what you learned..."
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="resourceLink" className="block mb-2 font-medium text-gray-600">Resource Link</label>
              <input
                type="text"
                id="resourceLink"
                name="resourceLink"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={formData.resourceLink}
                onChange={handleInputChange}
                placeholder="Link to the resource you used"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="status" className="block mb-2 font-medium text-gray-600">Status</label>
              <select
                id="status"
                name="status"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="py-6 px-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-[#2b6cb0] flex items-center">
              <span className="inline-block w-5 h-0.5 bg-blue-500 mr-2 rounded"></span>
              Template Selection
            </h2>
            <div className="mb-6">
              <label htmlFor="template" className="block mb-2 font-medium text-gray-600">Achievement Type</label>
              <select
                id="template"
                name="template"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={formData.template}
                onChange={handleInputChange}
                required
              >
                <option value="">Select achievement type</option>
                {templateOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {showTemplateFields && (
              <div className="bg-blue-50 bg-opacity-50 rounded-md p-5 mt-4">
                <h3 className="text-lg font-semibold mb-5 text-[#2b6cb0]">{formData.template} Details</h3>
                {renderTemplateFields()}
              </div>
            )}
          </div>

          <div className="py-6 px-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-[#2b6cb0] flex items-center">
              <span className="inline-block w-5 h-0.5 bg-blue-500 mr-2 rounded"></span>
              Reflection
            </h2>
            <div className="mb-6">
              <label htmlFor="nextSteps" className="block mb-2 font-medium text-gray-600">Next Steps</label>
              <textarea
                id="nextSteps"
                name="nextSteps"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white min-h-32 resize-y"
                value={formData.nextSteps}
                onChange={handleInputChange}
                placeholder="What are your next steps?"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="reflection" className="block mb-2 font-medium text-gray-600">Reflection</label>
              <textarea
                id="reflection"
                name="reflection"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white min-h-32 resize-y"
                value={formData.reflection}
                onChange={handleInputChange}
                placeholder="Reflect on your learning experience..."
              />
            </div>
          </div>

          <div className="py-6 px-8 flex gap-4 justify-end bg-blue-50 bg-opacity-50">
            <button
              type="button"
              className="px-5 py-2.5 font-semibold rounded-md border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transform hover:-translate-y-0.5 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 font-semibold rounded-md bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="inline-block w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                  <span>Saving...</span>
                </div>
              ) : 'Save Progress'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProgress;