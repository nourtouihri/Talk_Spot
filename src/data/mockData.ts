import { User, Post, Event, Message, Conversation } from '../types';



const admminAvatar = '/assets/admin.png';
const nour = '/assets/nour.jpg';
const chifa = '/assets/chifa.jpeg';
const elon = '/assets/elon.jpg'; 



export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@company.com',
    phone: '+1234567890',
    position: 'System Administrator',
    department: 'IT',
    hireDate: '2020-01-15',
    birthDate: '1985-03-20',
    avatar: admminAvatar,
    role: 'admin',
    isActive: true
  },
  {
    id: '2',
    firstName: 'nour',
    lastName: 'touihri',
    email: 'nourtouihri@ieee.org',
    phone: '+1234567891',
    position: 'Marketing Manager',
    department: 'Marketing',
    hireDate: '2021-06-10',
    birthDate: '1990-07-15',
    avatar: nour,
    role: 'employee',
    isActive: true
  },
  {
    id: '3',
    firstName: 'Chifa',
    lastName: 'Guesmi',
    email: 'chifaguesmi@ieee.org',
    phone: '+1234567892',
    position: 'Software Developer',
    department: 'Engineering',
    hireDate: '2022-03-01',
    birthDate: '1988-11-30',
    avatar: chifa,
    role: 'employee',
    isActive: true
  },
  {
    id: '4',
    firstName: 'Mohamed',
    lastName: 'Jaouadi',
    email: 'mohamedjaouadi@company.com',
    phone: '+1234567893',
    position: 'HR Specialist',
    department: 'Human Resources',
    hireDate: '2021-09-20',
    birthDate: '1992-05-08',
    avatar: elon,
    role: 'employee',
    isActive: true
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    authorId: '1',
    content: 'Welcome to TalkSpot! We are excited to launch our new internal platform to enhance communication and collaboration across our organization.',
    status: 'approved',
    createdAt: '2024-01-15T10:00:00Z',
    likes: ['2', '3', '4'],
    comments: [
      {
        id: '1',
        authorId: '2',
        content: 'This looks amazing! Can\'t wait to explore all the features.',
        createdAt: '2024-01-15T10:30:00Z',
        likes: ['1', '3']
      }
    ],
    type: 'announcement'
  },
  {
    id: '2',
    authorId: '2',
    content: 'Just finished presenting our Q1 marketing strategy. Exciting times ahead for our product launches!',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    status: 'approved',
    createdAt: '2024-01-14T15:30:00Z',
    likes: ['1', '3'],
    comments: [],
    type: 'post'
  },
  {
    id: '3',
    authorId: '3',
    content: 'Working on some exciting new features for our platform. Stay tuned for updates!',
    status: 'pending',
    createdAt: '2024-01-14T09:15:00Z',
    likes: [],
    comments: [],
    type: 'post'
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Team All-Hands Meeting',
    description: 'Monthly team meeting to discuss progress and upcoming projects',
    date: '2024-01-25',
    time: '14:00',
    location: 'Conference Room A',
    type: 'meeting',
    attendees: ['1', '2', '3', '4'],
    reminderDays: 2,
    createdBy: '1'
  },
  {
    id: '2',
    title: 'Chifa\'s Birthday',
    description: 'Celebrating Chifa\'s birthday!',
    date: '2024-01-20',
    time: '12:00',
    location: 'Break Room',
    type: 'birthday',
    attendees: ['1', '2', '3', '4'],
    reminderDays: 1,
    createdBy: '1'
  },
  {
    id: '3',
    title: 'Product Launch Training',
    description: 'Training session for the new product launch',
    date: '2024-01-30',
    time: '10:00',
    location: 'Training Room',
    type: 'training',
    attendees: ['2', '3'],
    reminderDays: 3,
    createdBy: '1'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    content: 'Hi Admin, I have a question about the new policy updates.',
    timestamp: '2024-01-15T09:30:00Z',
    read: false
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    content: 'Sure, I\'d be happy to help! What specific policy are you asking about?',
    timestamp: '2024-01-15T09:45:00Z',
    read: true
  },
  {
    id: '3',
    senderId: '3',
    receiverId: '1',
    content: 'The new feature deployment is ready for review.',
    timestamp: '2024-01-15T11:00:00Z',
    read: false
  }
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: ['1', '2'],
    lastMessage: mockMessages[1],
    unreadCount: 1
  },
  {
    id: '2',
    participants: ['1', '3'],
    lastMessage: mockMessages[2],
    unreadCount: 1
  }
];