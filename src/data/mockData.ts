import { User, Contact, Interaction, Task } from '../types';

export const mockData = {
  user: {
    userId: 'user_1',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date('2024-01-01')
  } as User,

  contacts: [
    {
      contactId: 'contact_1',
      userId: 'user_1',
      name: 'Sarah Johnson',
      email: 'sarah@techcorp.com',
      phone: '+1-555-0123',
      company: 'TechCorp Inc.',
      tags: ['lead', 'enterprise'],
      createdAt: new Date('2024-01-15'),
      lastInteraction: new Date('2024-12-20'),
      totalInteractions: 5
    },
    {
      contactId: 'contact_2',
      userId: 'user_1',
      name: 'Mike Chen',
      email: 'mike@startup.io',
      phone: '+1-555-0456',
      company: 'Startup.io',
      tags: ['client', 'startup'],
      createdAt: new Date('2024-02-01'),
      lastInteraction: new Date('2024-12-18'),
      totalInteractions: 8
    },
    {
      contactId: 'contact_3',
      userId: 'user_1',
      name: 'Emily Davis',
      email: 'emily@consultancy.com',
      phone: '+1-555-0789',
      company: 'Davis Consultancy',
      tags: ['partner', 'consulting'],
      createdAt: new Date('2024-03-10'),
      lastInteraction: new Date('2024-12-15'),
      totalInteractions: 3
    }
  ] as Contact[],

  interactions: [
    {
      interactionId: 'int_1',
      contactId: 'contact_1',
      userId: 'user_1',
      type: 'call' as const,
      dateTime: new Date('2024-12-20'),
      notes: 'Discussed Q1 project requirements and timeline. Very interested in our services.',
      followUpRequired: true,
      createdAt: new Date('2024-12-20')
    },
    {
      interactionId: 'int_2',
      contactId: 'contact_2',
      userId: 'user_1',
      type: 'email' as const,
      dateTime: new Date('2024-12-18'),
      notes: 'Sent proposal for development work. Awaiting feedback.',
      followUpRequired: true,
      createdAt: new Date('2024-12-18')
    },
    {
      interactionId: 'int_3',
      contactId: 'contact_3',
      userId: 'user_1',
      type: 'meeting' as const,
      dateTime: new Date('2024-12-15'),
      notes: 'In-person meeting to discuss partnership opportunities.',
      followUpRequired: false,
      createdAt: new Date('2024-12-15')
    }
  ] as Interaction[],

  tasks: [
    {
      taskId: 'task_1',
      userId: 'user_1',
      contactId: 'contact_1',
      description: 'Follow up on Q1 project discussion',
      dueDate: new Date('2024-12-25'),
      completed: false,
      createdAt: new Date('2024-12-20'),
      priority: 'high' as const
    },
    {
      taskId: 'task_2',
      userId: 'user_1',
      contactId: 'contact_2',
      description: 'Send revised proposal based on feedback',
      dueDate: new Date('2024-12-23'),
      completed: false,
      createdAt: new Date('2024-12-18'),
      priority: 'medium' as const
    },
    {
      taskId: 'task_3',
      userId: 'user_1',
      description: 'Review and update CRM documentation',
      dueDate: new Date('2024-12-30'),
      completed: false,
      createdAt: new Date('2024-12-15'),
      priority: 'low' as const
    }
  ] as Task[]
};