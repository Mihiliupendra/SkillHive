import React, { useState, useEffect } from 'react';
import { updateProgress } from '../../api/api';

const EditModal = ({ progress, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const statusOptions = ['In Progress', 'Completed', 'On Hold', 'Planned'];

  useEffect(() => {
    if (progress) {
      setFormData(progress);
    }
  }, [progress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const requiredFields = ['topic', 'description', 'resourceLink', 'status', 'template', 'nextSteps', 'reflection'];
    const urlFields = ['resourceLink', 'projectLink'];
    let validationFailed = false;
  
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        setError(`Please fill the "${field}" field.`);
        validationFailed = true;
        return;
      }
    }
  
    for (const field of urlFields) {
      if (formData[field] && !/^https?:\/\//i.test(formData[field])) {
        setError(`The "${field}" must start with http:// or https://`);
        validationFailed = true;
        return;
      }
    }
  
    if (validationFailed) return;
  
    setLoading(true);
    setError(null);
  
    try {
      await updateProgress(progress.id, formData);
      onSave();
    } catch (err) {
      setError('Failed to update. Please try again.');
      setLoading(false);
    }
  };
  
  const renderTemplateFields = () => {
    switch (formData.template) {
      case 'Completed Project/Task':
        return (
          <>
            <div className="mb-6">
              <label htmlFor="projectName" className="block font-medium text-gray-600 mb-2">Project Name</label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.projectName || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="projectLink" className="block font-medium text-gray-600 mb-2">Project Link</label>
              <input
                type="text"
                id="projectLink"
                name="projectLink"
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label htmlFor="certificationName" className="block font-medium text-gray-600 mb-2">Certification Name</label>
              <input
                type="text"
                id="certificationName"
                name="certificationName"
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.certificationName || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="provider" className="block font-medium text-gray-600 mb-2">Provider</label>
              <input
                type="text"
                id="provider"
                name="provider"
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.provider || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="dateObtained" className="block font-medium text-gray-600 mb-2">Date Obtained</label>
              <input
                type="date"
                id="dateObtained"
                name="dateObtained"
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label htmlFor="challengeName" className="block font-medium text-gray-600 mb-2">Challenge Name</label>
              <input
                type="text"
                id="challengeName"
                name="challengeName"
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.challengeName || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="result" className="block font-medium text-gray-600 mb-2">Result</label>
              <input
                type="text"
                id="result"
                name="result"
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label htmlFor="workshopName" className="block font-medium text-gray-600 mb-2">Workshop Name</label>
              <input
                type="text"
                id="workshopName"
                name="workshopName"
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.workshopName || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="provider" className="block font-medium text-gray-600 mb-2">Provider</label>
              <input
                type="text"
                id="provider"
                name="provider"
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.provider || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="duration" className="block font-medium text-gray-600 mb-2">Duration</label>
              <input
                type="text"
                id="duration"
                name="duration"
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.duration || ''}
                onChange={handleInputChange}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg w-11/12 max-w-xl max-h-[90vh] overflow-y-auto shadow-xl animate-slideIn">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black-800">Edit Progress</h2>
          <button className="text-2xl text-gray-500 hover:text-gray-700 focus:outline-none" onClick={onClose}>&times;</button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 border-l-4 border-red-400 mb-6 mx-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="topic" className="block font-medium text-gray-600 mb-2">Topic</label>
            <input
              type="text"
              id="topic"
              name="topic"
              className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.topic || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block font-medium text-gray-600 mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-y"
              value={formData.description || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="resourceLink" className="block font-medium text-gray-600 mb-2">Resource Link</label>
            <input
              type="text"
              id="resourceLink"
              name="resourceLink"
              className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.resourceLink || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="status" className="block font-medium text-gray-600 mb-2">Status</label>
            <select
              id="status"
              name="status"
              className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              value={formData.status || ''}
              onChange={handleInputChange}
              required
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Template fields (read-only) */}
          <div className="mb-6">
            <label className="block font-medium text-gray-600 mb-2">Achievement Type</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded bg-gray-50"
              value={formData.template || ''}
              readOnly
            />
          </div>

          {/* Render template-specific fields */}
          {renderTemplateFields()}

          <div className="mb-6">
            <label htmlFor="nextSteps" className="block font-medium text-gray-600 mb-2">Next Steps</label>
            <textarea
              id="nextSteps"
              name="nextSteps"
              className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-y"
              value={formData.nextSteps || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="reflection" className="block font-medium text-gray-600 mb-2">Reflection</label>
            <textarea
              id="reflection"
              name="reflection"
              className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-y"
              value={formData.reflection || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-500 text-black font-medium rounded transition-colors"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-black font-medium rounded hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-orange border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;