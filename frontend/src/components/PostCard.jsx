// src/components/PostCard.jsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const PostCard = ({ post, currentUser, onReaction }) => {
  const { id, userId, message, timestamp, reactions, type, skill, template } = post;
  
  // Array of available reaction emojis
  const emojis = ['👍', '❤️', '🎉', '👏', '🔥'];
  
  // Check if the current user has already reacted
  const userReaction = reactions.find(r => r.userId === currentUser.id);
  
  // Count reactions by emoji
  const reactionCounts = reactions.reduce((counts, reaction) => {
    counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
    return counts;
  }, {});

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${userId}`} className="user-link">
          {/* This would need to be replaced with actual user data */}
          <div className="user-avatar">
            {/* User avatar image here */}
          </div>
          <span className="username">{userId}</span>
        </Link>
        <span className="timestamp">
          {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
        </span>
      </div>
      
      {type === 'MILESTONE' && (
        <div className="milestone-badge">
          🏆 Achievement: {template}
        </div>
      )}
      
      {skill && (
        <div className="skill-tag">
          {skill}
        </div>
      )}
      
      <div className="post-content">
        <p>{message}</p>
      </div>
      
      <div className="post-reactions">
        {emojis.map(emoji => (
          <button 
            key={emoji}
            className={`reaction-button ${userReaction?.emoji === emoji ? 'active' : ''}`}
            onClick={() => onReaction(id, emoji)}
          >
            {emoji} {reactionCounts[emoji] || 0}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PostCard;