import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { mockUsers } from '../data/mockData';
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { posts, events, messages } = useApp();

  const approvedPosts   = posts.filter(p => p.status === 'approved');
  const pendingPosts    = posts.filter(p => p.status === 'pending');
  const upcomingEvents  = events.filter(e => new Date(e.date) > new Date());
  const unreadMessages  = messages.filter(m => !m.read && m.receiverId === user?.id);

  const stats = [
    {
      name: 'Total Employees',
      value: mockUsers.length,
      icon: Users,
      color: 'bg-orange-400'
    },
    {
      name: 'Active Posts',
      value: approvedPosts.length,
      icon: MessageCircle,
      color: 'bg-purple-500'      // purple stays
    },
    {
      name: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      name: 'Unread Messages',
      value: unreadMessages.length,
      icon: TrendingUp,
      color: 'bg-yellow-300'      // peach stays
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-100 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-[#ffffffcc]">
          Here's what's happening in your organization today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div
            key={stat.name}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {approvedPosts.slice(0, 3).map(post => {
                const author = mockUsers.find(u => u.id === post.authorId);
                return (
                  <div key={post.id} className="flex items-start space-x-3">
                    <img
                      src={author?.avatar}
                      alt={author?.firstName}
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">
                          {author?.firstName} {author?.lastName}
                        </span>{' '}
                        posted a new update
                      </p>
                      <p className="text-sm text-gray-500 truncate">{post.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map(event => (
                <div key={event.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.description}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Quick Actions */}
      {user?.role === 'admin' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Admin Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-900">Pending Posts</span>
                </div>
                <span className="text-lg font-bold text-yellow-900">{pendingPosts.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-100 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-700">Approved Posts</span>
                </div>
                <span className="text-lg font-bold text-green-700">{approvedPosts.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
