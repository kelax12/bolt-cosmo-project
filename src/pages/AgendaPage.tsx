import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { useTasks } from '../context/TaskContext';
import { ChevronLeft, ChevronRight, Calendar, Clock, Plus, X, ZoomIn, ZoomOut, Menu } from 'lucide-react';
import TaskSidebar from '../components/TaskSidebar';
import AddEventModal from '../components/AddEventModal';
import EditEventModal from '../components/EditEventModal';
import ColorSettingsModal from '../components/ColorSettingsModal';
import { motion, AnimatePresence } from 'framer-motion';

const AgendaPage: React.FC = () => {
  const { events, addEvent, deleteEvent, updateEvent, categories } = useTasks();
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const [showTaskSidebar, setShowTaskSidebar] = useState(true);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{start: string;end: string;} | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [calendarKey, setCalendarKey] = useState(0);
  const calendarRef = useRef<FullCalendar>(null);
  const [zoomLevel, setZoomLevel] = useState(3);
  const zoomDurations = ['00:05:00', '00:10:00', '00:15:00', '00:30:00', '01:00:00'];

  const getInitialScrollTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const scrollHour = Math.max(0, hour - 4);
    return `${scrollHour.toString().padStart(2, '0')}:00:00`;
  };

  const handleZoomIn = () => {
    if (zoomLevel > 0) {
      setZoomLevel(prev => prev - 1);
      setCalendarKey(prev => prev + 1);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel < zoomDurations.length - 1) {
      setZoomLevel(prev => prev + 1);
      setCalendarKey(prev => prev + 1);
    }
  };

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
          longPressDelay: 50,
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
                categoryName: categories.find(c => c.id === taskData.category)?.name || 'Sans catégorie'
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
  }, [showTaskSidebar, categories]);

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
    return categories.find(cat => cat.id === category)?.color || '#6B7280';
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
      className="h-full flex overflow-hidden"
      style={{ backgroundColor: 'rgb(var(--color-background))' }}>

      {/* Task Sidebar */}
      <AnimatePresence>
        {showTaskSidebar &&
          <motion.div
            initial={{ x: -400, opacity: 0, width: 0 }}
            animate={{ x: 0, opacity: 1, width: 'auto' }}
            exit={{ x: -400, opacity: 0, width: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative z-40 flex overflow-hidden flex-shrink-0"
            onAnimationComplete={() => {
              if (calendarRef.current) {
                calendarRef.current.getApi().updateSize();
              }
            }}>
            <TaskSidebar onClose={() => setShowTaskSidebar(false)} />
          </motion.div>
        }
      </AnimatePresence>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Modern Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="px-4 py-3 border-b"
          style={{ backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))' }}>

          <div className="grid grid-cols-2 gap-2 lg:flex lg:items-center lg:justify-between">
            <div className="contents lg:flex lg:items-center lg:gap-4 lg:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTaskSidebar(!showTaskSidebar)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all shadow-sm col-span-1 lg:w-auto justify-center border ${
                  showTaskSidebar ? 'shadow-md' : ''
                }`}
                style={{
                  backgroundColor: showTaskSidebar ? 'rgb(var(--color-accent))' : 'rgb(var(--color-chip-bg))',
                  borderColor: showTaskSidebar ? 'rgb(var(--color-accent))' : 'rgb(var(--color-chip-border))',
                  color: showTaskSidebar ? 'white' : 'rgb(var(--color-text-primary))'
                }}>
                <Calendar size={18} />
                <span className="font-medium text-sm lg:text-base">Tâches</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddEventModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white shadow-lg shadow-blue-500/25 transform transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 col-span-1 lg:w-auto whitespace-nowrap"
              >
                <Plus size={18} />
                <span className="font-medium text-sm lg:text-base">Nouveau</span>
              </motion.button>
            
              <div className="flex items-center gap-1 col-span-1 lg:w-auto">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => calendarRef.current?.getApi().prev()}
                  className="p-2 rounded-lg transition-colors hover:text-blue-600"
                  style={{ color: 'rgb(var(--color-text-secondary))' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))';
                    e.currentTarget.style.color = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgb(var(--color-text-secondary))';
                  }}>
                  <ChevronLeft size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => calendarRef.current?.getApi().next()}
                  className="p-2 rounded-lg transition-colors hover:text-blue-600"
                  style={{ color: 'rgb(var(--color-text-secondary))' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))';
                    e.currentTarget.style.color = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgb(var(--color-text-secondary))';
                  }}>
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            </div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="contents lg:flex lg:items-center lg:gap-3 lg:w-auto">

              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 col-span-1 lg:mr-2 lg:w-auto justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleZoomIn}
                  disabled={zoomLevel === 0}
                  title="Zoom avant"
                  className={`p-1.5 rounded-md transition-all ${zoomLevel === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white dark:hover:bg-gray-700 shadow-sm'}`}
                  style={{ color: zoomLevel === 0 ? 'rgb(var(--color-text-secondary))' : undefined }}
                  onMouseEnter={(e) => {
                    if (zoomLevel !== 0) {
                      e.currentTarget.style.color = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (zoomLevel !== 0) {
                      e.currentTarget.style.color = 'rgb(var(--color-text-secondary))';
                    }
                  }}>
                  <ZoomIn size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleZoomOut}
                  disabled={zoomLevel === zoomDurations.length - 1}
                  title="Zoom arrière"
                  className={`p-1.5 rounded-md transition-all ${zoomLevel === zoomDurations.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white dark:hover:bg-gray-700 shadow-sm'}`}
                  style={{ color: zoomLevel === zoomDurations.length - 1 ? 'rgb(var(--color-text-secondary))' : undefined }}
                  onMouseEnter={(e) => {
                    if (zoomLevel !== zoomDurations.length - 1) {
                      e.currentTarget.style.color = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (zoomLevel !== zoomDurations.length - 1) {
                      e.currentTarget.style.color = 'rgb(var(--color-text-secondary))';
                    }
                  }}>
                  <ZoomOut size={20} />
                </motion.button>
              </div>

              <div className="flex rounded-lg p-0.5 col-span-2 lg:col-span-1 lg:w-auto" style={{ backgroundColor: 'rgb(var(--color-hover))' }}>
                {['timeGridDay', 'timeGridWeek', 'dayGridMonth'].map((view, index) =>
                  <motion.button
                    key={view}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewChange(view)}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-all flex-1 lg:flex-none ${
                      currentView === view ? 'shadow-sm' : ''
                    }`}
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
          layout
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 p-2 lg:p-6 min-w-0 overflow-hidden">

          <div className="rounded-xl shadow-lg border h-full w-full overflow-hidden" style={{ backgroundColor: 'rgb(var(--calendar-bg))', borderColor: 'rgb(var(--calendar-border))' }}>
            <div className="p-2 lg:p-6 h-full w-full overflow-hidden">
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
                scrollTime={getInitialScrollTime()}
                allDaySlot={false}
                nowIndicator={true}
                eventDisplay="block"
                eventLongPressDelay={50}
                selectLongPressDelay={50}
                dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
                slotLabelFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                }}
                slotDuration={zoomDurations[zoomLevel]}
                slotLabelInterval={zoomLevel === zoomDurations.length - 1 ? "02:00:00" : "01:00:00"}
                snapDuration={zoomDurations[zoomLevel]}
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
                    </div>
                  );
                }}
                dayCellClassNames={() => 'transition-colors'}
                eventClassNames="rounded-lg shadow-sm border-0 cursor-pointer hover:shadow-md transition-all hover:scale-105"
              />

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
                
                .fc-event {
                  transition: all 0.2s ease;
                }
                
                .fc-event:hover {
                  transform: scale(1.02);
                  z-index: 999;
                }
                
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
      <AnimatePresence>
        {showAddEventModal &&
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
                prefilledTimeSlot={selectedTimeSlot || undefined}
              />
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>

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
                onDeleteEvent={handleDeleteEvent}
              />
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>
  );
};

export default AgendaPage;
