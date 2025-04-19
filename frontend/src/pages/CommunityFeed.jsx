// src/pages/CommunityFeed.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import CommunityService from '../services/communityService';
import { useAuth } from '../context/AuthContext'; // Assume you have this for current user
import PostCard from '../components/PostCard';
import CreatePostForm from '../components/CreatePostForm';

const CommunityFeed = () => {
  const { communityId } = useParams();
  const { currentUser } = useContext(useAuth);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchCommunityData = async () => {
      setLoading(true);
      try {
        const communityResponse = await CommunityService.getCommunityById(communityId);
        setCommunity(communityResponse.data);
        
        const postsResponse = await CommunityService.getCommunityPosts(communityId, page);
        setPosts(postsResponse.data.content);
        setHasMore(!postsResponse.data.last);
      } catch (error) {
        console.error('Error fetching community data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [communityId, page]);

  const loadMorePosts = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleCreatePost = async (postData) => {
    try {
      const newPost = {
        userId: currentUser.id,
        communityId: communityId,
        type: 'MANUAL',
        message: postData.message,
        timestamp: new Date().toISOString(),
        // Add any other fields from the form
      };
      
      const response = await CommunityService.createPost(newPost);
      setPosts(prevPosts => [response.data, ...prevPosts]);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleReaction = async (postId, emoji) => {
    try {
      await CommunityService.addReaction(postId, currentUser.id, emoji);
      
      // Update the UI to reflect the new reaction
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            // Check if user already reacted
            const userReactionIndex = post.reactions.findIndex(
              r => r.userId === currentUser.id
            );
            
            if (userReactionIndex >= 0) {
              // Replace existing reaction
              const updatedReactions = [...post.reactions];
              updatedReactions[userReactionIndex] = {
                userId: currentUser.id,
                emoji: emoji,
                reactedAt: new Date().toISOString()
              };
              return { ...post, reactions: updatedReactions };
            } else {
              // Add new reaction
              return {
                ...post,
                reactions: [
                  ...post.reactions,
                  {
                    userId: currentUser.id,
                    emoji: emoji,
                    reactedAt: new Date().toISOString()
                  }
                ]
              };
            }
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  if (loading && !posts.length) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="community-feed">
      {community && (
        <div className="community-header">
          <h1>{community.name}</h1>
          <p>{community.description}</p>
          {community.memberIds.includes(currentUser.id) ? (
            <button 
              onClick={() => CommunityService.leaveCommunity(communityId, currentUser.id)}
              className="leave-button"
            >
              Leave Community
            </button>
          ) : (
            <button 
              onClick={() => CommunityService.joinCommunity(communityId, currentUser.id)}
              className="join-button"
            >
              Join Community
            </button>
          )}
        </div>
      )}

      <CreatePostForm onSubmit={handleCreatePost} />

      <div className="posts-container">
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            currentUser={currentUser}
            onReaction={handleReaction}
          />
        ))}
      </div>

      {hasMore && (
        <button onClick={loadMorePosts} className="load-more">
          Load More
        </button>
      )}
    </div>
  );
};

export default CommunityFeed;