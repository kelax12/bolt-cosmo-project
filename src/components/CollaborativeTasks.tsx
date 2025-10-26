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
          <div className="p-4 bg-yellow-100 rounded-2xl inline-block mb-4">
            <Lock size={32} className="text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tâches collaboratives</h2>
          <p className="text-gray-600 mb-6">
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
          <div className="p-2 bg-blue-100 rounded-xl">
            <Users size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Tâches collaboratives</h2>
            <p className="text-gray-600 text-sm">{collaborativeTasks.length} tâches partagées</p>
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
  <div className="card p-6">
                <h3 className="font-bold text-gray-900">{task.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span>Partagé par {task.sharedBy}</span>
                  <span className="capitalize">{task.permissions}</span>
                  <span>{task.collaborators?.length} collaborateurs</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {task.collaborators?.slice(0, 3).map((collaborator, index) => (
                  <div 
                    key={index}
                    className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold"
                  >
                    {collaborator.charAt(0).toUpperCase()}
                  </div>
                ))}
                {(task.collaborators?.length || 0) > 3 && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                    +{(task.collaborators?.length || 0) - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {collaborativeTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Aucune tâche collaborative</p>
            <p className="text-sm">Commencez à partager des tâches avec votre équipe</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborativeTasks;