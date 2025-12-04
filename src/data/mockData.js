import adminAvatar from '../assets/admin.jpg';
import nour from '../assets/nour.jpg';
import chifa from '../assets/chifa.jpeg';
import maram from '../assets/maram.jpg';
import yasser from '../assets/yasser.jpg';
import elon from '../assets/elon.png';
export const mockUsers = [
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
    avatar: adminAvatar,
    role: 'admin',
    isActive: true
  },
  {
    id: '2',
    firstName: 'Nour',
    lastName: 'Touihri',
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
    firstName: 'chifa',
    lastName: 'Guesmi',
    email: 'Chifaguesmi@ieee.org',
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
    firstName: 'Med ',
    lastName: 'Jaouadi',
    email: 'medSalem.jaouadi@company.com',
    phone: '+1234567893',
    position: 'Full Stack Developer',
    department: 'Engineering',
    hireDate: '2021-09-20',
    birthDate: '1992-05-08',
    avatar: elon,
    role: 'employee',
    isActive: true
  },
  {
    id: '5',
    firstName: 'yasser',
    lastName: 'bdioui',
    email: 'yasser.bdioui@company.com',
    phone: '+1234567894',
    position: 'Sales Director',
    department: 'Sales',
    hireDate: '2020-08-15',
    birthDate: '1987-12-03',
    avatar: yasser,
    role: 'employee',
    isActive: true
  },
  {
    id: '6',
    firstName: 'Maram',
    lastName: 'namouchi',
    email: 'Maram.namouchi@company.com',
    phone: '+1234567895',
    position: 'UX Designer',
    department: 'Design',
    hireDate: '2022-01-20',
    birthDate: '1991-04-18',
    avatar: maram ,
    role: 'employee',
    isActive: true
  }
];

export const mockPosts = [
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
  },
  {
    id: '4',
    authorId: '5',
    content: 'Great team meeting today! Looking forward to implementing our new sales strategies.',
    status: 'approved',
    createdAt: '2024-01-13T16:45:00Z',
    likes: ['1', '2', '4'],
    comments: [
      {
        id: '2',
        authorId: '4',
        content: 'The new strategies sound promising! Let me know if you need any HR support.',
        createdAt: '2024-01-13T17:00:00Z',
        likes: ['5']
      }
    ],
    type: 'post'
  }
];

export const mockEvents = [
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
    title: 'Yasmine\'s Birthday',
    description: 'Celebrating Yasmine\'s birthday!',
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
  },
  {
    id: '4',
    title: 'Quarterly Review',
    description: 'Q4 performance review and planning for Q1',
    date: '2024-02-05',
    time: '09:00',
    location: 'Main Conference Room',
    type: 'meeting',
    attendees: ['1', '2', '3', '4', '5', '6'],
    reminderDays: 5,
    createdBy: '1'
  }
];

export const mockMessages = [
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
  },
  {
    id: '4',
    senderId: '5',
    receiverId: '2',
    content: 'Great presentation today! The marketing strategy looks solid.',
    timestamp: '2024-01-14T16:00:00Z',
    read: true
  },
  {
    id: '5',
    senderId: '2',
    receiverId: '5',
    content: 'Thank you! I\'m excited to see how it performs in Q1.',
    timestamp: '2024-01-14T16:15:00Z',
    read: true
  }
];

export const mockConversations = [
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
  },
  {
    id: '3',
    participants: ['2', '5'],
    lastMessage: mockMessages[4],
    unreadCount: 0
  }
];