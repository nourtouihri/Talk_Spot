import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  X,
  Cake,
  Briefcase,
  GraduationCap
} from 'lucide-react';

const Events = () => {
  const { user } = useAuth();
  const { events, addEvent } = useApp();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'meeting',
    reminderDays: 1,
    imageFile: null,
    imagePreview: ''
  });

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newEvent = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      type: formData.type,
      reminderDays: formData.reminderDays,
      image: formData.imagePreview,
      attendees: [],
      createdBy: user.id
    };
    addEvent(newEvent);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: 'meeting',
      reminderDays: 1,
      imageFile: null,
      imagePreview: ''
    });
    setShowCreateForm(false);
  };

  const getEventTypeColor = type => {
    switch (type) {
      case 'meeting':   return 'bg-green-100 text-green-800';
      case 'training':  return 'bg-purple-100 text-purple-800';
      case 'company':   return 'bg-blue-100 text-blue-900';
      case 'birthday':  return 'bg-pink-100 text-pink-800';
      default:          return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = type => {
    switch (type) {
      case 'meeting':
        return <Users className="h-4 w-4 mr-1 text-green-600" />;
      case 'training':
        return <GraduationCap className="h-4 w-4 mr-1 text-purple-600" />;
      case 'company':
        return <Briefcase className="h-4 w-4 mr-1 text-blue-600" />;
      case 'birthday':
        return <Cake className="h-4 w-4 mr-1 text-pink-600" />;
      default:
        return null;
    }
  };

  const selectedEventData = events.find(e => e.id === selectedEvent);

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Events Calendar</h2>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Event</span>
            </button>
          )}
        </div>

        {/* Events Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md cursor-pointer transition-shadow"
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={`${event.title} cover`}
                    className="mb-4 h-32 w-full object-cover rounded"
                  />
                )}

                <div className="flex items-center mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(
                      event.type
                    )}`}
                  >
                    {getEventTypeIcon(event.type)}
                    {event.type}
                  </span>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {event.attendees.length} attendees
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Create New Event
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-300"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-300"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={e =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-300"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-300"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {formData.imagePreview && (
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="mt-2 h-32 w-full object-cover rounded-lg border"
                  />
                )}
              </div>

              {/* Type & Reminder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={e =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-300"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="training">Training</option>
                    <option value="company">Company Event</option>
                    <option value="birthday">Birthday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reminder (Days Before)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.reminderDays}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        reminderDays: parseInt(e.target.value, 10)
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-300"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border-transparent rounded-md hover:bg-green-700"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEventData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Event Details
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedEventData.image && (
                <img
                  src={selectedEventData.image}
                  alt={selectedEventData.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <div className="flex items-center mb-2">
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getEventTypeColor(
                    selectedEventData.type
                  )}`}
                >
                  {getEventTypeIcon(selectedEventData.type)}
                  {selectedEventData.type}
                </span>
              </div>

              <h4 className="text-2xl font-bold text-gray-900">
                {selectedEventData.title}
              </h4>
              <p className="text-gray-600 mb-4">
                {selectedEventData.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(
                          selectedEventData.date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Time</p>
                      <p className="text-sm text-gray-600">
                        {selectedEventData.time}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedEventData.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Location
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedEventData.location}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Attendees
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedEventData.attendees.length} people attending
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
