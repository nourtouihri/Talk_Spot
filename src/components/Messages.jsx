import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { mockUsers } from '../data/mockData';
import { 
  Search, 
  Send, 
  MoreHorizontal,
  Circle,
  User
} from 'lucide-react';

const Messages = () => {
  const { user } = useAuth();
  const { messages, addMessage, markMessageAsRead } = useApp();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Get conversations for current user
  const userConversations = mockUsers
    .filter(u => u.id !== user?.id)
    .map(otherUser => {
      const conversationMessages = messages.filter(m => 
        (m.senderId === user?.id && m.receiverId === otherUser.id) ||
        (m.senderId === otherUser.id && m.receiverId === user?.id)
      );
      
      const lastMessage = conversationMessages[conversationMessages.length - 1];
      const unreadCount = conversationMessages.filter(m => 
        m.receiverId === user?.id && !m.read
      ).length;

      return {
        id: otherUser.id,
        user: otherUser,
        messages: conversationMessages,
        lastMessage,
        unreadCount
      };
    })
    .filter(conv => conv.lastMessage || conv.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()));

  const selectedConversationData = selectedConversation 
    ? userConversations.find(c => c.id === selectedConversation)
    : null;

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: selectedConversation,
      content: messageText,
      timestamp: new Date().toISOString(),
      read: false
    };

    addMessage(newMessage);
    setMessageText('');
  };

  const handleSelectConversation = (conversationId) => {
    setSelectedConversation(conversationId);
    
    // Mark messages as read
    const conversation = userConversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.messages
        .filter(m => m.receiverId === user?.id && !m.read)
        .forEach(m => markMessageAsRead(m.id));
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] bg-white rounded-lg shadow-sm border border-gray-200 flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-300"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {userConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                selectedConversation === conversation.id ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={conversation.user.avatar}
                    alt={conversation.user.firstName}
                    className="h-10 w-10 rounded-full"
                  />
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {conversation.user.firstName} {conversation.user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{conversation.user.position}</p>
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  {conversation.lastMessage && (
                    <p className="text-xs text-gray-400">
                      {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                  {conversation.unreadCount > 0 && (
                    <Circle className="h-2 w-2 text-green-300 fill-current mt-1" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversationData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedConversationData.user.avatar}
                    alt={selectedConversationData.user.firstName}
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedConversationData.user.firstName} {selectedConversationData.user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{selectedConversationData.user.position}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversationData.messages.map((message) => {
                const isOwnMessage = message.senderId === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-green-400 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-300"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="bg-green-300 text-white px-4 py-2 rounded-md hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">Select a conversation</p>
              <p className="text-sm text-gray-500">Choose a colleague to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
