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
import { motion, AnimatePresence } from 'framer-motion';

const AgendaPage: React.FC = () => {
  const { events, addEvent, deleteEvent, updateEvent, colorSettings } = useTasks();
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const [showTaskSidebar, setShowTaskSidebar] = useState(true);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{start: string;end: string;} | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);
  const calendarRef = useRef<FullCalendar>(null);

  // Initialize external dragging for task elements
  useEffect(() => {
    let draggableInstance: Draggable | null = null;

    const initializeExternalDragging = () => {
      const container = document.getElementById('external-events-container');
      const taskElements = document.querySelectorAll('.external-event');

      if (container && taskElements.length > 0) {
        if (draggableInstance) {
          try {draggableInstance.destroy();} catch {}
          draggableInstance = null;
        }

        draggableInstance = new Draggable(container, {
          itemSelector: '.external-event',
          eventData: function (eventEl) {
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
        try {draggableInstance.destroy();} catch (e) {}
        draggableInstance = null;
      }
    };
  }, [showTaskSidebar, colorSettings]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.getApi().updateSize();
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [showTaskSidebar]);

  const handleViewChange = (newView: string) => {
    setCurrentView(newView);
    setCalendarKey((prev) => prev + 1);

    setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.getApi().changeView(newView);
      }
    }, 100);
  };

  const handleDateSelect = (selectInfo: any) => {
    const start = selectInfo.start;
    const end = selectInfo.end;

    setSelectedTimeSlot({
      start: start.toISOString(),
      end: end.toISOString()
    });
    setShowAddEventModal(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const event = events.find((e) => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setShowEditEventModal(true);
    }
  };

  const handleEventDrop = (dropInfo: any) => {
    const eventId = dropInfo.event.id;
    const newStart = dropInfo.event.start.toISOString();
    const newEnd = dropInfo.event.end ? dropInfo.event.end.toISOString() : new Date(dropInfo.event.start.getTime() + 60 * 60 * 1000).toISOString();

    updateEvent(eventId, {
      start: newStart,
      end: newEnd
    });
  };

  const handleEventReceive = (receiveInfo: any) => {
    const eventData = receiveInfo.event;
    const newEvent = {
      title: eventData.title,
      start: eventData.start?.toISOString(),
      end: eventData.end ?
      eventData.end.toISOString() :
      new Date(eventData.start.getTime() + eventData.extendedProps.estimatedTime * 60 * 1000).toISOString(),
      color: eventData.backgroundColor,
      notes: `Priorité: ${eventData.extendedProps.priority} | Catégorie: ${eventData.extendedProps.categoryName}`,
      taskId: eventData.extendedProps.taskId
    };

    receiveInfo.event.remove();

    const isDuplicate = events.some((e) =>
    newEvent.taskId && e.taskId === newEvent.taskId ||
    e.title === newEvent.title && e.start === newEvent.start && e.end === newEvent.end
    );
    if (isDuplicate) return;

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

  const calendarEvents = events.map((event) => ({
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

  const handleAddEvent = (eventData: any) => {
    addEvent({
      ...eventData,
      taskId: eventData.taskId || ''
    });

    setShowAddEventModal(false);
    setSelectedTimeSlot(null);

    setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.getApi().unselect();
      }
    }, 100);
  };

  const handleQuickAddEvent = (eventData: any) => {
    addEvent({
      ...eventData,
      taskId: ''
    });
    setShowQuickAddModal(false);
  };

  const handleUpdateEvent = (eventId: string, eventData: any) => {
    updateEvent(eventId, eventData);
    setShowEditEventModal(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    setShowEditEventModal(false);
    setSelectedEvent(null);
  };

  const handleCloseAddModal = () => {
    setShowAddEventModal(false);
    setSelectedTimeSlot(null);

    setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.getApi().unselect();
      }
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex"
      style={{ backgroundColor: 'rgb(var(--color-background))' }}>

      {/* Task Sidebar */}
      <AnimatePresence mode="wait">
        {showTaskSidebar &&
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}>

            <TaskSidebar />
          </motion.div>
        }
      </AnimatePresence>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Modern Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="px-6 py-4 border-b"
          style={{ backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))' }}>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTaskSidebar(!showTaskSidebar)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-sm w-full sm:w-auto justify-center ${
                  showTaskSidebar ?
                  'shadow-md' :
                  ''}`
                }
                style={{
                  backgroundColor: showTaskSidebar ? 'rgb(var(--color-accent))' : 'rgb(var(--color-hover))',
                  color: showTaskSidebar ? 'white' : 'rgb(var(--color-text-primary))'
                }}>

                <Calendar size={20} />
                <span className="font-medium">Tâches</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQuickAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all shadow-sm hover:shadow-md w-full sm:w-auto justify-center whitespace-nowrap"
                style={{
                  backgroundColor: 'rgb(var(--color-success))'
                }}>

                <Plus size={20} />
                <span className="font-medium">Nouvel événement</span>
              </motion.button>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => calendarRef.current?.getApi().prev()}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'rgb(var(--color-text-secondary))' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>

                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => calendarRef.current?.getApi().next()}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'rgb(var(--color-text-secondary))' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>

                  <ChevronRight size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => calendarRef.current?.getApi().today()}
                  className="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{ color: 'rgb(var(--color-text-secondary))' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>

                  Aujourd'hui
                </motion.button>
              </div>
            </div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3">

              <div className="flex rounded-lg p-1" style={{ backgroundColor: 'rgb(var(--color-hover))' }}>
                {['timeGridDay', 'timeGridWeek', 'dayGridMonth'].map((view, index) =>
                <motion.button
                  key={view}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewChange(view)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                  currentView === view ? 'shadow-sm' : ''}`
                  }
                  style={{
                    backgroundColor: currentView === view ? 'rgb(var(--color-surface))' : 'transparent',
                    color: currentView === view ? 'rgb(var(--color-text-primary))' : 'rgb(var(--color-text-secondary))'
                  }}>

                    {view === 'timeGridDay' ? 'Jour' : view === 'timeGridWeek' ? 'Semaine' : 'Mois'}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Calendar Container */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 p-6 min-w-0">

          <div className="rounded-xl shadow-lg border h-full w-full" style={{ backgroundColor: 'rgb(var(--calendar-bg))', borderColor: 'rgb(var(--calendar-border))' }}>
            <div className="p-6 h-full w-full">
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
                slotMinTime="00:00:00"
                slotMaxTime="24:00:00"
                allDaySlot={false}
                nowIndicator={true}
                eventDisplay="block"
                dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
                slotLabelFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                }}
                slotDuration="00:10:00"
                slotLabelInterval="01:00:00"
                snapDuration="00:10:00"
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                eventReceive={handleEventReceive}
                unselectAuto={true}
                unselectCancel=".modal-overlay,.modal-content,input,textarea,select,button,.fc-event"
                eventContent={(eventInfo) => {
                  return (
                    <div className="h-full w-full flex items-center justify-center p-1 text-xs cursor-pointer">
                      <div className="font-medium text-white truncate text-center leading-tight">
                        {eventInfo.event.title}
                      </div>
                    </div>);

                }}
                dayCellClassNames={() => 'transition-colors'}
                eventClassNames="rounded-lg shadow-sm border-0 cursor-pointer hover:shadow-md transition-all hover:scale-105" />


              <style>{`
                .dark .fc-theme-standard td.fc-day:hover,
                .dark .fc-theme-standard td.fc-day.fc-day-today:hover,
                .dark .fc-theme-standard .fc-timegrid-col:hover {
                  background-color: rgba(255, 255, 255, 0.06) !important;
                }

                .dark .fc-theme-standard td.fc-day,
                .dark .fc-theme-standard .fc-timegrid-col {
                  background-color: transparent !important;
                }
                
                /* Smooth animations for events */
                .fc-event {
                  transition: all 0.2s ease;
                }
                
                .fc-event:hover {
                  transform: scale(1.02);
                  z-index: 999;
                }
                
                /* Today indicator animation */
                .fc-timegrid-now-indicator-line {
                  animation: pulse 2s ease-in-out infinite;
                }
                
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.5; }
                }
              `}</style>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals with animations */}
      
      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddEventModal && selectedTimeSlot &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

            <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}>

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
              prefilledTimeSlot={selectedTimeSlot} />

            </motion.div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Quick Add Event Modal */}
      <AnimatePresence>
        {showQuickAddModal &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

            <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}>

              <QuickAddEventModal
              isOpen={showQuickAddModal}
              onClose={() => setShowQuickAddModal(false)}
              onAddEvent={handleQuickAddEvent} />

            </motion.div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Edit Event Modal */}
      <AnimatePresence>
        {showEditEventModal && selectedEvent &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

            <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}>

              <EditEventModal
              isOpen={showEditEventModal}
              onClose={() => {
                setShowEditEventModal(false);
                setSelectedEvent(null);
              }}
              event={selectedEvent}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent} />

            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>);

};

// QuickAddEventModal with improved animations
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

    if (new Date(end) <= new Date(start)) {
      alert('La date de fin doit être après la date de début');
      return;
    }

    onAddEvent({
      title: title.trim(),
      start,
      end,
      color,
      notes: notes.trim()
    });

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
  { value: '#6366F1', name: 'Indigo', color: '#6366F1' }];


  const formatTimeDisplay = (timeValue: string) => {
    if (!timeValue) return '';
    const [hours, minutes] = timeValue.split(':');
    return `${hours}h${minutes}`;
  };

  const calculateDuration = () => {
    if (!startDate || !startTime || !endDate || !endTime) return null;

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs % (1000 * 60 * 60) / (1000 * 60));

    if (diffMs <= 0) return "⚠️ Fin avant début";
    if (diffHours === 0) return `${diffMinutes} min`;
    if (diffMinutes === 0) return `${diffHours}h`;
    return `${diffHours}h${diffMinutes}min`;
  };

  return (
    <div className="modal-content bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl h-auto">
      {/* Header */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">

        <h2 className="text-xl font-bold text-primary-900 dark:text-slate-100">Créer un événement</h2>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors">

          <X size={20} />
        </motion.button>
      </motion.div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left column */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-7 space-y-4">

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 !whitespace-pre-line !whitespace-pre-line">Nom de l'événement

              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                placeholder="Nom de l'événement"
                required />

            </div>

            {/* Time planning */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Clock size={16} className="text-primary-600 dark:text-primary-400" />
                Planification
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Start */}
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Début</span>
                    {startTime &&
                    <span className="text-sm font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                        {formatTimeDisplay(startTime)}
                      </span>
                    }
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      required />

                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      required />

                  </div>
                </div>

                {/* End */}
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fin</span>
                    {endTime &&
                    <span className="text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded">
                        {formatTimeDisplay(endTime)}
                      </span>
                    }
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      required />

                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      required />

                  </div>
                </div>
              </div>

              {/* Duration */}
              <AnimatePresence>
                {calculateDuration() &&
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 text-center">

                    <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium">
                      <Clock size={14} />
                      <span>Durée : {calculateDuration()}</span>
                    </div>
                  </motion.div>
                }
              </AnimatePresence>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 !whitespace-pre-line"> Description

              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                placeholder="Description de l'événement (optionnel)" />

            </div>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="col-span-5 space-y-4">

            {/* Color picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 !whitespace-pre-line">Couleur de l'événement

              </label>
              
              <div className="grid grid-cols-4 gap-2 mb-3">
                {colorOptions.map((option, index) =>
                <motion.button
                  key={option.value}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`relative w-full h-12 rounded-lg border-2 transition-all ${
                  color === option.value ?
                  'border-gray-800 dark:border-gray-200 shadow-lg' :
                  'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`
                  }
                  style={{ backgroundColor: option.color }}
                  title={option.name}>

                    <AnimatePresence>
                      {color === option.value &&
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute inset-0 flex items-center justify-center">

                          <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                        </motion.div>
                    }
                    </AnimatePresence>
                  </motion.button>
                )}
              </div>
              
              <div className="flex items-center gap-2 justify-center bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: color }} />

                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {colorOptions.find((opt) => opt.value === color)?.name}
                </span>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 !whitespace-pre-line !whitespace-pre-line">Aperçu</h4>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-3 rounded-lg text-white text-center font-medium shadow-sm"
                style={{ backgroundColor: color }}>

                {title || 'Nom de l\'événement'}
              </motion.div>
              {calculateDuration() &&
              <div className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2">
                  {calculateDuration()}
                </div>
              }
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg transition-all shadow-lg hover:shadow-xl !whitespace-pre-line !font-normal !block !opacity-100 !px-6 !rounded-[15px] !rounded-lg">
                 Valider

              </motion.button>
            </div>
          </motion.div>
        </div>
      </form>
    </div>);

};

export default AgendaPage;
