import { useState, useEffect } from 'react';
import { commentService } from '../../services/commentService';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { useAuth } from '../../context/AuthContext'; // adjust path as needed

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showComments, setShowComments] = useState(true); // <-- Add this line
const [commentCount, setCommentCount] = useState(0);
const { user: currentUser } = useAuth(); 


// Helper to find a comment or reply by id in the tree
  const findCommentById = (comments, id) => {
    for (const comment of comments) {
      if (comment.id === id) return comment;
      if (comment.replies) {
        const found = findCommentById(comment.replies, id);
        if (found) return found;
      }
    }
    return null;
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getComments(postId, page);
      
      if (page === 0) {
        setComments(data.content);
      } else {
        setComments(prev => [...prev, ...data.content]);
      }
      
      setHasMore(!data.last);
      setLoading(false);
    } catch (err) {
      setError('Failed to load comments');
      setLoading(false);
    }
  };
  const fetchCommentCount = async () => {
    try {
      const count = await commentService.getCommentCount(postId);
      setCommentCount(count);
    } catch {
      setCommentCount(0);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchCommentCount();
  }, [postId, page]);
 

  const handleAddComment = async (content) => {
    try {
      const newComment = await commentService.addComment(postId, content);
      setComments(prev => [newComment, ...prev]);
    } catch (err) {
      setError('Failed to add comment');
    }
  };
  
  // ...existing code...
const handleReply = async (parentCommentId, content) => {
  try {
    const replyDTO = {
      postId,    // <-- required by backend
      content
    };
    const newReply = await commentService.replyToComment(parentCommentId, replyDTO);


    // Update the comment tree with the new reply
    setComments(prev => 
      prev.map(comment => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      })
    );
  } catch (err) {
    setError('Failed to add reply');
  }
};
// ...existing code...


// Correct usage in CommentSection.jsx
const handleEdit = async (commentId, content) => {
  // Find the comment or reply in the tree
  const comment = findCommentById(comments, commentId);
  if (!comment) {
    setError('Comment not found');
    return;
  }

  // Use userId and userDisplayName from your CommentDTO
  const ownerId = comment.userId;
  const ownerName = comment.userDisplayName || 'the owner';

  if (!currentUser || ownerId !== currentUser.id) {
    setError(`Can't edit comments or replies by ${ownerName}`);
    return;
  }

  try {
    const commentDTO = { content, postId };
    const updatedComment = await commentService.editComment(commentId, commentDTO);
    setComments(prev => updateCommentInTree(prev, updatedComment));
  } catch (err) {
    setError('Failed to edit comment');
  }
};

// ...existing code...

  const handleDelete = async (commentId) => {
    // Find the comment or reply in the tree
    const comment = findCommentById(comments, commentId);
    if (!comment) {
      setError('Comment not found');
      return;
    }
    const ownerId = comment.userId;
    const ownerName = comment.userDisplayName || 'the owner';

    if (!currentUser || ownerId !== currentUser.id) {
      setError(`Can't delete comments or replies by ${ownerName}`);
      return;
    }

    try {
      await commentService.deleteComment(commentId);
      setComments(prev => removeCommentFromTree(prev, commentId));
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  // Helper function to update a comment in the comment tree
  const updateCommentInTree = (comments, updatedComment) => {
    return comments.map(comment => {
      if (comment.id === updatedComment.id) {
        return { ...comment, ...updatedComment };
      }
      
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentInTree(comment.replies, updatedComment)
        };
      }
      
      return comment;
    });
  };

  // Helper function to remove a comment from the comment tree
  const removeCommentFromTree = (comments, commentId) => {
    return comments.filter(comment => {
      if (comment.id === commentId) {
        return false;
      }
      
      if (comment.replies && comment.replies.length > 0) {
        comment.replies = removeCommentFromTree(comment.replies, commentId);
      }
      
      return true;
    });
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="mt-6 space-y-6">
      <div>
        <button
          className="text-sm text-gray-700 hover:underline"
          onClick={() => setShowComments(prev => !prev)}
        >
          {showComments
            ? `Hide Comments`
            : `Show Comments (${commentCount})`}
        </button>
      </div>

      {showComments && (
        <>
          <h3 className="text-xl font-semibold">Comments</h3>
          <CommentForm onSubmit={handleAddComment} placeholder="Add a comment..." />
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-4">
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
              /> ))}
              </div>
              {loading && (
                <div className="py-4 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                </div>
              )}
              {!loading && hasMore && (
                <div className="text-center">
                  <button
                    onClick={loadMore}
                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Load More Comments
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      );
    };
    
    export default CommentSection;