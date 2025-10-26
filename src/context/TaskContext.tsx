import React, { createContext, useContext, useState, useEffect } from 'react';

export type Task = {
  id: string;
  name: string;
  priority: number;
  category: 'red' | 'blue' | 'green' | 'purple' | 'orange';
  deadline: string;
  estimatedTime: number;
  createdAt: string;
  bookmarked: boolean;
  completed: boolean;
  completedAt?: string;
  isCollaborative?: boolean;
  collaborators?: string[];
  sharedBy?: string;
  permissions?: 'responsible' | 'editor' | 'observer';
};

export type TaskList = {
  id: string;
  name: string;
  taskIds: string[];
  color: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  notes?: string;
  taskId: string;
};

export type ColorSettings = {
  red: string;
  blue: string;
  green: string;
  purple: string;
  orange: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  premiumTokens: number;
  premiumWinStreak: number;
  lastTokenConsumption: string;
  subscriptionEndDate?: string;
  autoValidation: boolean;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
};

export type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
};

export type Habit = {
  id: string;
  name: string;
  estimatedTime: number;
  completions: { [date: string]: boolean };
  streak: number;
  color: string;
};

export type OKR = {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  keyResults: KeyResult[];
  completed: boolean;
  estimatedTime: number;
};

export type KeyResult = {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  completed: boolean;
  estimatedTime: number;
};

type TaskContextType = {
  // Données existantes
  tasks: Task[];
  lists: TaskList[];
  events: CalendarEvent[];
  colorSettings: ColorSettings;
  
  // Nouvelles données
  user: User | null;
  messages: Message[];
  friendRequests: FriendRequest[];
  habits: Habit[];
  okrs: OKR[];
  friends: User[];
  
  // Actions existantes
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleBookmark: (id: string) => void;
  toggleComplete: (id: string) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  addList: (list: TaskList) => void;
  addTaskToList: (taskId: string, listId: string) => void;
  removeTaskFromList: (taskId: string, listId: string) => void;
  deleteList: (listId: string) => void;
  updateList: (listId: string, updates: Partial<TaskList>) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  updateColorSettings: (colors: ColorSettings) => void;
  
  // Nouvelles actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  watchAd: () => void;
  consumePremiumToken: () => void;
  isPremium: () => boolean;
  sendMessage: (receiverId: string, content: string) => void;
  sendFriendRequest: (receiverId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  shareTask: (taskId: string, userId: string, permission: 'responsible' | 'editor' | 'observer') => void;
  addHabit: (habit: Habit) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;
  addOKR: (okr: OKR) => void;
  updateOKR: (id: string, updates: Partial<OKR>) => void;
  updateKeyResult: (okrId: string, keyResultId: string, updates: Partial<KeyResult>) => void;
  updateUserSettings: (updates: Partial<User>) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Données initiales
const initialTasks: Task[] = [
  {
    id: '1',
    name: 'finir onbpaa 1',
    priority: 5,
    category: 'blue',
    deadline: '2025-06-13T00:00:00.000Z',
    estimatedTime: 30,
    createdAt: '2025-05-29T00:00:00.000Z',
    bookmarked: false,
    completed: false,
  },
  {
    id: '2',
    name: 'Ficher ONBPAA 2',
    priority: 4,
    category: 'blue',
    deadline: '2025-06-13T00:00:00.000Z',
    estimatedTime: 60,
    createdAt: '2025-05-29T00:00:00.000Z',
    bookmarked: false,
    completed: false,
  },
  {
    id: '3',
    name: 'Réviser LM',
    priority: 2,
    category: 'red',
    deadline: '2025-06-13T00:00:00.000Z',
    estimatedTime: 10,
    createdAt: '2025-05-29T00:00:00.000Z',
    bookmarked: false,
    completed: false,
  },
  {
    id: '4',
    name: 'Tâche collaborative - Projet équipe',
    priority: 1,
    category: 'green',
    deadline: '2025-06-20T00:00:00.000Z',
    estimatedTime: 120,
    createdAt: '2025-05-30T00:00:00.000Z',
    bookmarked: true,
    completed: false,
    isCollaborative: true,
    collaborators: ['user2', 'user3'],
    sharedBy: 'user2',
    permissions: 'editor',
  },
];

const initialLists: TaskList[] = [
  {
    id: 'jeudi',
    name: 'Jeudi',
    taskIds: [],
    color: 'blue'
  },
  {
    id: 'vendredi',
    name: 'Vendredi',
    taskIds: [],
    color: 'red'
  },
];

const defaultColorSettings: ColorSettings = {
  red: 'Réviser textes',
  blue: 'Texte à fichées',
  green: 'Apprendre textes',
  purple: 'Autres taches',
  orange: 'Entrainement dissert',
};

const defaultUser: User = {
  id: 'user1',
  name: 'Utilisateur Demo',
  email: 'demo@cosmo.app',
  premiumTokens: 3,
  premiumWinStreak: 5,
  lastTokenConsumption: new Date().toISOString(),
  autoValidation: false,
};

const initialHabits: Habit[] = [
  {
    id: '1',
    name: 'Lire 30 minutes',
    estimatedTime: 30,
    completions: {
      '2025-01-15': true,
      '2025-01-14': true,
      '2025-01-13': false,
    },
    streak: 2,
    color: 'blue',
  },
  {
    id: '2',
    name: 'Exercice physique',
    estimatedTime: 60,
    completions: {
      '2025-01-15': true,
      '2025-01-14': false,
    },
    streak: 1,
    color: 'green',
  },
];

const initialOKRs: OKR[] = [
  {
    id: '1',
    title: 'Améliorer mes compétences en français',
    description: 'Développer une maîtrise approfondie de la littérature française',
    category: 'learning',
    startDate: '2025-01-01',
    endDate: '2025-06-30',
    completed: false,
    estimatedTime: 180,
    keyResults: [
      {
        id: '1-1',
        title: 'Ficher 20 textes littéraires',
        currentValue: 8,
        targetValue: 20,
        unit: 'textes',
        completed: false,
        estimatedTime: 60,
      },
      {
        id: '1-2',
        title: 'Réviser 15 textes par semaine',
        currentValue: 12,
        targetValue: 15,
        unit: 'textes/semaine',
        completed: false,
        estimatedTime: 90,
      },
    ],
  },
];

const initialFriends: User[] = [
  {
    id: 'friend1',
    name: 'Alice Martin',
    email: 'alice@example.com',
    premiumTokens: 2,
    premiumWinStreak: 3,
    lastTokenConsumption: new Date().toISOString(),
    autoValidation: true,
  },
  {
    id: 'friend2',
    name: 'Bob Dupont',
    email: 'bob@example.com',
    premiumTokens: 1,
    premiumWinStreak: 1,
    lastTokenConsumption: new Date().toISOString(),
    autoValidation: false,
  },
  {
    id: 'friend3',
    name: 'Claire Moreau',
    email: 'claire@example.com',
    premiumTokens: 5,
    premiumWinStreak: 10,
    lastTokenConsumption: new Date().toISOString(),
    autoValidation: true,
  },
  {
    id: 'friend4',
    name: 'David Leroy',
    email: 'david@example.com',
    premiumTokens: 0,
    premiumWinStreak: 0,
    lastTokenConsumption: new Date().toISOString(),
    autoValidation: false,
  },
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [lists, setLists] = useState<TaskList[]>(initialLists);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [colorSettings, setColorSettings] = useState<ColorSettings>(defaultColorSettings);
  const [user, setUser] = useState<User | null>(defaultUser);
  const [messages, setMessages] = useState<Message[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [okrs, setOkrs] = useState<OKR[]>(initialOKRs);
  const [friends, setFriends] = useState<User[]>(initialFriends);

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedLists = localStorage.getItem('taskLists');
    const savedEvents = localStorage.getItem('events');
    const savedColorSettings = localStorage.getItem('colorSettings');
    const savedUser = localStorage.getItem('user');
    const savedHabits = localStorage.getItem('habits');
    const savedOKRs = localStorage.getItem('okrs');
    const savedFriends = localStorage.getItem('friends');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedLists) setLists(JSON.parse(savedLists));
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    if (savedColorSettings) setColorSettings(JSON.parse(savedColorSettings));
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedOKRs) setOkrs(JSON.parse(savedOKRs));
    if (savedFriends) setFriends(JSON.parse(savedFriends));
  }, []);

  // Sauvegarder les données dans localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('taskLists', JSON.stringify(lists));
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('colorSettings', JSON.stringify(colorSettings));
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('okrs', JSON.stringify(okrs));
    localStorage.setItem('friends', JSON.stringify(friends));
    if (user) localStorage.setItem('user', JSON.stringify(user));
  }, [tasks, lists, events, colorSettings, user, habits, okrs, friends]);

  // Consommation automatique des jetons Premium
  useEffect(() => {
    if (!user) return;

    const checkTokenConsumption = () => {
      const now = new Date();
      const lastConsumption = new Date(user.lastTokenConsumption);
      const daysDiff = Math.floor((now.getTime() - lastConsumption.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff >= 1 && user.premiumTokens > 0) {
        consumePremiumToken();
      }
    };

    const interval = setInterval(checkTokenConsumption, 60000); // Vérifier chaque minute
    return () => clearInterval(interval);
  }, [user]);

  // Actions existantes
  const addTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task]);
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    setLists(prevLists => 
      prevLists.map(list => ({
        ...list,
        taskIds: list.taskIds.filter(taskId => taskId !== id)
      }))
    );
  };

  const toggleBookmark = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, bookmarked: !task.bookmarked } : task
      )
    );
  };

  const toggleComplete = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === id) {
          const isCompleting = !task.completed;
          return { 
            ...task, 
            completed: isCompleting,
            completedAt: isCompleting ? new Date().toISOString() : undefined
          };
        }
        return task;
      })
    );
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const addList = (list: TaskList) => {
    setLists(prevLists => [...prevLists, list]);
  };

  const updateList = (listId: string, updates: Partial<TaskList>) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId ? { ...list, ...updates } : list
      )
    );
  };

  const addTaskToList = (taskId: string, listId: string) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId && !list.taskIds.includes(taskId)
          ? { ...list, taskIds: [...list.taskIds, taskId] }
          : list
      )
    );
  };

  const removeTaskFromList = (taskId: string, listId: string) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? { ...list, taskIds: list.taskIds.filter(id => id !== taskId) }
          : list
      )
    );
  };

  const deleteList = (listId: string) => {
    setLists(prevLists => prevLists.filter(list => list.id !== listId));
  };

  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };

  const deleteEvent = (id: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id ? { ...event, ...updates } : event
      )
    );
  };

  const updateColorSettings = (colors: ColorSettings) => {
    setColorSettings(colors);
  };

  // Nouvelles actions
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulation d'une connexion
    if (email === 'demo@cosmo.app' && password === 'demo') {
      setUser(defaultUser);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulation d'une inscription
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      premiumTokens: 1, // Jeton de bienvenue
      premiumWinStreak: 0,
      lastTokenConsumption: new Date().toISOString(),
      autoValidation: false,
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const watchAd = () => {
    if (!user) return;
    
    // Simulation de regarder une pub
    setUser(prev => prev ? {
      ...prev,
      premiumTokens: prev.premiumTokens + 1,
      premiumWinStreak: isPremium() ? prev.premiumWinStreak + 1 : 1,
    } : null);
  };

  const consumePremiumToken = () => {
    if (!user || user.premiumTokens <= 0) return;
    
    setUser(prev => prev ? {
      ...prev,
      premiumTokens: prev.premiumTokens - 1,
      lastTokenConsumption: new Date().toISOString(),
      premiumWinStreak: prev.premiumTokens > 1 ? prev.premiumWinStreak + 1 : 0,
    } : null);
  };

  const isPremium = (): boolean => {
    if (!user) return false;
    
    // Vérifier l'abonnement
    if (user.subscriptionEndDate) {
      const now = new Date();
      const endDate = new Date(user.subscriptionEndDate);
      if (now <= endDate) return true;
    }
    
    // Vérifier les jetons
    return user.premiumTokens > 0;
  };

  const sendMessage = (receiverId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendFriendRequest = (receiverId: string) => {
    const newRequest: FriendRequest = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      receiverId,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    setFriendRequests(prev => [...prev, newRequest]);
  };

  const acceptFriendRequest = (requestId: string) => {
    setFriendRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'accepted' as const } : req
      )
    );
  };

  const rejectFriendRequest = (requestId: string) => {
    setFriendRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      )
    );
  };

  const shareTask = (taskId: string, userId: string, permission: 'responsible' | 'editor' | 'observer') => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? {
          ...task,
          isCollaborative: true,
          collaborators: [...(task.collaborators || []), userId],
          permissions: permission,
        } : task
      )
    );
  };

  const addHabit = (habit: Habit) => {
    setHabits(prev => [...prev, habit]);
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(prev => 
      prev.map(habit => {
        if (habit.id === habitId) {
          const newCompletions = {
            ...habit.completions,
            [date]: !habit.completions[date],
          };
          
          // Recalculer le streak
          let streak = 0;
          const today = new Date();
          for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];
            
            if (newCompletions[dateStr]) {
              streak++;
            } else {
              break;
            }
          }
          
          return {
            ...habit,
            completions: newCompletions,
            streak,
          };
        }
        return habit;
      })
    );
  };

  const updateHabit = (habitId: string, updates: Partial<Habit>) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId ? { ...habit, ...updates } : habit
      )
    );
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  };

  const addOKR = (okr: OKR) => {
    setOkrs(prev => [...prev, okr]);
  };

  const updateOKR = (id: string, updates: Partial<OKR>) => {
    setOkrs(prev => 
      prev.map(okr => 
        okr.id === id ? { ...okr, ...updates } : okr
      )
    );
  };

  const updateKeyResult = (okrId: string, keyResultId: string, updates: Partial<KeyResult>) => {
    setOkrs(prev => 
      prev.map(okr => {
        if (okr.id === okrId) {
          return {
            ...okr,
            keyResults: okr.keyResults.map(kr => 
              kr.id === keyResultId ? { ...kr, ...updates } : kr
            ),
          };
        }
        return okr;
      })
    );
  };

  const updateUserSettings = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const contextValue = {
    // Données existantes
    tasks, 
    lists,
    events,
    colorSettings,
    
    // Nouvelles données
    user,
    messages,
    friendRequests,
    habits,
    okrs,
    friends,
    
    // Actions existantes
    addTask, 
    deleteTask, 
    toggleBookmark,
    toggleComplete,
    updateTask,
    addList,
    addTaskToList,
    removeTaskFromList,
    deleteList,
    updateList,
    addEvent,
    deleteEvent,
    updateEvent,
    updateColorSettings,
    
    // Nouvelles actions
    login,
    register,
    logout,
    watchAd,
    consumePremiumToken,
    isPremium,
    sendMessage,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    shareTask,
    addHabit,
    toggleHabitCompletion,
    updateHabit,
    deleteHabit,
    addOKR,
    updateOKR,
    updateKeyResult,
    updateUserSettings,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};