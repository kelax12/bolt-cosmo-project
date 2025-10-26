import React from 'react';
import { Repeat, Clock, CheckCircle, Circle } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const TodayHabits: React.FC = () => {
  const { habits, toggleHabitCompletion } = useTasks();
  
  const today = new Date().toISOString().split('T')[0];
  
  const todayHabits = habits.map(habit => ({
    ...habit,
    completedToday: habit.completions[today] || false
  }));

  const completedCount = todayHabits.filter(h => h.completedToday).length;
  const totalTime = todayHabits.reduce((sum, habit) => 
    habit.completedToday ? sum + habit.estimatedTime : sum, 0
  );

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-xl">
          <Repeat size={24} className="text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Habitudes du jour</h2>
          <p className="text-gray-600 text-sm">
            {completedCount}/{todayHabits.length} complétées • {Math.floor(totalTime / 60)}h{totalTime % 60}min
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {todayHabits.map(habit => (
          <div 
            key={habit.id}
            className={`p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
              habit.completedToday 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => toggleHabitCompletion(habit.id, today)}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {habit.completedToday ? (
                  <CheckCircle size={24} className="text-green-500" />
                ) : (
                  <Circle size={24} className="text-gray-400" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className={`font-bold ${habit.completedToday ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                  {habit.name}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock size={14} />
                    <span>{habit.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-orange-600">
                    <span>🔥</span>
                    <span>{habit.streak} jours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {todayHabits.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Repeat size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Aucune habitude configurée</p>
            <p className="text-sm">Ajoutez des habitudes dans la section dédiée</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayHabits;