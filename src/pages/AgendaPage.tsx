import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { useTasks } from '../context/TaskContext';
import { ChevronLeft, ChevronRight, Calendar, Clock, Plus, X } from 'lucide-react';
import TaskSidebar from '../components/TaskSidebar';
import AddEventModal from '../components/AddEventModal';
import EditEventModal from '../components/EditEventModal';

const AgendaPage: React.FC = () => {
  const { events, addEvent, deleteEvent, updateEvent, colorSettings } = useTasks();
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const [showTaskSidebar, setShowTaskSidebar] = useState(true);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{start: string, end: string} | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);
  const calendarRef = useRef<FullCalendar>(null);

  // Initialize external dragging for task elements (✅ avec cleanup pour éviter les doublons au hot reload)
  useEffect(() => {
    let draggableInstance: Draggable | null = null;

    const initializeExternalDragging = () => {
      const container = document.getElementById('external-events-container');
      const taskElements = document.querySelectorAll('.external-event');
      
      if (container && taskElements.length > 0) {
        // Détruire au cas où une ancienne instance traîne (hot reload)
        if (draggableInstance) {
          try { draggableInstance.destroy(); } catch {}
          draggableInstance = null;
        }

        draggableInstance = new Draggable(container, {
          itemSelector: '.external-event',
          eventData: function(eventEl) {
            const taskData = JSON.parse(eventEl.getAttribute('data-task') || '{}');
            return {
              title: taskData.name,
              duration: { minutes: taskData.estimatedTime },
              backgroundColor: getCategoryColor(taskData.category),
              borderColor: getCategoryColor(taskData.category),
              textColor: '#ffffff',
              extendedProps: {
                taskId: taskData.id,
                priority: taskData.priority,
                category: taskData.category,
                estimatedTime: taskData.estimatedTime,
                categoryName: colorSettings[taskData.category]
              }
            };
          }
        });
      }
    };

    const timer = setTimeout(initializeExternalDragging, 200);
    return () => {
      clearTimeout(timer);
      if (draggableInstance) {
        try { draggableInstance.destroy(); } catch (e) {}
        draggableInstance = null;
      }
    };
  }, [showTaskSidebar, colorSettings]);

  // CORRECTION: Forcer le re-render du calendrier quand les événements changent
  useEffect(() => {
    console.log('📅 AgendaPage: events state changed, forcing calendar re-render with new key. Events count:', events.length);
    setCalendarKey(prev => prev + 1);
  }, [events]);

  // CORRECTION: Forcer le re-render quand on change de vue
  const handleViewChange = (newView: string) => {
    console.log('🔄 AgendaPage: View change requested:', newView);
    setCurrentView(newView);
    setCalendarKey(prev => prev + 1);
    
    // Petit délai pour s'assurer que la vue est bien changée
    setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.getApi().changeView(newView);
      }
    }, 100);
  };

  // CORRECTION: Gestion correcte de la sélection de plage horaire
  const handleDateSelect = (selectInfo: any) => {
    console.log('📅 AgendaPage: handleDateSelect triggered. Selected slot:', selectInfo.startStr, 'to', selectInfo.endStr);
    console.log('📊 AgendaPage: Current events before selection:', events.length);
    
    const start = selectInfo.start;
    const end = selectInfo.end;
    
    setSelectedTimeSlot({
      start: start.toISOString(),
      end: end.toISOString()
    });
    setShowAddEventModal(true);
    
    // CORRECTION: Ne pas désélectionner immédiatement - on le fera lors de la fermeture de la modal
  };

  // CORRECTION: Gestion correcte du clic sur un événement
  const handleEventClick = (clickInfo: any) => {
    console.log('🖱️ AgendaPage: Event clicked, ID:', clickInfo.event.id);
    console.log('📋 AgendaPage: Available events:', events.map(e => ({ id: e.id, title: e.title })));
    
    // Trouver l'événement dans notre state
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) {
      console.log('✅ AgendaPage: Found event:', event.title);
      setSelectedEvent(event);
      setShowEditEventModal(true);
    } else {
      console.log('❌ AgendaPage: Event not found in state');
    }
  };

  const handleEventDrop = (dropInfo: any) => {
    console.log('🔄 AgendaPage: Event repositioned:', dropInfo.event.title);
    const eventId = dropInfo.event.id;
    const newStart = dropInfo.event.start.toISOString();
    const newEnd = dropInfo.event.end ? dropInfo.event.end.toISOString() : new Date(dropInfo.event.start.getTime() + 60*60*1000).toISOString();
    
    updateEvent(eventId, {
      start: newStart,
      end: newEnd
    });
  };

  // CORRECTION: éviter le doublon après drag & drop d'un événement externe (remove + déduplication)
  const handleEventReceive = (receiveInfo: any) => {
    console.log('🎯 AgendaPage: handleEventReceive called (drag-drop). Event title:', receiveInfo.event.title);
    console.log('📊 AgendaPage: Current events before receive:', events.length);
    
    const eventData = receiveInfo.event;
    const newEvent = {
      title: eventData.title,
      start: eventData.start?.toISOString(),
      end: eventData.end
        ? eventData.end.toISOString()
        : new Date(eventData.start.getTime() + (eventData.extendedProps.estimatedTime * 60 * 1000)).toISOString(),
      color: eventData.backgroundColor,
      notes: `Priorité: ${eventData.extendedProps.priority} | Catégorie: ${eventData.extendedProps.categoryName}`,
      taskId: eventData.extendedProps.taskId
    };

    // 🔑 Retirer l'événement temporaire créé par FullCalendar pour éviter l'affichage en double.
    receiveInfo.event.remove();

    // 🛡️ Déduplication simple : empêcher l'ajout si même taskId déjà présent
    const isDuplicate = events.some(e =>
      (newEvent.taskId && e.taskId === newEvent.taskId) ||
      (e.title === newEvent.title && e.start === newEvent.start && e.end === newEvent.end)
    );
    if (isDuplicate) {
      console.log('🚫 Duplicate prevented on receive');
      return;
    }
    
    console.log('➕ AgendaPage: Adding new event from drag (state):', newEvent.title);
    addEvent(newEvent);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      red: '#EF4444',
      blue: '#3B82F6',
      green: '#10B981',
      purple: '#8B5CF6',
      orange: '#F97316'
    } as const;
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  // CORRECTION: Génération des événements du calendrier avec clé unique
  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    backgroundColor: event.color,
    borderColor: event.color,
    textColor: '#ffffff',
    extendedProps: {
      notes: event.notes,
      taskId: event.taskId
    }
  }));

  // CORRECTION: Gestion correcte de l'ajout d'événement avec fermeture de modal
  const handleAddEvent = (eventData: any) => {
    console.log('➕ AgendaPage: handleAddEvent called from modal. Event data title:', eventData.title);
    console.log('📊 AgendaPage: Current events before adding from modal:', events.length);
    
    addEvent({
      ...eventData,
      taskId: eventData.taskId || ''
    });
    
    // CORRECTION: Fermer la modal et nettoyer les états
    setShowAddEventModal(false);
    setSelectedTimeSlot(null);
    
    // AJOUT: Désélectionner manuellement dans FullCalendar après un petit délai
    setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.getApi().unselect();
      }
    }, 100);
  };

  const handleQuickAddEvent = (eventData: any) => {
    console.log('⚡ AgendaPage: Adding quick event:', eventData.title);
    addEvent({
      ...eventData,
      taskId: ''
    });
    setShowQuickAddModal(false);
  };

  // CORRECTION: Gestion correcte de la mise à jour d'événement
  const handleUpdateEvent = (eventId: string, eventData: any) => {
    console.log('✏️ AgendaPage: Updating event:', eventId, eventData.title);
    updateEvent(eventId, eventData);
    setShowEditEventModal(false);
    setSelectedEvent(null);
  };

  // CORRECTION: Gestion correcte de la suppression d'événement
  const handleDeleteEvent = (eventId: string) => {
    console.log('🗑️ AgendaPage: Deleting event:', eventId);
    deleteEvent(eventId);
    setShowEditEventModal(false);
    setSelectedEvent(null);
  };

  // AJOUT: Fonction pour fermer la modal sans créer d'événement
  const handleCloseAddModal = () => {
    console.log('❌ AgendaPage: Closing AddEventModal without creating event');
    setShowAddEventModal(false);
    setSelectedTimeSlot(null);
    
    // AJOUT: Désélectionner manuellement dans FullCalendar après un petit délai
    setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.getApi().unselect();
      }
    }, 100);
  };

  return (
    <div className="h-screen flex" style={{ backgroundColor: 'rgb(var(--color-background))' }}>
      {/* Task Sidebar */}
      {showTaskSidebar && (
        <TaskSidebar />
      )}

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col">
        {/* Modern Header */}
        <div className="px-6 py-4 border-b" style={{ backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowTaskSidebar(!showTaskSidebar)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showTaskSidebar 
                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                style={{ 
                  backgroundColor: showTaskSidebar ? 'rgb(var(--color-accent))' : 'rgb(var(--color-hover))',
                  color: showTaskSidebar ? 'white' : 'rgb(var(--color-text-primary))'
                }}
              >
                <Calendar size={20} />
                <span>Tâches</span>
              </button>

              <button
                onClick={() => setShowQuickAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-green-700 transition-colors"
                style={{ 
                  backgroundColor: 'rgb(var(--color-success))'
                }}
              >
                <Plus size={20} />
                <span>Nouvel événement</span>
              </button>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => calendarRef.current?.getApi().prev()}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'rgb(var(--color-text-secondary))' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <button 
                  onClick={() => calendarRef.current?.getApi().next()}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'rgb(var(--color-text-secondary))' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
                <button 
                  onClick={() => calendarRef.current?.getApi().today()}
                  className="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{ color: 'rgb(var(--color-text-secondary))' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Aujourd'hui
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex rounded-lg p-1" style={{ backgroundColor: 'rgb(var(--color-hover))' }}>
                <button
                  onClick={() => handleViewChange('timeGridDay')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    currentView === 'timeGridDay' 
                      ? 'shadow-sm' 
                      : ''
                  }`}
                  style={{
                    backgroundColor: currentView === 'timeGridDay' ? 'rgb(var(--color-surface))' : 'transparent',
                    color: currentView === 'timeGridDay' ? 'rgb(var(--color-text-primary))' : 'rgb(var(--color-text-secondary))'
                  }}
                >
                  Jour
                </button>
                <button
                  onClick={() => handleViewChange('timeGridWeek')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    currentView === 'timeGridWeek' 
                      ? 'shadow-sm' 
                      : ''
                  }`}
                  style={{
                    backgroundColor: currentView === 'timeGridWeek' ? 'rgb(var(--color-surface))' : 'transparent',
                    color: currentView === 'timeGridWeek' ? 'rgb(var(--color-text-primary))' : 'rgb(var(--color-text-secondary))'
                  }}
                >
                  Semaine
                </button>
                <button
                  onClick={() => handleViewChange('dayGridMonth')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    currentView === 'dayGridMonth' 
                      ? 'shadow-sm' 
                      : ''
                  }`}
                  style={{
                    backgroundColor: currentView === 'dayGridMonth' ? 'rgb(var(--color-surface))' : 'transparent',
                    color: currentView === 'dayGridMonth' ? 'rgb(var(--color-text-primary))' : 'rgb(var(--color-text-secondary))'
                  }}
                >
                  Mois
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Container */}
        <div className="flex-1 p-6">
          <div className="rounded-xl shadow-sm border h-full" style={{ backgroundColor: 'rgb(var(--calendar-bg))', borderColor: 'rgb(var(--calendar-border))' }}>
            <div className="p-6 h-full">
              <FullCalendar
                key={calendarKey}
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={currentView}
                headerToolbar={false}
                events={calendarEvents}
                editable={true}
                droppable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={false}
                weekends={true}
                height="100%"
                locale="fr"
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                allDaySlot={false}
                nowIndicator={true}
                eventDisplay="block"
                dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
                slotLabelFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                }}
                // NOUVEAU: Configuration pour placement toutes les 10 minutes
                slotDuration="00:10:00"
                slotLabelInterval="01:00:00"
                snapDuration="00:10:00"
                selectConstraint={{
                  start: '06:00',
                  end: '22:00'
                }}
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                eventReceive={handleEventReceive}
                // CORRECTION: Configuration équilibrée pour maintenir la sélection sans casser la fonctionnalité
                unselectAuto={true}
                unselectCancel=".modal-overlay,.modal-content,input,textarea,select,button,.fc-event"
                eventContent={(eventInfo) => {
                  return (
                    <div className="h-full w-full flex items-center justify-center p-1 text-xs cursor-pointer">
                      <div className="font-medium text-white truncate text-center leading-tight">
                        {eventInfo.event.title}
                      </div>
                    </div>
                  );
                }}
                // ⛔️ Important: on retire 'hover:bg-gray-50' qui casse le dark mode
                dayCellClassNames={() => 'transition-colors'}
                eventClassNames="rounded-lg shadow-sm border-0 cursor-pointer hover:shadow-md transition-shadow"
                viewDidMount={(info) => {
                  console.log('👁️ AgendaPage: View mounted:', info.view.type);
                }}
                eventsSet={(events) => {
                  console.log('📋 AgendaPage: Events set in calendar by FullCalendar:', events.length);
                  console.log('📋 AgendaPage: Event IDs in FullCalendar:', events.map(e => e.id));
                }}
              />

              {/* ✅ Correctif Dark Mode : éviter le flash clair au survol de la colonne */}
              <style>{`
                /* Colonnes timegrid & cases dayGrid en mode sombre : hover discret, pas de blanc */
                .dark .fc-theme-standard td.fc-day:hover,
                .dark .fc-theme-standard td.fc-day.fc-day-today:hover,
                .dark .fc-theme-standard .fc-timegrid-col:hover {
                  background-color: rgba(255, 255, 255, 0.06) !important;
                }

                /* Base neutre pour éviter que FullCalendar force un fond clair */
                .dark .fc-theme-standard td.fc-day,
                .dark .fc-theme-standard .fc-timegrid-col {
                  background-color: transparent !important;
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>

      {/* CORRECTION: Modales avec overlay pour empêcher la désélection */}
      
      {/* Add Event Modal */}
      {showAddEventModal && selectedTimeSlot && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <AddEventModal
            isOpen={showAddEventModal}
            onClose={handleCloseAddModal}
            task={{
              id: '',
              name: '',
              priority: 3,
              category: 'blue',
              deadline: '',
              estimatedTime: 60,
              createdAt: '',
              bookmarked: false,
              completed: false
            }}
            onAddEvent={handleAddEvent}
            prefilledTimeSlot={selectedTimeSlot}
          />
        </div>
      )}

      {/* Quick Add Event Modal */}
      {showQuickAddModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <QuickAddEventModal
            isOpen={showQuickAddModal}
            onClose={() => {
              console.log('❌ AgendaPage: Closing QuickAddModal');
              setShowQuickAddModal(false);
            }}
            onAddEvent={handleQuickAddEvent}
          />
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditEventModal && selectedEvent && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <EditEventModal
            isOpen={showEditEventModal}
            onClose={() => {
              console.log('❌ AgendaPage: Closing EditEventModal');
              setShowEditEventModal(false);
              setSelectedEvent(null);
            }}
            event={selectedEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        </div>
      )}
    </div>
  );
};

