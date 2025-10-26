import React from 'react';
import { CheckSquare, Clock, Star, AlertCircle } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const TodayTasks: React.FC = () => {
  const { tasks, toggleComplete, toggleBookmark } = useTasks();
  
  // Tâches prioritaires pour aujourd'hui
  const todayTasks = tasks
    .filter(task => !task.completed)
    .filter(task => {
      const taskDate = new Date(task.deadline);
      const today = new Date();
      return taskDate.toDateString() === today.toDateString() || task.priority <= 2;
    })
    .sort((a, b) => {
      // Trier par favoris puis par priorité
      if (a.bookmarked && !b.bookmarked) return -1;
      if (!a.bookmarked && b.bookmarked) return 1;
      return a.priority - b.priority;
    })
    .slice(0, 5); // Limiter à 5 tâches

  const totalTime = todayTasks.reduce((sum, task) => sum + task.estimatedTime, 0);

  const getCategoryColor = (category: string) => {
    const colors = {
      red: 'bg-red-100 border-red-200',
      blue: 'bg-blue-100 border-blue-200',
      green: 'bg-green-100 border-green-200',
      purple: 'bg-purple-100 border-purple-200',
      orange: 'bg-orange-100 border-orange-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 border-gray-200';
  };

  const getPriorityIcon = (priority: number) => {
    if (priority <= 2) return <AlertCircle size={16} className="text-red-500" />;
    return null;
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-xl">
          <CheckSquare size={24} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tâches prioritaires</h2>
          <p className="text-gray-600 text-sm">
            {todayTasks.length} tâches • {Math.floor(totalTime / 60)}h{totalTime % 60}min
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {todayTasks.map(task => (
          <div 
            key={task.id}
            className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
              task.isCollaborative ? 'collaborative-task' : getCategoryColor(task.category)
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleComplete(task.id)}
                className="flex-shrink-0"
              >
                <CheckSquare size={20} className="text-gray-400 hover:text-green-500" />
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{task.name}</h3>
                  {getPriorityIcon(task.priority)}
                  {task.isCollaborative && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                      Collaboratif
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{task.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-3 h-3 rounded-full bg-${task.category}-500`}></span>
                    <span>P{task.priority}</span>
                  </div>
                  <div className="text-xs">
                    {new Date(task.deadline).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => toggleBookmark(task.id)}
                className="flex-shrink-0"
              >
                <Star 
                  size={18} 
                  className={task.bookmarked ? 'favorite-icon filled' : 'text-gray-400 hover:text-yellow-500'} 
                />
              </button>
            </div>
          </div>
        ))}

        {todayTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CheckSquare size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Aucune tâche prioritaire</p>
            <p className="text-sm">Toutes vos tâches urgentes sont terminées !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayTasks;