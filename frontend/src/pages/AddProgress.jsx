import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProgress } from '../api/api';

const Alert = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const borderColor = type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500';

  return (
    <div className={`p-4 rounded-md mb-6 flex items-center justify-between ${bgColor} text-black ${borderColor}`}>
      <div>{message}</div>
      <button
        onClick={onClose}
        className="text-black hover:text-orange-500"
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
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    resourceLink: '',
    status: 'In Progress',
    nextSteps: '',
    reflection: '',
    template: '',
  });

  const [showTemplateFields, setShowTemplateFields] = useState(false);

  const statusOptions = ['In Progress', 'Completed', 'On Hold', 'Planned'];
  const templateOptions = ['Completed Project/Task', 'Certification/Qualification', 'Challenges/Competitions', 'Workshops/Bootcamps'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'template') {
      setShowTemplateFields(true);
    }
  };

  const InputField = ({ label, name, value, onChange, type = "text", placeholder = "" }) => (
    <div className="mb-6">
      <label htmlFor={name} className="block mb-2 font-medium text-black">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        className={`w-full px-4 py-3 border ${errors[name] ? 'border-red-500' : 'border-gray-200'} rounded-md focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all bg-white text-black`}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
      />
      {errors[name] && <p className="text-sm text-red-500 mt-2">{errors[name]}</p>}
    </div>
  );

  const renderTemplateFields = () => {
    switch (formData.template) {
      case 'Completed Project/Task':
        return (
          <>
            <InputField label="Project Name" name="projectName" value={formData.projectName} onChange={handleInputChange} />
            <InputField label="Project Link" name="projectLink" value={formData.projectLink} onChange={handleInputChange} />
          </>
        );
      case 'Certification/Qualification':
        return (
          <>
            <InputField label="Certification Name" name="certificationName" value={formData.certificationName} onChange={handleInputChange} />
            <InputField label="Provider" name="provider" value={formData.provider} onChange={handleInputChange} />
            <InputField label="Date Obtained" name="dateObtained" type="date" value={formData.dateObtained} onChange={handleInputChange} />
          </>
        );
      case 'Challenges/Competitions':
        return (
          <>
            <InputField label="Challenge Name" name="challengeName" value={formData.challengeName} onChange={handleInputChange} />
            <InputField label="Result" name="result" value={formData.result} onChange={handleInputChange} />
          </>
        );
      case 'Workshops/Bootcamps':
        return (
          <>
            <InputField label="Workshop Name" name="workshopName" value={formData.workshopName} onChange={handleInputChange} />
            <InputField label="Provider" name="provider" value={formData.provider} onChange={handleInputChange} />
            <InputField label="Duration" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g. 4 weeks, 2 days" />
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = {};
    const requiredFields = ['topic', 'description', 'resourceLink', 'status', 'template', 'nextSteps', 'reflection'];
    const urlFields = ['resourceLink', 'projectLink'];
  
    // Validate required fields
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = 'This field is required.';
      }
    }
  
    // Validate URLs
    urlFields.forEach((field) => {
      if (formData[field] && !/^https?:\/\//i.test(formData[field])) {
        newErrors[field] = 'URL must start with http:// or https://';
      }
    });
  
    // If there are any validation errors, show them and display alert
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setAlert({ type: 'error', message: 'Please fill all required fields correctly.' });
      return;
    }
  
    setErrors({});
    const dataToSubmit = { ...formData, timestamp: new Date().toISOString() };
  
    try {
      setLoading(true);
      await createProgress(dataToSubmit);
      setAlert({ type: 'success', message: 'Progress added successfully!' });
      setTimeout(() => navigate('/projects/achievements'), 2000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to add progress. Please try again.' });
      setLoading(false);
    }
  };
  
  return (
    <div className="py-8 px-4 max-w-8xl mx-auto bg-orange-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden max-w-3xl mx-auto">
        <h1 className="text-center py-8 px-8 m2-0 text-4xl font-bold text-black bg-orange-50 bg-opacity-80 border-b border-gray-200">
          Add Learning Progress
        </h1>

        {alert && (
          <div className="px-8 pt-6">
            <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Section title="Basic Information">
            <InputField label="Topic" name="topic" value={formData.topic} onChange={handleInputChange} placeholder="What did you learn?" />
            <div className="mb-6">
              <label htmlFor="description" className="block mb-2 font-medium text-black">Description</label>
              <textarea
                id="description"
                name="description"
                className={`w-full px-4 py-3 border ${errors['description'] ? 'border-red-500' : 'border-gray-200'} rounded-md focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all bg-white text-black min-h-32 resize-y`}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what you learned..."
              />
              {errors['description'] && <p className="text-sm text-red-500 mt-2">{errors['description']}</p>}
            </div>
            <InputField label="Resource Link" name="resourceLink" value={formData.resourceLink} onChange={handleInputChange} placeholder="Link to the resource you used" />
            <div className="mb-6">
              <label htmlFor="status" className="block mb-2 font-medium text-black">Status</label>
              <select
                id="status"
                name="status"
                className={`w-full px-4 py-3 border ${errors['status'] ? 'border-red-500' : 'border-gray-200'} rounded-md focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all bg-white text-black`}
                value={formData.status}
                onChange={handleInputChange}
              >
                {statusOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
              {errors['status'] && <p className="text-sm text-red-500 mt-2">{errors['status']}</p>}
            </div>
          </Section>

          <Section title="Template Selection">
            <div className="mb-6">
              <label htmlFor="template" className="block mb-2 font-medium text-black">Achievement Type</label>
              <select
                id="template"
                name="template"
                className={`w-full px-4 py-3 border ${errors['template'] ? 'border-red-500' : 'border-gray-200'} rounded-md focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all bg-white text-black`}
                value={formData.template}
                onChange={handleInputChange}
              >
                <option value="">Select achievement type</option>
                {templateOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
              {errors['template'] && <p className="text-sm text-red-500 mt-2">{errors['template']}</p>}
            </div>
            {showTemplateFields && (
              <div className="bg-orange-50 bg-opacity-50 rounded-md p-5 mt-4">
                <h3 className="text-lg font-semibold mb-5 text-black">{formData.template} Details</h3>
                {renderTemplateFields()}
              </div>
            )}
          </Section>

          <Section title="Reflection">
            <div className="mb-6">
              <label htmlFor="nextSteps" className="block mb-2 font-medium text-black">Next Steps</label>
              <textarea
                id="nextSteps"
                name="nextSteps"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all bg-white text-black min-h-32 resize-y"
                value={formData.nextSteps}
                onChange={handleInputChange}
                placeholder="What are your next steps?"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="reflection" className="block mb-2 font-medium text-black">Reflection</label>
              <textarea
                id="reflection"
                name="reflection"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all bg-white text-black min-h-32 resize-y"
                value={formData.reflection}
                onChange={handleInputChange}
                placeholder="Reflect on your learning experience..."
              />
            </div>
          </Section>

          <div className="py-6 px-8 flex gap-4 justify-end bg-orange-50 bg-opacity-50">
            <button
              type="button"
              className="px-5 py-2.5 font-semibold rounded-md bg-orange-500 hover:bg-orange-300 text-black transform hover:-translate-y-0.5 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 font-semibold rounded-md bg-orange-500 hover:bg-orange-600 text-black shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="inline-block w-5 h-5 border-2 border-black/50 border-t-black rounded-full animate-spin"></span>
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

const Section = ({ title, children }) => (
  <div className="py-6 px-8 border-b border-gray-200">
    <h2 className="text-2xl font-semibold mb-6 text-black flex items-center">
      <span className="inline-block w-5 h-0.5 bg-orange-500 mr-2 rounded"></span>
      {title}
    </h2>
    {children}
  </div>
);

export default AddProgress;