// CORRECTION: Composant QuickAddEventModal avec design optimisé sans scroll
const QuickAddEventModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (eventData: any) => void;
}> = ({ isOpen, onClose, onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('12:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('13:00');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState('#3B82F6');

  // Initialiser avec la date d'aujourd'hui
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      setStartDate(todayStr);
      setEndDate(todayStr);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Veuillez saisir un titre pour l\'événement');
      return;
    }
    
    const start = new Date(`${startDate}T${startTime}`).toISOString();
    const end = new Date(`${endDate}T${endTime}`).toISOString();
    
    // Vérifier que la date de fin est après la date de début
    if (new Date(end) <= new Date(start)) {
      alert('La date de fin doit être après la date de début');
      return;
    }
    
    console.log('⚡ QuickAddEventModal: Submitting event:', title.trim());
    
    onAddEvent({
      title: title.trim(),
      start,
      end,
      color,
      notes: notes.trim(),
    });
    
    // Reset form
    setTitle('');
    setNotes('');
    setColor('#3B82F6');
    onClose();
  };

  const colorOptions = [
    { value: '#3B82F6', name: 'Bleu', color: '#3B82F6' },
    { value: '#EF4444', name: 'Rouge', color: '#EF4444' },
    { value: '#10B981', name: 'Vert', color: '#10B981' },
    { value: '#8B5CF6', name: 'Violet', color: '#8B5CF6' },
    { value: '#F97316', name: 'Orange', color: '#F97316' },
    { value: '#F59E0B', name: 'Jaune', color: '#F59E0B' },
    { value: '#EC4899', name: 'Rose', color: '#EC4899' },
    { value: '#6366F1', name: 'Indigo', color: '#6366F1' },
  ];

  // Fonction pour formater l'affichage de l'heure
  const formatTimeDisplay = (timeValue: string) => {
    if (!timeValue) return '';
    const [hours, minutes] = timeValue.split(':');
    return `${hours}h${minutes}`;
  };

  // Calcul de la durée
  const calculateDuration = () => {
    if (!startDate || !startTime || !endDate || !endTime) return null;
    
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffMs <= 0) return "⚠️ Fin avant début";
    if (diffHours === 0) return `${diffMinutes} min`;
    if (diffMinutes === 0) return `${diffHours}h`;
    return `${diffHours}h${diffMinutes}min`;
  };

  return (
    <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-4xl h-auto">
      {/* Header compact */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
        <h2 className="text-xl font-bold text-primary-900">Créer un événement</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 hover:bg-white rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Layout en grille pour optimiser l'espace */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Colonne gauche - Informations principales */}
          <div className="col-span-7 space-y-4">
            
            {/* Titre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📝 Titre de l'événement *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                placeholder="Nom de l'événement"
                required
              />
            </div>

            {/* Planification - Layout horizontal compact */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Clock size={16} className="text-primary-600" />
                Planification
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Début */}
                <div className="bg-white p-3 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Début</span>
                    {startTime && (
                      <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                        {formatTimeDisplay(startTime)}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                      required
                    />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>

                {/* Fin */}
                <div className="bg-white p-3 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Fin</span>
                    {endTime && (
                      <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                        {formatTimeDisplay(endTime)}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                      required
                    />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Durée calculée - Affichage compact */}
              {calculateDuration() && (
                <div className="mt-3 text-center">
                  <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                    <Clock size={14} />
                    <span>Durée : {calculateDuration()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Notes - Taille réduite */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📄 Description
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Description de l'événement (optionnel)"
              />
            </div>
          </div>

          {/* Colonne droite - Couleur et actions */}
          <div className="col-span-5 space-y-4">
            
            {/* Sélection de couleur - Design amélioré */}
            <div>
              <label className="block text sm font-semibold text-gray-700 mb-3">
                🎨 Couleur de l'événement
              </label>
              
              {/* Grille de couleurs visuelles */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {colorOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setColor(option.value)}
                    className={`relative w-full h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                      color === option.value 
                        ? 'border-gray-800 shadow-lg' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: option.color }}
                    title={option.name}
                  >
                    {color === option.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Nom de la couleur sélectionnée */}
              <div className="flex items-center gap-2 justify-center bg-gray-50 p-2 rounded-lg">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {colorOptions.find(opt => opt.value === color)?.name}
                </span>
              </div>
            </div>

            {/* Aperçu de l'événement */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">👁️ Aperçu</h4>
              <div 
                className="p-3 rounded-lg text-white text-center font-medium shadow-sm"
                style={{ backgroundColor: color }}
              >
                {title || 'Nom de l\'événement'}
              </div>
              {calculateDuration() && (
                <div className="text-xs text-gray-600 text-center mt-2">
                  {calculateDuration()}
                </div>
              )}
            </div>

            {/* Action - Bouton unique Valider */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ✅ Valider
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AgendaPage;
