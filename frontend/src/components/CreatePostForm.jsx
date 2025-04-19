import React, { useState } from 'react';

const CreatePostForm = ({ onSubmit }) => {
  const [message, setMessage] = useState('');
  const [skill, setSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        message,
        skill: skill || undefined
      });
      setMessage('');
      setSkill('');
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Share something with the community..."
        rows={3}
        required
      />
      
      <div className="form-footer">
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Skill tag (optional)"
          className="skill-input"
        />
        
        <button 
          type="submit" 
          disabled={isSubmitting || !message.trim()}
          className="submit-button"
        >
          Post
        </button>
      </div>
    </form>
  );
};

export default CreatePostForm;