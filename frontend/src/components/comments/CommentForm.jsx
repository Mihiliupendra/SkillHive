import { useState } from 'react';

const CommentForm = ({ onSubmit, onCancel, initialValue = '', placeholder = 'Write a comment...' }) => {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    await onSubmit(content);
    setIsSubmitting(false);
    
    if (!initialValue) {
      setContent('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
      />
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : initialValue ? 'Save' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;