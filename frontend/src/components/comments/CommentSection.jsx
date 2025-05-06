import { useState, useEffect } from 'react';
import { commentService } from '../../services/commentService';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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

  useEffect(() => {
    fetchComments();
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

  const handleEdit = async (commentId, content) => {
    try {
      const updatedComment = await commentService.editComment(commentId, content);
      
      // Find and update the comment in the tree
      setComments(prev => updateCommentInTree(prev, updatedComment));
    } catch (err) {
      setError('Failed to edit comment');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      
      // Remove the comment from the tree
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
          />
        ))}
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
    </div>
  );
};

export default CommentSection;