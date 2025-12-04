import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { mockUsers } from '../data/mockData';
import {
  Home,
  Users as UsersIcon,
  MessageCircle,
  Calendar as CalendarIcon,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const Layout = ({ children, currentPage, onPageChange }) => {
  const { user, logout } = useAuth();
  const { posts, events, messages } = useApp();

  // mobile menu & notifications
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifTab, setNotifTab] = useState('All');

  // global search
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef();

  // close search panel when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (showSearch && searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearch]);

  // notifications data
  const now = new Date();
  const eventReminders = events.filter(e => {
    const d = new Date(e.date);
    const daysAway = (d - now) / (1000 * 60 * 60 * 24);
    return daysAway >= 0 && daysAway <= 3;
  });

  const yourPosts = posts.filter(p => p.authorId === user.id);
  const feedNotifs = yourPosts.flatMap(post => {
    const byName = uid => mockUsers.find(u => u.id === uid)?.firstName || 'Someone';
    const likes = post.likes
      .filter(uid => uid !== user.id)
      .map(uid => ({ id: `like-${post.id}-${uid}`, text: `${byName(uid)} liked your post` }));
    const comments = (post.comments || [])
      .filter(c => c.authorId !== user.id)
      .map(c => ({ id: `c-${c.id}`, text: `${byName(c.authorId)} commented on your post` }));
    return [...likes, ...comments];
  });

  const approvedNotifs = yourPosts
    .filter(p => p.status === 'approved')
    .map(p => ({ id: `app-${p.id}`, text: `Your post was approved` }));

  const unread = messages.filter(m => !m.read && m.receiverId === user.id);
  const messageNotifs = unread.map(m => {
    const from = mockUsers.find(u => u.id === m.senderId)?.firstName || 'Someone';
    return { id: `msg-${m.id}`, text: `New message from ${from}` };
  });

  const allNotifs = [
    ...eventReminders.map(e => ({ id: e.id, text: `Reminder: ${e.title} on ${new Date(e.date).toLocaleDateString()}` })),
    ...feedNotifs,
    ...approvedNotifs,
    ...messageNotifs
  ];

  const notifLists = {
    All: allNotifs,
    Events: allNotifs.slice(0, eventReminders.length),
    Feed: feedNotifs,
    Approvals: approvedNotifs,
    Messages: messageNotifs
  };

  const notifTabs = ['All', 'Events', 'Feed', 'Approvals', 'Messages'];

  // global‐search results
  const q = searchQuery.trim().toLowerCase();
  const eventResults = q
    ? events.filter(e => e.title.toLowerCase().includes(q))
    : [];
  const employeeResults = q
    ? mockUsers.filter(u =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q)
      )
    : [];
  const postResults = q
    ? posts.filter(p => (p.content || '').toLowerCase().includes(q))
    : [];
  const commentResults = q
    ? posts.flatMap(p => p.comments || [])
        .filter(c => (c.text || '').toLowerCase().includes(q))
    : [];

  // main nav
  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: Home },
    { name: 'Feed', id: 'feed', icon: MessageCircle },
    { name: 'Employees', id: 'employees', icon: UsersIcon },
    { name: 'Events', id: 'events', icon: CalendarIcon },
    { name: 'Messages', id: 'messages', icon: MessageCircle, badge: unread.length },
    ...(user.role === 'admin' ? [{ name: 'Admin', id: 'admin', icon: Settings }] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between h-16">

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TalkSpot</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map(item => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${
                    currentPage === item.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-1" />
                  {item.name}
                  {item.badge > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">

              {/* Global Search */}
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => {
                    setShowSearch(v => !v);
                    setSearchQuery('');
                  }}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <Search className="h-5 w-5 text-gray-600" />
                </button>
                {showSearch && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg p-4 z-50">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search everything…"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
                    />

                    <div className="mt-4 space-y-4 max-h-64 overflow-y-auto text-sm text-gray-700">

                      {/* Events */}
                      <div>
                        <h4 className="font-semibold mb-1">Events</h4>
                        {eventResults.length ? (
                          eventResults.map(evt => (
                            <div
                              key={evt.id}
                              onClick={() => {
                                onPageChange('events');
                                setShowSearch(false);
                              }}
                              className="px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                            >
                              {evt.title}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400">No matches</p>
                        )}
                      </div>

                      {/* Employees */}
                      <div>
                        <h4 className="font-semibold mb-1">Employees</h4>
                        {employeeResults.length ? (
                          employeeResults.map(emp => (
                            <div
                              key={emp.id}
                              onClick={() => {
                                onPageChange('employees');
                                setShowSearch(false);
                              }}
                              className="px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                            >
                              {emp.firstName} {emp.lastName}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400">No matches</p>
                        )}
                      </div>

                      {/* Posts */}
                      <div>
                        <h4 className="font-semibold mb-1">Posts</h4>
                        {postResults.length ? (
                          postResults.map(p => (
                            <div
                              key={p.id}
                              onClick={() => {
                                onPageChange('feed');
                                setShowSearch(false);
                              }}
                              className="px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                            >
                              {p.content.slice(0, 60)}…
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400">No matches</p>
                        )}
                      </div>

                      {/* Comments */}
                      <div>
                        <h4 className="font-semibold mb-1">Comments</h4>
                        {commentResults.length ? (
                          commentResults.map(c => (
                            <div
                              key={c.id}
                              onClick={() => {
                                onPageChange('feed');
                                setShowSearch(false);
                              }}
                              className="px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                            >
                              {c.text.slice(0, 60)}…
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400">No matches</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(v => !v)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  {allNotifs.length > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 bg-red-500 text-white text-xs rounded-full">
                      {allNotifs.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
                    {/* Tabs */}
                    <div className="flex justify-around border-b">
                      {notifTabs.map(tab => (
                        <button
                          key={tab}
                          onClick={() => setNotifTab(tab)}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            notifTab === tab
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    {/* List */}
                    <div className="max-h-64 overflow-y-auto p-3 text-sm text-gray-700">
                      {notifLists[notifTab].length ? (
                        notifLists[notifTab].map(n => (
                          <div key={n.id} className="py-1 hover:bg-gray-100 rounded">
                            {n.text}
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-400">No notifications</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile & Logout */}
              <div className="flex items-center space-x-2">
                <img
                  src={user.avatar}
                  alt={user.firstName}
                  className="h-8 w-8 rounded-full object-cover"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
                />
                <span className="hidden sm:block text-sm font-medium text-gray-900">
                  {user.firstName}
                </span>
                <button
                  onClick={logout}
                  className="p-2 rounded-md hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 text-gray-600" />
                </button>
                {/* Mobile menu toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(v => !v)}
                  className="md:hidden p-2 rounded-md hover:bg-gray-100"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5 text-gray-600" />
                  ) : (
                    <Menu className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Nav */}
            {isMobileMenuOpen && (
              <div className="md:hidden bg-white border-t">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navigation.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onPageChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-2 text-base font-medium rounded-md ${
                        currentPage === item.id
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      {item.name}
                      {item.badge > 0 && (
                        <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
