import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { mockUsers } from '../data/mockData';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Users,
  MessageSquare,
  Calendar,
  Settings,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const { posts, approvePost, rejectPost } = useApp();
  const [activeTab, setActiveTab] = useState('posts');

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900">Access Denied</p>
        <p className="text-sm text-gray-500">You don't have permission to view this page.</p>
      </div>
    );
  }

  const pendingPosts = posts.filter(p => p.status === 'pending');
  const approvedPosts = posts.filter(p => p.status === 'approved');
  const rejectedPosts = posts.filter(p => p.status === 'rejected');

  const tabs = [
    { id: 'posts', name: 'Post Moderation', icon: MessageSquare, count: pendingPosts.length },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const handleApprovePost = (postId) => {
    approvePost(postId);
  };

  const handleRejectPost = (postId) => {
    rejectPost(postId);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                  {tab.count && tab.count > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'posts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-yellow-900">Pending Review</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900 mt-2">{pendingPosts.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-900">Approved</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 mt-2">{approvedPosts.length}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-900">Rejected</span>
                  </div>
                  <p className="text-2xl font-bold text-red-900 mt-2">{rejectedPosts.length}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Posts Pending Review</h3>
                {pendingPosts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No posts pending review</p>
                ) : (
                  pendingPosts.map((post) => {
                    const author = mockUsers.find(u => u.id === post.authorId);
                    return (
                      <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <img
                            src={author?.avatar}
                            alt={author?.firstName}
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-gray-900">
                                {author?.firstName} {author?.lastName}
                              </span>
                              <span className="text-sm text-gray-500">
                                {author?.position}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{post.content}</p>
                            {post.image && (
                              <img
                                src={post.image}
                                alt="Post content"
                                className="w-full max-w-md h-48 object-cover rounded-lg mb-3"
                              />
                            )}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleApprovePost(post.id)}
                                className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 flex items-center space-x-1"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleRejectPost(post.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 flex items-center space-x-1"
                              >
                                <XCircle className="h-4 w-4" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Platform Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-900">Total Users</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 mt-2">{mockUsers.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-900">Total Posts</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 mt-2">{posts.length}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-sm font-medium text-purple-900">Active Events</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900 mt-2">4</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-orange-600 mr-2" />
                    <span className="text-sm font-medium text-orange-900">Engagement</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-900 mt-2">87%</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Platform Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Auto-approve admin posts</p>
                    <p className="text-sm text-gray-500">Posts from admins are automatically approved</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Email notifications</p>
                    <p className="text-sm text-gray-500">Send email notifications for new posts</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Birthday reminders</p>
                    <p className="text-sm text-gray-500">Automatically create birthday events</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;