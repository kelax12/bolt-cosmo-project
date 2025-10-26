import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useTasks } from '../context/TaskContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DeadlineCalendar: React.FC = () => {
  const { tasks, colorSettings } = useTasks();
  const [currentView, setCurrentView] = useState('dayGridMonth');

  // Convert tasks to calendar events based on deadlines
  const deadlineEvents = tasks
    .filter(task => !task.completed)
    .map(task => ({
      id: task.id,
      title: task.name,
      date: task.deadline.split('T')[0], // Extract date part
      backgroundColor: getCategoryColor(task.category),
      borderColor: getCategoryColor(task.category),
      textColor: '#ffffff',
      extendedProps: {
        priority: task.priority,
        category: task.category,
        estimatedTime: task.estimatedTime,
        categoryName: colorSettings[task.category]
      }
    }));

  function getCategoryColor(category: string) {
    const colors = {
      red: '#EF4444',
      blue: '#3B82F6',
      green: '#10B981',
      purple: '#8B5CF6',
      orange: '#F97316'
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  }

  const renderEventContent = (eventInfo: any) => {
    const { event } = eventInfo;
    const priority = event.extendedProps.priority;
    const categoryName = event.extendedProps.categoryName;
    
    return (
      <div className="p-1 text-xs">
        <div className="font-medium truncate">{event.title}</div>
        <div className="text-xs opacity-90">
          P{priority} • {categoryName}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 rounded-lg shadow-sm border transition-colors" style={{
      backgroundColor: 'rgb(var(--color-surface))',
      borderColor: 'rgb(var(--color-border))'
    }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>Calendrier des deadlines</h2>
        
        <div className="flex rounded-lg p-1 transition-colors" style={{ backgroundColor: 'rgb(var(--color-hover))' }}>
          <button
            onClick={() => setCurrentView('dayGridMonth')}
            className="px-3 py-1 text-sm font-medium rounded-md transition-colors"
            style={{
              backgroundColor: currentView === 'dayGridMonth' ? 'rgb(var(--color-surface))' : 'transparent',
              color: currentView === 'dayGridMonth' ? 'rgb(var(--color-text-primary))' : 'rgb(var(--color-text-secondary))',
              boxShadow: currentView === 'dayGridMonth' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (currentView !== 'dayGridMonth') {
                e.currentTarget.style.color = 'rgb(var(--color-text-primary))';
                e.currentTarget.style.backgroundColor = 'rgb(var(--color-active))';
              }
            }}
            onMouseLeave={(e) => {
              if (currentView !== 'dayGridMonth') {
                e.currentTarget.style.color = 'rgb(var(--color-text-secondary))';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Mois
          </button>
          <button
            onClick={() => setCurrentView('timeGridWeek')}
            className="px-3 py-1 text-sm font-medium rounded-md transition-colors"
            style={{
              backgroundColor: currentView === 'timeGridWeek' ? 'rgb(var(--color-surface))' : 'transparent',
              color: currentView === 'timeGridWeek' ? 'rgb(var(--color-text-primary))' : 'rgb(var(--color-text-secondary))',
              boxShadow: currentView === 'timeGridWeek' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
            }}
          >
            Semaine
          </button>
        </div>
      </div>
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView={currentView}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        events={deadlineEvents}
        height="auto"
        locale="fr"
        eventContent={renderEventContent}
        eventDisplay="block"
        dayMaxEvents={3}
        moreLinkText="plus"
        eventDidMount={(info) => {
          // Add tooltip with task details
          info.el.title = `${info.event.title}\nPriorité: ${info.event.extendedProps.priority}\nCatégorie: ${info.event.extendedProps.categoryName}\nTemps estimé: ${info.event.extendedProps.estimatedTime}min`;
        }}
      />
      
      <div className="mt-4 flex flex-wrap gap-4 text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>{colorSettings.red}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>{colorSettings.blue}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>{colorSettings.green}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span>{colorSettings.purple}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span>{colorSettings.orange}</span>
        </div>
      </div>
    </div>
  );
};

export default DeadlineCalendar;
