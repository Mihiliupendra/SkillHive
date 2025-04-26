import { useState } from 'react';
import CommentForm from './CommentForm';
import { formatDistanceToNow } from 'date-fns';

const CommentItem = ({ comment, onReply, onEdit, onDelete }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  
  const handleReply = (content) => {
    onReply(comment.id, content);
    setIsReplying(false);
  };
  
  const handleEdit = (content) => {
    onEdit(comment.id, content);
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment.id);
    }
  };

  return (
    <div className="comment-item">
      <div className={`p-4 border border-gray-200 rounded-lg ${comment.deleted ? 'bg-gray-50' : ''}`}>
        {/* Comment header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="font-medium">{comment.userName || 'Anonymous'}</div>
            <span className="ml-2 text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              {comment.edited && <span className="ml-1">(edited)</span>}
            </span>
          </div>
          
          {/* Comment actions */}
          {!comment.deleted && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reply
              </button>
              
              {/* Only show edit/delete for the comment owner */}
              {comment.canEdit && (
                <>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Comment content */}
        {isEditing ? (
          <CommentForm 
            initialValue={comment.content}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="text-gray-800 whitespace-pre-wrap">
            {comment.deleted ? (
              <em className="text-gray-500">This comment has been deleted</em>
            ) : (
              comment.content
            )}
          </div>
        )}
        
        {/* Reply form */}
        {isReplying && (
          <div className="mt-3">
            <CommentForm 
              onSubmit={handleReply}
              onCancel={() => setIsReplying(false)}
              placeholder="Write a reply..."
            />
          </div>
        )}
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-6 mt-2">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-sm text-gray-600 hover:text-gray-800 mb-2"
          >
            {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
          </button>
          
          {showReplies && (
            <div className="space-y-2">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;