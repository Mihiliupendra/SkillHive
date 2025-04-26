import { useState, useEffect } from 'react';
import { likeService } from '../../services/likeService';

const LikeButton = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const [hasLikedRes, countRes] = await Promise.all([
          likeService.hasLiked(postId),
          likeService.getLikeCount(postId)
        ]);
        
        setLiked(hasLikedRes);
        setLikeCount(countRes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching like status:', error);
        setLoading(false);
      }
    };

    fetchLikeStatus();
  }, [postId]);

  const handleLikeClick = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      if (liked) {
        await likeService.unlikePost(postId);
        setLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        await likeService.likePost(postId);
        setLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeClick}
      disabled={loading}
      className={`flex items-center space-x-1 px-3 py-1 rounded-md transition ${
        liked
          ? 'text-red-600 hover:text-red-700'
          : 'text-gray-600 hover:text-gray-800'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={liked ? "0" : "1.5"}
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton;