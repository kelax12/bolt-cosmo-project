import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { toast } from 'sonner';

export type Task = {
  id: string;
  name: string;
  priority: number;
  category: string;
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
  collaboratorValidations?: { [key: string]: boolean };
  pendingInvites?: string[];
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
  [key: string]: string;
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
  taskId?: string;
};

export type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
  sender?: User;
};

export type Habit = {
  id: string;
  name: string;
  estimatedTime: number;
  completions: { [date: string]: boolean };
  streak: number;
  color: string;
  createdAt: string;
};

export type OKRCategory = {
  id: string;
  name: string;
  color: string;
  icon: string;
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
  history?: { date: string, increment: number }[];
};

export type Category = {
  id: string;
  name: string;
  color: string;
};

type TaskContextType = {
  tasks: Task[];
  lists: TaskList[];
  events: CalendarEvent[];
  colorSettings: ColorSettings;
  categories: Category[];
  priorityRange: [number, number];
  searchTerm: string;
  selectedCategories: string[];
  user: User | null;
  loading: boolean;
  messages: Message[];
  friendRequests: FriendRequest[];
  habits: Habit[];
  okrs: OKR[];
  okrCategories: OKRCategory[];
  friends: User[];
  favoriteColors: string[];
  setFavoriteColors: (colors: string[]) => void;
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
  setPriorityRange: (range: [number, number]) => void;
  setSearchTerm: (term: string) => void;
    setSelectedCategories: (categories: string[]) => void;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
    watchAd: () => void;
  consumePremiumToken: () => void;
  isPremium: () => boolean;
  sendMessage: (receiverId: string, content: string, taskId?: string) => void;
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
  deleteOKR: (id: string) => void;
  updateUserSettings: (updates: Partial<User>) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addOKRCategory: (category: OKRCategory) => void;
  updateOKRCategory: (id: string, updates: Partial<OKRCategory>) => void;
  deleteOKRCategory: (id: string) => void;
  markMessagesAsRead: () => void;
};

  const TaskContext = createContext<TaskContextType | undefined>(undefined);

  export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [okrCategories, setOkrCategories] = useState<OKRCategory[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [priorityRange, setPriorityRange] = useState<[number, number]>([1, 5]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [favoriteColors, setFavoriteColors] = useState<string[]>(['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F97316', '#F59E0B', '#EC4899', '#6366F1']);

  const colorSettings: ColorSettings = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {} as ColorSettings);

  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const mapProfileToUser = (profile: any): User => ({
    id: profile.id,
    name: profile.name || 'Utilisateur',
    email: profile.email || '',
    avatar: profile.avatar,
    premiumTokens: profile.premium_tokens ?? 0,
    premiumWinStreak: profile.premium_win_streak ?? 0,
    lastTokenConsumption: profile.last_token_consumption,
    subscriptionEndDate: profile.subscription_end_date,
    autoValidation: profile.auto_validation ?? false,
  });

    const syncProfile = async (supabaseUser: any) => {
      try {
        console.log('[DEBUG] Syncing profile for user:', supabaseUser.id);
        
        const profileData = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Utilisateur',
          email: supabaseUser.email,
          premium_tokens: 3,
          premium_win_streak: 0,
          auto_validation: false,
        };

        // Add timeout to prevent infinite hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout syncing profile')), 10000)
        );

        const upsertPromise = supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' })
          .select()
          .single();

        const { data: profile, error } = await Promise.race([upsertPromise, timeoutPromise]) as any;

        if (error) {
          console.error('[DEBUG] Profile sync error:', error.message);
          // Still set a basic user object so the app can continue
          setUser(mapProfileToUser({ ...profileData, id: supabaseUser.id }));
          return { success: false, error: `Erreur profil: ${error.message}` };
        }

        if (profile) {
          console.log('[DEBUG] Profile synced successfully');
          setUser(mapProfileToUser(profile));
          return { success: true };
        }
        
        // Fallback if no profile returned but no error
        setUser(mapProfileToUser(profileData));
        return { success: true };
      } catch (err: any) {
        console.error('[DEBUG] Unexpected error in syncProfile:', err);
        // Ensure user is at least partially set to unblock the UI
        setUser(mapProfileToUser({ 
          id: supabaseUser.id, 
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.name || 'Utilisateur'
        }));
        return { success: false, error: `Erreur inattendue: ${err.message}` };
      }
    };

    const fetchData = async (userId: string) => {
      try {
        console.log('[DEBUG] Fetching data for user:', userId);
        
        const timeout = 15000; // 15s timeout for data fetching
        const withTimeout = (promise: Promise<any>) => 
          Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
          ]);

          const results = await Promise.allSettled([
            withTimeout(supabase.from('habits').select('*').eq('user_id', userId)),
            withTimeout(supabase.from('okrs').select('*, key_results:okr_key_results(*, history:okr_key_result_history(*))').eq('user_id', userId)),
            withTimeout(supabase.from('calendar_events').select('*').eq('user_id', userId)),
            withTimeout(supabase.from('messages').select('*').or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)),
            withTimeout(supabase.from('categories').select('*')),
            withTimeout(supabase.from('okr_categories').select('*')),
            withTimeout(supabase.from('tasks').select('*').eq('user_id', userId)),
            withTimeout(supabase.from('task_lists').select('*').eq('user_id', userId)),
            withTimeout(supabase.from('task_list_items').select('*')),
            withTimeout(supabase.from('friendships').select('*').or(`sender_id.eq.${userId},receiver_id.eq.${userId}`))
          ]);

          const [
            habitsRes,
            okrsRes,
            eventsRes,
            messagesRes,
            categoriesRes,
            okrCatsRes,
            tasksRes,
            listsRes,
            listItemsRes,
            friendshipsRes
          ] = results.map(r => r.status === 'fulfilled' ? r.value : { data: null, error: r.reason });

          if (friendshipsRes.data) {
            const allFriendshipUserIds = Array.from(new Set(friendshipsRes.data.flatMap((f: any) => [f.sender_id, f.receiver_id])));
            let allProfiles: { [key: string]: User } = {};

            if (allFriendshipUserIds.length > 0) {
              const { data: profiles } = await withTimeout(supabase.from('profiles').select('*').in('id', allFriendshipUserIds));
              if (profiles) {
                allProfiles = profiles.reduce((acc: any, p: any) => {
                  acc[p.id] = mapProfileToUser(p);
                  return acc;
                }, {});
              }
            }

            setFriendRequests(friendshipsRes.data.map((f: any) => ({
              id: f.id,
              senderId: f.sender_id,
              receiverId: f.receiver_id,
              status: f.status,
              timestamp: f.created_at,
              sender: allProfiles[f.sender_id]
            })));

            const acceptedFriendships = friendshipsRes.data.filter((f: any) => f.status === 'accepted');
            const friendIds = acceptedFriendships.map((f: any) => f.sender_id === userId ? f.receiver_id : f.sender_id);
            setFriends(friendIds.map(id => allProfiles[id]).filter(Boolean));
          }


        if (tasksRes.data) {
          setTasks(tasksRes.data.map((t: any) => ({
            ...t,
            estimatedTime: t.estimated_time,
            createdAt: t.created_at,
            bookmarked: t.bookmarked,
            completed: t.completed,
            completedAt: t.completed_at,
            isCollaborative: t.is_collaborative,
            sharedBy: t.shared_by,
            collaborators: t.collaborators || [],
            collaboratorValidations: t.collaborator_validations,
            pendingInvites: t.pending_invites
          })));
        }

        if (listsRes.data) {
          const items = listItemsRes.data || [];
          setLists(listsRes.data.map((l: any) => ({
            ...l,
            taskIds: items
              .filter((li: any) => li.list_id === l.id)
              .map((li: any) => li.task_id)
          })));
        }

        if (habitsRes.data) {
          const habitIds = habitsRes.data.map((h: any) => h.id);
          let completions: any[] = [];
          if (habitIds.length > 0) {
            try {
              const { data } = await withTimeout(supabase.from('habit_completions').select('*').in('habit_id', habitIds));
              completions = data || [];
            } catch (e) {
              console.warn('[DEBUG] Habit completions fetch failed:', e);
            }
          }
          
          setHabits(habitsRes.data.map((h: any) => ({
            ...h,
            estimatedTime: h.estimated_time,
            completions: completions.filter(c => c.habit_id === h.id).reduce((acc: any, curr) => {
              acc[curr.completed_at.split('T')[0]] = true;
              return acc;
            }, {}) || {}
          })));
        }

        if (okrsRes.data) setOkrs(okrsRes.data.map((o: any) => ({
          ...o,
          startDate: o.start_date,
          endDate: o.end_date,
          keyResults: (o.key_results || []).map((kr: any) => ({
            ...kr,
            currentValue: kr.current_value,
            targetValue: kr.target_value,
            history: (kr.history || []).map((h: any) => ({ date: h.created_at.split('T')[0], increment: h.increment }))
          }))
        })));

        if (eventsRes.data) setEvents(eventsRes.data.map((e: any) => ({
          ...e,
          start: e.start_time,
          end: e.end_time,
          taskId: e.task_id
        })));

        if (messagesRes.data) setMessages(messagesRes.data.map((m: any) => ({
          ...m,
          senderId: m.sender_id,
          receiverId: m.receiver_id,
          timestamp: m.created_at,
          taskId: m.task_id
        })));

        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (okrCatsRes.data) setOkrCategories(okrCatsRes.data);
        console.log('[DEBUG] Fetching completed');
      } catch (err) {
        console.error('[DEBUG] Global error in fetchData:', err);
      }
    };

      useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!mounted) return;

            if (session?.user) {
              console.log('[DEBUG] Initial Session Found:', session.user.id);
              await syncProfile(session.user);
              await fetchData(session.user.id);
            } else {
              console.log('[DEBUG] No Initial Session');
              setUser(null);
            }
          } catch (err) {
            console.error('[DEBUG] Auth Init Error:', err);
          } finally {
            if (mounted) setLoading(false);
          }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;
          console.log('[DEBUG] Auth Event:', event, session?.user?.email);

          if (session?.user) {
            // Only sync and fetch if the user ID changed or it's a login/refresh event
            if (!user || user.id !== session.user.id || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              console.log('[DEBUG] Session Active/Refreshed');
              await syncProfile(session.user);
              await fetchData(session.user.id);
            }
          } else if (event === 'SIGNED_OUT') {
            console.log('[DEBUG] User explicitly signed out');
            setUser(null);
            setTasks([]);
            setLists([]);
            setHabits([]);
            setOkrs([]);
            setEvents([]);
            setMessages([]);
            setCategories([]);
            setOkrCategories([]);
          }
          
          setLoading(false);
        });

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      }, []);

    useEffect(() => {
      // Data is now managed strictly via Supabase for all users including demo
    }, [tasks, lists, user]);


  const addTask = async (task: Task) => {
    if (user) {
      const { data, error } = await supabase.from('tasks').insert({
        id: task.id,
        user_id: user.id,
        name: task.name,
        priority: task.priority,
        category_name_legacy: task.category,
        deadline: task.deadline,
        estimated_time: task.estimatedTime,
        bookmarked: task.bookmarked,
        completed: task.completed,
        completed_at: task.completedAt,
        is_collaborative: task.isCollaborative,
        shared_by: task.sharedBy,
        collaborators: task.collaborators,
        permissions: task.permissions
      }).select().single();
      
      if (error) {
        console.error('Error adding task:', error);
        return;
      }
    }
    setTasks(prev => [...prev, task]);
  };

  const deleteTask = async (id: string) => {
    if (user) {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) {
        console.error('Error deleting task:', error);
        return;
      }
    }
    setTasks(prev => prev.filter(t => t.id !== id));
    setLists(prev => prev.map(l => ({ ...l, taskIds: l.taskIds.filter(tid => tid !== id) })));
  };

  const toggleBookmark = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && user) {
      const { error } = await supabase.from('tasks').update({ bookmarked: !task.bookmarked }).eq('id', id);
      if (error) {
        console.error('Error toggling bookmark:', error);
        return;
      }
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, bookmarked: !t.bookmarked } : t));
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && user) {
      const isCompleting = !task.completed;
      const completedAt = isCompleting ? new Date().toISOString() : null;
      const { error } = await supabase.from('tasks').update({ 
        completed: isCompleting, 
        completed_at: completedAt 
      }).eq('id', id);
      
      if (error) {
        console.error('Error toggling complete:', error);
        return;
      }
    }
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isCompleting = !t.completed;
        return { ...t, completed: isCompleting, completedAt: isCompleting ? new Date().toISOString() : undefined };
      }
      return t;
    }));
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (user) {
      const mappedUpdates: any = {};
      if (updates.name !== undefined) mappedUpdates.name = updates.name;
      if (updates.priority !== undefined) mappedUpdates.priority = updates.priority;
      if (updates.category !== undefined) mappedUpdates.category_name_legacy = updates.category;
      if (updates.deadline !== undefined) mappedUpdates.deadline = updates.deadline;
      if (updates.estimatedTime !== undefined) mappedUpdates.estimated_time = updates.estimatedTime;
      if (updates.bookmarked !== undefined) mappedUpdates.bookmarked = updates.bookmarked;
      if (updates.completed !== undefined) mappedUpdates.completed = updates.completed;
      if (updates.completedAt !== undefined) mappedUpdates.completed_at = updates.completedAt;
      
      if (Object.keys(mappedUpdates).length > 0) {
        const { error } = await supabase.from('tasks').update(mappedUpdates).eq('id', id);
        if (error) {
          console.error('Error updating task:', error);
          return;
        }
      }
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addList = async (list: TaskList) => {
    if (user) {
      const { error } = await supabase.from('task_lists').insert({
        id: list.id,
        user_id: user.id,
        name: list.name,
        color: list.color
      });
      if (error) {
        console.error('Error adding list:', error);
        return;
      }
    }
    setLists(prev => [...prev, list]);
  };

  const updateList = async (id: string, updates: Partial<TaskList>) => {
    if (user) {
      const mapped: any = {};
      if (updates.name !== undefined) mapped.name = updates.name;
      if (updates.color !== undefined) mapped.color = updates.color;
      
      if (Object.keys(mapped).length > 0) {
        const { error } = await supabase.from('task_lists').update(mapped).eq('id', id);
        if (error) {
          console.error('Error updating list:', error);
          return;
        }
      }
    }
    setLists(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const addTaskToList = async (taskId: string, listId: string) => {
    if (user) {
      const { error } = await supabase.from('task_list_items').insert({
        list_id: listId,
        task_id: taskId
      });
      if (error) {
        console.error('Error adding task to list:', error);
        return;
      }
    }
    setLists(prev => prev.map(l => l.id === listId && !l.taskIds.includes(taskId) ? { ...l, taskIds: [...l.taskIds, taskId] } : l));
  };

  const removeTaskFromList = async (taskId: string, listId: string) => {
    if (user) {
      const { error } = await supabase.from('task_list_items').delete().eq('list_id', listId).eq('task_id', taskId);
      if (error) {
        console.error('Error removing task from list:', error);
        return;
      }
    }
    setLists(prev => prev.map(l => l.id === listId ? { ...l, taskIds: l.taskIds.filter(id => id !== taskId) } : l));
  };

  const deleteList = async (id: string) => {
    if (user) {
      const { error } = await supabase.from('task_lists').delete().eq('id', id);
      if (error) {
        console.error('Error deleting list:', error);
        return;
      }
    }
    setLists(prev => prev.filter(l => l.id !== id));
  };

  const addEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    if (user) {
      const { data } = await supabase.from('calendar_events').insert({
        user_id: user.id,
        title: eventData.title,
        start_time: eventData.start,
        end_time: eventData.end,
        color: eventData.color,
        notes: eventData.notes,
        task_id: eventData.taskId || null
      }).select().single();
      if (data) setEvents(prev => [...prev, { ...data, start: data.start_time, end: data.end_time, taskId: data.task_id }]);
    }
  };

  const deleteEvent = async (id: string) => {
    if (user) await supabase.from('calendar_events').delete().eq('id', id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    if (user) {
      const mapped = {
        title: updates.title,
        start_time: updates.start,
        end_time: updates.end,
        color: updates.color,
        notes: updates.notes,
        task_id: updates.taskId
      };
      await supabase.from('calendar_events').update(mapped).eq('id', id);
    }
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const updateColorSettings = (colors: ColorSettings) => {
    setCategories(prev => prev.map(cat => ({
      ...cat,
      name: colors[cat.id] || cat.name
    })));
  };

  const login = async (email: string, password: string) => {
    console.log('[DEBUG] Login request:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('[DEBUG] Login error:', error.message);
        return { success: false, error: error.message };
      }
      
      // Data will be fetched by onAuthStateChange
      return { success: true };
    } catch (err: any) {
      console.error('[DEBUG] Unexpected login error:', err);
      return { success: false, error: err.message };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    console.log('[DEBUG] Register request:', email);
    try {
      if (supabaseAdmin) {
        // Step 1: Create or Get confirmed user
        const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name }
        });

        if (adminError) {
          if (adminError.message.includes('already exists')) {
            console.log('[DEBUG] User already exists, ensuring confirmation...');
            // Try to find the user to confirm them if they are not
            const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
            const existing = users.find(u => u.email === email);
            if (existing && !existing.email_confirmed_at) {
              await supabaseAdmin.auth.admin.updateUserById(existing.id, { email_confirm: true });
            }
            return await login(email, password);
          }
          return { success: false, error: adminError.message };
        }

        if (adminData.user) {
          return await login(email, password);
        }
      }

      // Fallback
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      console.error('[DEBUG] Unexpected register error:', err);
      return { success: false, error: err.message };
    }
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const watchAd = async () => {
    if (user) {
      const newTokens = user.premiumTokens + 1;
      await supabase.from('profiles').update({ premium_tokens: newTokens }).eq('id', user.id);
      setUser(prev => prev ? { ...prev, premiumTokens: newTokens } : null);
    }
  };

  const consumePremiumToken = async () => {
    if (user && user.premiumTokens > 0) {
      const newTokens = user.premiumTokens - 1;
      const now = new Date().toISOString();
      await supabase.from('profiles').update({ premium_tokens: newTokens, last_token_consumption: now }).eq('id', user.id);
      setUser(prev => prev ? { ...prev, premiumTokens: newTokens, lastTokenConsumption: now } : prev);
    }
  };

  const isPremium = () => {
    if (!user) return false;
    if (user.subscriptionEndDate && new Date() <= new Date(user.subscriptionEndDate)) return true;
    return user.premiumTokens > 0;
  };

  const sendMessage = async (receiverId: string, content: string, taskId?: string) => {
    if (user) {
      const { data } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: receiverId,
        content,
        task_id: taskId || null
      }).select().single();
      if (data) setMessages(prev => [...prev, { ...data, senderId: data.sender_id, receiverId: data.receiver_id, timestamp: data.created_at, taskId: data.task_id }]);
    }
  };

  const sendFriendRequest = async (email: string) => {
    if (user) {
      try {
        // Find user by email
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email.trim().toLowerCase())
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profiles) {
          toast.error("Utilisateur non trouvé");
          return;
        }

        if (profiles.id === user.id) {
          toast.error("Vous ne pouvez pas vous ajouter vous-même");
          return;
        }

        // Check if already friends or request pending
        const { data: existing, error: existingError } = await supabase
          .from('friendships')
          .select('status')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profiles.id}),and(sender_id.eq.${profiles.id},receiver_id.eq.${user.id})`)
          .maybeSingle();

        if (existing) {
          if (existing.status === 'accepted') {
            toast.error("Vous êtes déjà amis");
          } else {
            toast.error("Une demande est déjà en attente");
          }
          return;
        }

        const { error } = await supabase.from('friendships').insert({ 
          sender_id: user.id, 
          receiver_id: profiles.id, 
          status: 'pending' 
        });

        if (error) throw error;
        toast.success("Demande d'ami envoyée");
        fetchData(user.id);
      } catch (err: any) {
        console.error('Error sending friend request:', err);
        toast.error("Erreur lors de l'envoi de la demande");
      }
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('friendships')
          .update({ status: 'accepted' })
          .eq('id', requestId);

        if (error) throw error;
        toast.success("Demande d'ami acceptée");
        fetchData(user.id);
      } catch (err: any) {
        console.error('Error accepting friend request:', err);
        toast.error("Erreur lors de l'acceptation");
      }
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('friendships')
          .update({ status: 'rejected' })
          .eq('id', requestId);

        if (error) throw error;
        toast.info("Demande d'ami refusée");
        fetchData(user.id);
      } catch (err: any) {
        console.error('Error rejecting friend request:', err);
        toast.error("Erreur lors du refus");
      }
    }
  };

  const shareTask = async (taskId: string, userId: string, permission: 'responsible' | 'editor' | 'observer') => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCollaborative: true, collaborators: [...(t.collaborators || []), userId], permissions: permission } : t));
  };

  const addHabit = async (habit: Habit) => {
    if (user) {
      const { data } = await supabase.from('habits').insert({
        user_id: user.id,
        name: habit.name,
        estimated_time: habit.estimatedTime,
        color: habit.color,
        streak: 0
      }).select().single();
      if (data) setHabits(prev => [...prev, { ...data, estimatedTime: data.estimated_time, completions: {} }]);
    }
  };

  const toggleHabitCompletion = async (habitId: string, date: string) => {
    if (user) {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;
      const isCompleted = habit.completions[date];
      if (isCompleted) {
        await supabase.from('habit_completions').delete().eq('habit_id', habitId).eq('completed_at', date);
      } else {
        await supabase.from('habit_completions').insert({ habit_id: habitId, completed_at: date });
      }
      setHabits(prev => prev.map(h => h.id === habitId ? { ...h, completions: { ...h.completions, [date]: !isCompleted } } : h));
    }
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    if (user) {
      const mapped = {
        name: updates.name,
        estimated_time: updates.estimatedTime,
        color: updates.color,
        streak: updates.streak
      };
      await supabase.from('habits').update(mapped).eq('id', id);
    }
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteHabit = async (id: string) => {
    if (user) await supabase.from('habits').delete().eq('id', id);
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const addOKR = async (okr: OKR) => {
    if (user) {
      const { data } = await supabase.from('okrs').insert({
        user_id: user.id,
        title: okr.title,
        description: okr.description,
        category_name_legacy: okr.category,
        start_date: okr.startDate || getLocalDateString(new Date()),
        end_date: okr.endDate,
        estimated_time: okr.estimatedTime
      }).select().single();
      if (data) {
        const krs = await Promise.all(okr.keyResults.map(kr => 
          supabase.from('okr_key_results').insert({
            okr_id: data.id,
            title: kr.title,
            current_value: kr.currentValue,
            target_value: kr.targetValue,
            unit: kr.unit,
            estimated_time: kr.estimatedTime
          }).select().single()
        ));
        setOkrs(prev => [...prev, { 
          ...data, 
          startDate: data.start_date, 
          endDate: data.end_date, 
          keyResults: krs.map(r => r.data).filter(Boolean).map((kr: any) => ({
            ...kr,
            currentValue: kr.current_value,
            targetValue: kr.target_value,
            history: []
          }))
        }]);
      }
    }
  };

  const updateOKR = async (id: string, updates: Partial<OKR>) => {
    if (user) {
      const mapped = {
        title: updates.title,
        description: updates.description,
        category_name_legacy: updates.category,
        start_date: updates.startDate,
        end_date: updates.endDate,
        completed: updates.completed,
        estimated_time: updates.estimatedTime
      };
      await supabase.from('okrs').update(mapped).eq('id', id);
    }
    setOkrs(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const updateKeyResult = async (okrId: string, keyResultId: string, updates: Partial<KeyResult>) => {
    if (user) {
      const mapped = {
        title: updates.title,
        current_value: updates.currentValue,
        target_value: updates.targetValue,
        unit: updates.unit,
        completed: updates.completed,
        estimated_time: updates.estimatedTime
      };
      await supabase.from('okr_key_results').update(mapped).eq('id', keyResultId);
      if (updates.currentValue !== undefined) {
        const kr = okrs.find(o => o.id === okrId)?.keyResults.find(k => k.id === keyResultId);
        if (kr) {
          await supabase.from('okr_key_result_history').insert({
            key_result_id: keyResultId,
            increment: updates.currentValue - kr.currentValue
          });
        }
      }
    }
    setOkrs(prev => prev.map(okr => {
      if (okr.id === okrId) {
        return {
          ...okr,
          keyResults: okr.keyResults.map(kr => {
            if (kr.id === keyResultId) {
              const newHistory = [...(kr.history || [])];
              if (updates.currentValue !== undefined && updates.currentValue !== kr.currentValue) {
                newHistory.push({ date: getLocalDateString(new Date()), increment: updates.currentValue - kr.currentValue });
              }
              return { ...kr, ...updates, history: newHistory };
            }
            return kr;
          })
        };
      }
      return okr;
    }));
  };

  const deleteOKR = async (id: string) => {
    if (user) await supabase.from('okrs').delete().eq('id', id);
    setOkrs(prev => prev.filter(o => o.id !== id));
  };

  const updateUserSettings = async (updates: Partial<User>) => {
    if (user) {
      const mapped = {
        name: updates.name,
        avatar: updates.avatar,
        auto_validation: updates.autoValidation
      };
      await supabase.from('profiles').update(mapped).eq('id', user.id);
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const addCategory = async (category: Category) => {
    if (user) {
      const { data, error } = await supabase.from('categories').insert({
        name: category.name,
        color: category.color,
        user_id: user.id
      }).select().single();
      
      if (error) {
        console.error('Error adding category:', error);
        toast.error("Erreur lors de l'ajout de la catégorie");
        return;
      }
      
      if (data) {
        setCategories(prev => [...prev, data]);
      }
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    if (user) {
      const { error } = await supabase.from('categories').update({
        name: updates.name,
        color: updates.color
      }).eq('id', id);
      
      if (error) {
        console.error('Error updating category:', error);
        toast.error("Erreur lors de la mise à jour");
        return;
      }
    }
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = async (id: string) => {
    if (user) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        console.error('Error deleting category:', error);
        toast.error("Erreur lors de la suppression");
        return;
      }
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addOKRCategory = async (category: OKRCategory) => {
    if (user) {
      const { data, error } = await supabase.from('okr_categories').insert({
        name: category.name,
        color: category.color,
        icon: category.icon,
        user_id: user.id
      }).select().single();
      
      if (error) {
        console.error('Error adding OKR category:', error);
        toast.error("Erreur lors de l'ajout de la catégorie OKR");
        return;
      }
      
      if (data) {
        setOkrCategories(prev => [...prev, data]);
      }
    }
  };

  const updateOKRCategory = async (id: string, updates: Partial<OKRCategory>) => {
    if (user) {
      const { error } = await supabase.from('okr_categories').update({
        name: updates.name,
        color: updates.color,
        icon: updates.icon
      }).eq('id', id);
      
      if (error) {
        console.error('Error updating OKR category:', error);
        toast.error("Erreur lors de la mise à jour");
        return;
      }
    }
    setOkrCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteOKRCategory = async (id: string) => {
    if (user) {
      const { error } = await supabase.from('okr_categories').delete().eq('id', id);
      if (error) {
        console.error('Error deleting OKR category:', error);
        toast.error("Erreur lors de la suppression");
        return;
      }
    }
    setOkrCategories(prev => prev.filter(c => c.id !== id));
  };

  const markMessagesAsRead = async () => {
    if (user) {
      await supabase.from('messages').update({ read: true }).eq('receiver_id', user.id);
      setMessages(prev => prev.map(msg => msg.receiverId === user.id ? { ...msg, read: true } : msg));
    }
  };

  const contextValue = {
    tasks, lists, events, colorSettings, categories, priorityRange, searchTerm, selectedCategories,
    user, messages, friendRequests, habits, okrs, okrCategories, friends, favoriteColors, setFavoriteColors,
    addTask, deleteTask, toggleBookmark, toggleComplete, updateTask,
    addList, addTaskToList, removeTaskFromList, deleteList, updateList,
    addEvent, deleteEvent, updateEvent, updateColorSettings,
    setPriorityRange, setSearchTerm, setSelectedCategories,
    login, register, loginWithGoogle, logout, watchAd, consumePremiumToken, isPremium,
    sendMessage, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, shareTask,
    addHabit, toggleHabitCompletion, updateHabit, deleteHabit,
    addOKR, updateOKR, updateKeyResult, deleteOKR, updateUserSettings,
    addCategory, updateCategory, deleteCategory,
    addOKRCategory, updateOKRCategory, deleteOKRCategory,
    markMessagesAsRead
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};
