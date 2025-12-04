export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  birthDate: string;
  avatar: string;
  address?: string;
  role: 'admin' | 'employee';
  isActive: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  image?: string;
  link?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  likes: string[];
  comments: Comment[];
  type: 'post' | 'announcement';
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  likes: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  type: 'meeting' | 'birthday' | 'company' | 'training';
  attendees: string[];
  reminderDays: number;
  createdBy: string;
  attachments?: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}