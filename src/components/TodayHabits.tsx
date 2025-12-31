import React from 'react';
import { Repeat, Clock, CheckCircle, Circle, Check } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';

const TodayHabits: React.FC = () => {
  const { habits, toggleHabitCompletion } = useTasks();
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString('en-CA');

  const todayHabits = habits.map((habit) => ({
    ...habit,
    completedToday: habit.completions[today] || false
  }));

  const completedCount = todayHabits.filter((h) => h.completedToday).length;
  const totalTime = todayHabits.reduce((sum, habit) =>
  habit.completedToday ? sum + habit.estimatedTime : sum, 0
  );

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800/30">
          <Repeat size={24} className="text-purple-700 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[rgb(var(--color-text-primary))]">Habitudes du jour</h2>
          <p className="text-[rgb(var(--color-text-secondary))] text-sm">
            {completedCount}/{todayHabits.length} complétées • {Math.floor(totalTime / 60)}h{totalTime % 60}min
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {todayHabits.map((habit) =>
        <div
          key={habit.id}
          className={`p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg ${
            habit.completedToday ?
            'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/40 hover:border-blue-400 dark:hover:border-blue-700' :
            'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`
            }
            onClick={(e) => {
              // Only toggle completion if clicking the circle icon area
              if ((e.target as HTMLElement).closest('.completion-toggle')) {
                toggleHabitCompletion(habit.id, today);
              } else {
                // Otherwise navigate to habits page with this habit
                navigate('/habits', { state: { selectedHabitId: habit.id } });
              }
            }}>

              <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 completion-toggle" onClick={(e) => e.stopPropagation()}>
                    <div
                      onClick={() => toggleHabitCompletion(habit.id, today)}
                      className={`h-7 w-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                        habit.completedToday 
                          ? 'bg-blue-600 text-white border-blue-700 dark:bg-blue-500 dark:border-blue-600 shadow-md' 
                          : 'bg-white border-slate-300 dark:bg-slate-800 dark:border-slate-600 text-transparent hover:border-blue-400'
                      }`}
                    >
                      <Check className="h-4 w-4" strokeWidth={4} />
                    </div>
                  </div>
                
                <div className="flex-1">
                  <h3 className={`font-bold ${habit.completedToday ? 'text-blue-800 dark:text-blue-300 line-through' : 'text-[rgb(var(--color-text-primary))]'}`}>
                    {habit.name}
                  </h3>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-sm text-[rgb(var(--color-text-secondary))]">
                    <Clock size={14} />
                    <span>{habit.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-orange-800 dark:text-orange-400 font-medium">
                    <span>🔥</span>
                    <span>{habit.streak} jours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {todayHabits.length === 0 &&
        <div className="text-center py-8 text-[rgb(var(--color-text-muted))]">
            <Repeat size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>Aucune habitude configurée</p>
            <p className="text-sm">Ajoutez des habitudes dans la section dédiée</p>
          </div>
        }
      </div>
    </div>);

};

export default TodayHabits;
