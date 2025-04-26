import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommentSection from '../components/comments/CommentSection';
import LikeButton from '../components/likes/LikeButton';
import LikesList from '../components/likes/LikesList';

export const mockPosts = [
  {
    id: 1,
    title: "Getting Started with React Development",
    content: "React is a powerful JavaScript library for building user interfaces. In this post, we'll explore the fundamental concepts of React and how to get started with your first React application.",
    userName: "John Doe",
    createdAt: "2025-04-26T10:30:00Z",
    likes: 42,
    comments: [
      {
        id: 1,
        content: "Great introduction to React!",
        userName: "Alice Smith",
        createdAt: "2025-04-26T11:00:00Z"
      },
      {
        id: 2,
        content: "This helped me understand React better",
        userName: "Bob Johnson",
        createdAt: "2025-04-26T11:30:00Z"
      }
    ]
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    content: "TypeScript brings static typing to JavaScript. Let's dive into some advanced patterns and best practices that can make your TypeScript code more robust and maintainable.",
    userName: "Jane Smith",
    createdAt: "2025-04-25T15:45:00Z",
    likes: 38,
    comments: [
      {
        id: 3,
        content: "These patterns are game-changing!",
        userName: "Charlie Brown",
        createdAt: "2025-04-25T16:00:00Z"
      }
    ]
  },
  {
    id: 3,
    title: "Building Scalable APIs with Node.js",
    content: "Learn how to create robust and scalable backend APIs using Node.js, Express, and best practices for API design.",
    userName: "Mike Wilson",
    createdAt: "2025-04-24T09:15:00Z",
    likes: 55,
    comments: []
  }
];

const PostFeed = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLikes, setShowLikes] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Assume there's a post service to fetch post details
        // const response = await api.get(`/api/posts/${postId}`);
        // setPost(response.data);
        setPost(mockPosts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="p-4 bg-red-50 text-red-500 rounded-md">
          {error || 'Post not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Post header */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="ml-3">
              <div className="font-medium">{post.userName}</div>
              <div className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {/* Post content */}
          <h1 className="text-xl font-semibold mb-3">{post.title}</h1>
          <div className="prose max-w-none">{post.content}</div>
          
          {/* Post actions */}
          <div className="mt-6 flex items-center space-x-4">
            <LikeButton postId={postId} />
            
            <button
              onClick={() => setShowLikes(true)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              View likes
            </button>
            
            <button
              className="text-sm text-gray-600 hover:text-gray-800"
              onClick={() => document.getElementById('comments').scrollIntoView({ behavior: 'smooth' })}
            >
              Comments
            </button>
          </div>
        </div>
        
        {/* Comments section */}
        <div id="comments" className="border-t border-gray-200 p-6">
          <CommentSection postId={postId} />
        </div>
      </div>
      
      {/* Likes modal */}
      <LikesList
        postId={postId}
        isOpen={showLikes}
        onClose={() => setShowLikes(false)}
      />
    </div>
  );
};

export default PostFeed;