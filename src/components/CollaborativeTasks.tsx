import React from 'react';
import { Users, Lock, Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const CollaborativeTasks: React.FC = () => {
  const { tasks, isPremium } = useTasks();
  
  const premium = isPremium();
  const collaborativeTasks = tasks.filter(task => task.isCollaborative);

  if (!premium) {
    return (
      <div className="neomorphic p-8">
        <div className="text-center">
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl inline-block mb-4">
            <Lock size={32} className="text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">Tâches collaboratives</h2>
          <p className="text-[rgb(var(--color-text-secondary))] mb-6">
            Débloquez Premium pour accéder aux tâches collaboratives et travailler en équipe
          </p>
          <button className="btn-primary">
            <Plus size={20} />
            <span>Débloquer Premium</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
            <Users size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[rgb(var(--color-text-primary))]">Tâches collaboratives</h2>
            <p className="text-[rgb(var(--color-text-secondary))] text-sm">{collaborativeTasks.length} tâches partagées</p>
          </div>
        </div>
        
        <button className="btn-primary">
          <Plus size={20} />
          <span>Partager une tâche</span>
        </button>
      </div>

      <div className="space-y-4">
        {collaborativeTasks.map(task => (
          <div key={task.id} className="collaborative-task p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[rgb(var(--color-text-primary))]">{task.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
                  <span>Partagé par {task.sharedBy}</span>
                  <span className="capitalize">{task.permissions}</span>
                  <span>{task.collaborators?.length} collaborateurs</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {task.collaborators?.slice(0, 3).map((collaborator, index) => (
                  <div 
                    key={index}
                    className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-gray-800 dark:text-gray-200"
                  >
                    {collaborator.charAt(0).toUpperCase()}
                  </div>
                ))}
                {(task.collaborators?.length || 0) > 3 && (
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                    +{(task.collaborators?.length || 0) - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {collaborativeTasks.length === 0 && (
          <div className="text-center py-8 text-[rgb(var(--color-text-muted))]">
            <Users size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>Aucune tâche collaborative</p>
            <p className="text-sm">Commencez à partager des tâches avec votre équipe</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborativeTasks;
