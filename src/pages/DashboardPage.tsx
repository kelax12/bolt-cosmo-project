import React from 'react';
import { Clock, Target, CheckSquare, TrendingUp } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import DashboardChart from '../components/DashboardChart';
import TodayHabits from '../components/TodayHabits';
import TodayTasks from '../components/TodayTasks';
import CollaborativeTasks from '../components/CollaborativeTasks';
import ActiveOKRs from '../components/ActiveOKRs';

const DashboardPage: React.FC = () => {
  const { user, tasks, habits, okrs, isPremium } = useTasks();

  if (!user) return null;

  // Calculer les statistiques du jour
  const today = new Date().toISOString().split('T')[0];
  const todayHabits = habits.filter(habit => habit.completions[today]);
  const todayTasks = tasks.filter(task => 
    !task.completed && 
    new Date(task.deadline).toDateString() === new Date().toDateString()
  );
  
  const totalHabitsTime = todayHabits.reduce((sum, habit) => sum + habit.estimatedTime, 0);
  const totalTasksTime = todayTasks.reduce((sum, task) => sum + task.estimatedTime, 0);
  const totalWorkTime = totalHabitsTime + totalTasksTime;

  const completedTasksToday = tasks.filter(task => 
    task.completed && 
    task.completedAt &&
    new Date(task.completedAt).toDateString() === new Date().toDateString()
  ).length;

  const activeOKRs = okrs.filter(okr => !okr.completed);

  return (
    <div className="p-8 space-y-8">
      {/* Header avec salutation */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Bonjour, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-600 text-lg">
            Voici votre tableau de bord pour aujourd'hui
          </p>
        </div>
        
        {/* Résumé du temps */}
        <div className="card p-8 min-w-[320px]">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">📊 Temps estimé aujourd'hui</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Habitudes</span>
              <span className="font-semibold text-blue-600">{Math.floor(totalHabitsTime / 60)}h{totalHabitsTime % 60}min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Tâches urgentes</span>
              <span className="font-semibold text-orange-600">{Math.floor(totalTasksTime / 60)}h{totalTasksTime % 60}min</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="font-bold text-slate-900 text-lg">{Math.floor(totalWorkTime / 60)}h{totalWorkTime % 60}min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="card p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <CheckSquare size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Tâches complétées</p>
              <p className="text-3xl font-bold text-slate-900">{completedTasksToday}</p>
              <p className="text-xs text-blue-600">Aujourd'hui</p>
            </div>
          </div>
        </div>

        <div className="card p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Target size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">OKR actifs</p>
              <p className="text-3xl font-bold text-slate-900">{activeOKRs.length}</p>
              <p className="text-xs text-green-600">En cours</p>
            </div>
          </div>
        </div>

        <div className="card p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Clock size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Habitudes</p>
              <p className="text-3xl font-bold text-slate-900">{todayHabits.length}</p>
              <p className="text-xs text-purple-600">Réalisées</p>
            </div>
          </div>
        </div>

        <div className="card p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <TrendingUp size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Productivité</p>
              <p className="text-3xl font-bold text-slate-900">+12%</p>
              <p className="text-xs text-orange-600">Cette semaine</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal en grille */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne gauche - Graphique */}
        <div className="lg:col-span-2">
          <DashboardChart />
        </div>
        
        {/* Colonne droite - Habitudes du jour */}
        <div>
          <TodayHabits />
        </div>
      </div>

      {/* Deuxième rangée */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* OKR en cours */}
        <ActiveOKRs />
        
        {/* Mini To-Do List du jour */}
        <TodayTasks />
      </div>

      {/* Section Tâches collaboratives */}
      <CollaborativeTasks />
    </div>
  );
};

export default DashboardPage;
