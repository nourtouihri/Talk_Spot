import React, { createContext, useContext, useState } from 'react';
import { mockPosts, mockEvents, mockMessages, mockConversations } from '../data/mockData';

const AppContext = createContext(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState(mockPosts);
  const [events, setEvents] = useState(mockEvents);
  const [messages, setMessages] = useState(mockMessages);
  const [conversations, setConversations] = useState(mockConversations);

  const updatePost = (updatedPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const addPost = (post) => {
    setPosts(prev => [post, ...prev]);
  };

  const addEvent = (event) => {
    setEvents(prev => [...prev, event]);
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const markMessageAsRead = (messageId) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, read: true } : m
    ));
  };

  const approvePost = (postId) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, status: 'approved' } : p
    ));
  };

  const rejectPost = (postId) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, status: 'rejected' } : p
    ));
  };

  const likePost = (postId, userId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const likes = p.likes.includes(userId) 
          ? p.likes.filter(id => id !== userId)
          : [...p.likes, userId];
        return { ...p, likes };
      }
      return p;
    }));
  };

  const addComment = (postId, comment) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...p.comments, comment] };
      }
      return p;
    }));
  };

  return (
    <AppContext.Provider value={{
      posts,
      events,
      messages,
      conversations,
      updatePost,
      addPost,
      addEvent,
      addMessage,
      markMessageAsRead,
      approvePost,
      rejectPost,
      likePost,
      addComment
    }}>
      {children}
    </AppContext.Provider>
  );
};