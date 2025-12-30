import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  CheckSquare, 
  Calendar, 
  Target, 
  BarChart2, 
    MessageCircle,
    Crown,
    Settings,
    Repeat,
    ChevronLeft,
    ChevronRight
  } from 'lucide-react';
import Logo from './Logo';
import { useTasks } from '../context/TaskContext';
import ThemeToggle from './ThemeToggle';

const Layout: React.FC = () => {
  const { user, messages } = useTasks();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);
  
  // Responsive: collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compter les messages non lus
  const unreadMessages = messages.filter(msg => !msg.read && msg.receiverId === user?.id).length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'rgb(var(--color-background))' }}>
      {/* Sidebar moderne et sobre */}
        <aside 
          className={`${isCollapsed ? 'w-20' : 'w-64'} nav-container border-r flex flex-col transition-all duration-300 ease-in-out relative group`}
        >
            {/* Toggle Button - Centré verticalement */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-zinc-800 border rounded-full p-1.5 shadow-sm hover:shadow-md transition-all z-50 md:opacity-0 md:group-hover:opacity-100 opacity-100 hover:text-blue-500 hover:border-blue-500"
              style={{ borderColor: 'rgb(var(--nav-border))' }}
              aria-label={isCollapsed ? "Agrandir la barre latérale" : "Réduire la barre latérale"}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            <div className={`p-6 border-b flex flex-col items-center ${isCollapsed ? 'px-2' : ''}`} style={{ borderColor: 'rgb(var(--nav-border))' }}>
              <div className={`${isCollapsed ? 'scale-75' : ''} transition-transform duration-300`}>
                <Logo showText={!isCollapsed} />
              </div>
              
              <div className={`mt-6 ${isCollapsed ? 'flex flex-col items-center gap-2' : 'w-full grid grid-cols-2'}`}>
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
                <div className="flex justify-center">
                  <NavLink 
                    to="/premium"
                    className="p-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    title="Passer à Premium"
                  >
                    <Crown size={20} className="text-amber-500" />
                  </NavLink>
                </div>
              </div>
            </div>
          
          <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-6 space-y-2 overflow-x-hidden`}>
          <NavLink 
            to="/" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            end
            aria-label="Accéder au tableau de bord"
          >
            <div className="min-w-[20px] flex items-center justify-center">
              <LayoutDashboard size={20} aria-hidden="true" />
            </div>
            {!isCollapsed && <span className="ml-3 truncate">Dashboard</span>}
          </NavLink>
          
          <NavLink 
            to="/tasks" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            aria-label="Accéder à la liste des tâches"
          >
            <div className="min-w-[20px] flex items-center justify-center">
              <CheckSquare size={20} aria-hidden="true" />
            </div>
            {!isCollapsed && <span className="ml-3 truncate">To do list</span>}
          </NavLink>
          
          <NavLink 
            to="/agenda" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            aria-label="Accéder à l'agenda"
          >
            <div className="min-w-[20px] flex items-center justify-center">
              <Calendar size={20} aria-hidden="true" />
            </div>
            {!isCollapsed && <span className="ml-3 truncate">Agenda</span>}
          </NavLink>
          
          <NavLink 
            to="/okr" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            aria-label="Accéder aux objectifs OKR"
          >
            <div className="min-w-[20px] flex items-center justify-center">
              <Target size={20} aria-hidden="true" />
            </div>
            {!isCollapsed && <span className="ml-3 truncate">OKR</span>}
          </NavLink>
          
          <NavLink 
            to="/habits" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            aria-label="Accéder au suivi des habitudes"
          >
            <div className="min-w-[20px] flex items-center justify-center">
              <Repeat size={20} aria-hidden="true" />
            </div>
            {!isCollapsed && <span className="ml-3 truncate">Habitudes</span>}
          </NavLink>
          
          <NavLink 
            to="/statistics" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            aria-label="Accéder aux statistiques"
          >
            <div className="min-w-[20px] flex items-center justify-center">
              <BarChart2 size={20} aria-hidden="true" />
            </div>
            {!isCollapsed && <span className="ml-3 truncate">Statistiques</span>}
          </NavLink>
        </nav>
        
        {/* Section Company */}
        <div className={`border-t ${isCollapsed ? 'p-2' : 'p-4'}`} style={{ borderColor: 'rgb(var(--nav-border))' }}>
          {!isCollapsed && <div className="text-xs font-semibold uppercase mb-4 px-2" style={{ color: 'rgb(var(--color-text-muted))' }}>COMPANY</div>}
          
          <NavLink 
            to="/messaging" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            aria-label={`Accéder à la messagerie${unreadMessages > 0 ? ` - ${unreadMessages} messages non lus` : ''}`}
          >
            <div className="min-w-[20px] flex items-center justify-center relative">
              <MessageCircle size={20} aria-hidden="true" />
              {unreadMessages > 0 && (
                <span className={`absolute ${isCollapsed ? '-top-1 -right-1' : '-top-2 -right-2'} bg-red-500 text-white text-[10px] rounded-full ${isCollapsed ? 'w-4 h-4' : 'w-5 h-5'} flex items-center justify-center`} aria-label={`${unreadMessages} messages non lus`}>
                  {unreadMessages}
                </span>
              )}
            </div>
            {!isCollapsed && <span className="ml-3 truncate">Messagerie</span>}
          </NavLink>
          
          <NavLink 
            to="/premium" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            aria-label="Accéder à Premium"
          >
            <div className="min-w-[20px] flex items-center justify-center">
              <Crown size={20} aria-hidden="true" />
            </div>
            {!isCollapsed && <span className="ml-3 truncate">Premium</span>}
          </NavLink>
          
            <NavLink 
              to="/settings" 
              className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
              aria-label="Accéder aux paramètres"
            >
              <div className="min-w-[20px] flex items-center justify-center">
                <Settings size={20} aria-hidden="true" />
              </div>
              {!isCollapsed && <span className="ml-3 truncate">Paramètres</span>}
            </NavLink>
          </div>
        </aside>

      {/* Main content moderne */}
      <main className="flex-1 overflow-auto" style={{ backgroundColor: 'rgb(var(--color-background))' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  CheckSquare, 
  Calendar, 
  Target, 
  BarChart2, 
    MessageCircle,
    Crown,
    Settings,
    Repeat,
    ChevronLeft,
    ChevronRight
  } from 'lucide-react';
import Logo from './Logo';
import { useTasks } from '../context/TaskContext';
import ThemeToggle from './ThemeToggle';

const Layout: React.FC = () => {
  const { user, messages } = useTasks();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);
  
  // Responsive: collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compter les messages non lus
  const unreadMessages = messages.filter(msg => !msg.read && msg.receiverId === user?.id).length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'rgb(var(--color-background))' }}>
      {/* Sidebar moderne et sobre */}
        <aside 
          className={`${isCollapsed ? 'w-20' : 'w-64'} nav-container border-r flex flex-col transition-all duration-300 ease-in-out relative group`}
        >
            {/* Toggle Button - Centré verticalement */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-zinc-800 border rounded-full p-1.5 shadow-sm hover:shadow-md transition-all z-50 md:opacity-0 md:group-hover:opacity-100 opacity-100 hover:text-blue-500 hover:border-blue-500"
              style={{ borderColor: 'rgb(var(--nav-border))' }}
              aria-label={isCollapsed ? "Agrandir la barre latérale" : "Réduire la barre latérale"}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            <div className={`p-6 border-b flex flex-col items-center ${isCollapsed ? 'px-2' : ''}`} style={{ borderColor: 'rgb(var(--nav-border))' }}>
              <div className={`${isCollapsed ? 'scale-75' : ''} transition-transform duration-300`}>
                <Logo showText={!isCollapsed} />
              </div>
              
              <div className={`mt-6 ${isCollapsed ? 'flex flex-col items-center gap-2' : 'w-full grid grid-cols-2'}`}>
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
                <div className="flex justify-center">
                  <NavLink 
                    to="/premium"
                    className="p-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    title="Passer à Premium"
                  >
                    <Crown size={20} className="text-amber-500" />
                  </NavLink>
                </div>
              </div>
            </div>
          
          <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-6 space-y-2 overflow-x-hidden`}>
          <NavLink 
            to="/" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            end
            aria-label="Accéder au tableau de bord"
          >
            <div className="min-w-[20px] flex items-center justify-center">
              <LayoutDashboard size={20} aria-hidden="true" />
            </div>
            {!isCollapsed && <span className="ml-3 truncate">Dashboard</span>}
          </NavLink>
          
          <NavLink 
            to="/tasks" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            aria-label="Accéder à la liste des tâches"
          >
            <div className="min-w-[20px] flex items-center justify-center">
              <CheckSquare size={20} aria-hidden="true" />
            </div>
            {!isCollapsed && <span className="ml-3 truncate">To do list</span>}
          </NavLink>
          
          <NavLink 
            to="/agenda" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            aria-label="Accéder à l'agenda"
          >
            <div className="min-w-[20px] flex items-center justify-center">
              <Calendar size={20} aria-hidden="true" />
            </div>
            {!isCollapsed && <span className="ml-3 truncate">Agenda</span>}
          </NavLink>
          
          <NavLink 
            to="/okr" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            aria-label="Accéder aux objectifs OKR"
          >
            <div className="min-w-[20px] flex items-center justify-center">
              <Target size={20} aria-hidden="true" />
            </div>
            {!isCollapsed && <span className="ml-3 truncate">OKR</span>}
          </NavLink>
          
          <NavLink 
            to="/habits" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            aria-label="Accéder au suivi des habitudes"
          >
            <div className="min-w-[20px] flex items-center justify-center">
              <Repeat size={20} aria-hidden="true" />
            </div>
            {!isCollapsed && <span className="ml-3 truncate">Habitudes</span>}
          </NavLink>
          
          <NavLink 
            to="/statistics" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            aria-label="Accéder aux statistiques"
          >
            <div className="min-w-[20px] flex items-center justify-center">
              <BarChart2 size={20} aria-hidden="true" />
            </div>
            {!isCollapsed && <span className="ml-3 truncate">Statistiques</span>}
          </NavLink>
        </nav>
        
        {/* Section Company */}
        <div className={`border-t ${isCollapsed ? 'p-2' : 'p-4'}`} style={{ borderColor: 'rgb(var(--nav-border))' }}>
          {!isCollapsed && <div className="text-xs font-semibold uppercase mb-4 px-2" style={{ color: 'rgb(var(--color-text-muted))' }}>COMPANY</div>}
          
          <NavLink 
            to="/messaging" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            aria-label={`Accéder à la messagerie${unreadMessages > 0 ? ` - ${unreadMessages} messages non lus` : ''}`}
          >
            <div className="min-w-[20px] flex items-center justify-center relative">
              <MessageCircle size={20} aria-hidden="true" />
              {unreadMessages > 0 && (
                <span className={`absolute ${isCollapsed ? '-top-1 -right-1' : '-top-2 -right-2'} bg-red-500 text-white text-[10px] rounded-full ${isCollapsed ? 'w-4 h-4' : 'w-5 h-5'} flex items-center justify-center`} aria-label={`${unreadMessages} messages non lus`}>
                  {unreadMessages}
                </span>
              )}
            </div>
            {!isCollapsed && <span className="ml-3 truncate">Messagerie</span>}
          </NavLink>
          
          <NavLink 
            to="/premium" 
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
            aria-label="Accéder à Premium"
          >
            <div className="min-w-[20px] flex items-center justify-center">
              <Crown size={20} aria-hidden="true" />
            </div>
            {!isCollapsed && <span className="ml-3 truncate">Premium</span>}
          </NavLink>
          
            <NavLink 
              to="/settings" 
              className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
              aria-label="Accéder aux paramètres"
            >
              <div className="min-w-[20px] flex items-center justify-center">
                <Settings size={20} aria-hidden="true" />
              </div>
              {!isCollapsed && <span className="ml-3 truncate">Paramètres</span>}
            </NavLink>
          </div>
        </aside>

      {/* Main content moderne */}
      <main className="flex-1 overflow-auto" style={{ backgroundColor: 'rgb(var(--color-background))' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
