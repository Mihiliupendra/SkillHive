import { useState, useEffect } from 'react';
import { likeService } from '../../services/likeService';

const LikesList = ({ postId, isOpen, onClose }) => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLikes = async () => {
      if (!isOpen || !postId) return;
      
      try {
        setLoading(true);
        const likesData = await likeService.getPostLikes(postId);
        
        if (isMounted) {
          setLikes(likesData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching likes:', err);
          setError('Failed to load likes');
          setLoading(false);
        }
      }
    };

    fetchLikes();

    return () => {
      isMounted = false;
    };
  }, [postId, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setLikes([]);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Likes</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 flex-1">
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : likes.length === 0 ? (
            <div className="text-gray-500 text-center">No likes yet</div>
          ) : (
            <ul className="divide-y">
              {likes.map(like => (
                <li key={like.id} className="py-2 flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <span className="ml-3">{like.username}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikesList;