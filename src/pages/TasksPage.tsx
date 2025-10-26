import React, { useState } from 'react';
import TaskTable from '../components/TaskTable';
import TaskFilter from '../components/TaskFilter';
import AddTaskForm from '../components/AddTaskForm';
import TasksSummary from '../components/TasksSummary';
import DeadlineCalendar from '../components/DeadlineCalendar';
import ListManager from '../components/ListManager';
import { useTasks } from '../context/TaskContext';
import { CalendarDays, List, X } from 'lucide-react';

const TasksPage: React.FC = () => {
  const { tasks, lists } = useTasks();
  const [filter, setFilter] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [showDeadlineCalendar, setShowDeadlineCalendar] = useState(false);
  const [showListManager, setShowListManager] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  
  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleShowCompletedChange = (show: boolean) => {
    setShowCompleted(show);
  };

  const handleListSelect = (listId: string) => {
    setSelectedListId(selectedListId === listId ? null : listId);
  };

  const clearListFilter = () => {
    setSelectedListId(null);
  };

  // Filter tasks based on completion status and selected list
  let filteredTasks = showCompleted 
    ? tasks.filter(task => task.completed)
    : tasks.filter(task => !task.completed);

  // If a list is selected, filter tasks by that list
  if (selectedListId) {
    const selectedList = lists.find(list => list.id === selectedListId);
    if (selectedList) {
      filteredTasks = filteredTasks.filter(task => selectedList.taskIds.includes(task.id));
    }
  }

  const selectedList = selectedListId ? lists.find(list => list.id === selectedListId) : null;

  const colorOptions = [
    { value: 'blue', color: '#3B82F6', name: 'Bleu' },
    { value: 'red', color: '#EF4444', name: 'Rouge' },
    { value: 'green', color: '#10B981', name: 'Vert' },
    { value: 'purple', color: '#8B5CF6', name: 'Violet' },
    { value: 'orange', color: '#F97316', name: 'Orange' },
    { value: 'yellow', color: '#F59E0B', name: 'Jaune' },
    { value: 'pink', color: '#EC4899', name: 'Rose' },
    { value: 'indigo', color: '#6366F1', name: 'Indigo' },
  ];

  return (
    <div className="p-8">
      <div className="flex flex-col gap-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">To do list</h1>
            <p className="text-slate-600">Gérez vos tâches efficacement</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowListManager(!showListManager)}
              className="flex items-center gap-2 text-slate-600 border border-slate-300 rounded-lg px-4 py-2 hover:bg-slate-50 transition-colors"
            >
              <List size={20} />
              <span>Gérer les listes</span>
            </button>
            <button 
              onClick={() => setShowDeadlineCalendar(!showDeadlineCalendar)}
              className="flex items-center gap-2 text-slate-600 border border-slate-300 rounded-lg px-4 py-2 hover:bg-slate-50 transition-colors"
            >
              <CalendarDays size={20} />
              <span>Calendrier des deadlines</span>
            </button>
          </div>
        </header>

        {showListManager && (
          <ListManager />
        )}

        {showDeadlineCalendar && (
          <DeadlineCalendar />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="card p-6">
              {/* Quick List Access - Only show when not viewing completed tasks and not showing add form */}
              {!showCompleted && !showAddTaskForm && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Accès rapide aux listes</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={clearListFilter}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !selectedListId
                          ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      Toutes les tâches
                    </button>
                    {lists.map(list => {
                      const colorOption = colorOptions.find(c => c.value === list.color);
                      const isSelected = selectedListId === list.id;
                      
                      return (
                        <button
                          key={list.id}
                          onClick={() => handleListSelect(list.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                            isSelected
                              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-600'
                          }`}
                        >
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: colorOption?.color || '#3B82F6' }}
                          />
                          <span>{list.name}</span>
                          <span className="text-xs bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                            {list.taskIds.filter(taskId => {
                              const task = tasks.find(t => t.id === taskId);
                              return task && !task.completed;
                            }).length}
                          </span>
                          {isSelected && (
                            <X size={14} className="ml-1 hover:text-red-500 dark:hover:text-red-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  {selectedList && (
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: colorOptions.find(c => c.value === selectedList.color)?.color || '#3B82F6' }}
                          />
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            Liste active : {selectedList.name}
                          </span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            ({filteredTasks.length} tâche{filteredTasks.length !== 1 ? 's' : ''})
                          </span>
                        </div>
                        <button
                          onClick={clearListFilter}
                          className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1"
                          title="Afficher toutes les tâches"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Filter and Add Task - Hide when showing add form */}
              {!showAddTaskForm && (
                <div className="flex justify-between items-center mb-8">
                  <TaskFilter 
                    onFilterChange={handleFilterChange} 
                    currentFilter={filter}
                    showCompleted={showCompleted}
                    onShowCompletedChange={handleShowCompletedChange}
                  />
                  {!showCompleted && (
                    <AddTaskForm 
                      onFormToggle={setShowAddTaskForm}
                    />
                  )}
                </div>
              )}

              {/* Add Task Form - Show when toggled */}
              {showAddTaskForm && (
                <div className="mb-8">
                  <AddTaskForm 
                    onFormToggle={setShowAddTaskForm}
                    expanded={true}
                  />
                </div>
              )}
              
              <TaskTable 
                tasks={filteredTasks}
                sortField={filter}
                showCompleted={showCompleted}
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <TasksSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;