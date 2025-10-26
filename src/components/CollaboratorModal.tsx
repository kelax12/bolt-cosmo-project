import React, { useState } from 'react';
import { X, UserPlus, Trash2, Users, Mail, Search } from 'lucide-react';
import { Task, Collaborator } from '../types/Task';
import { useTasks } from '../context/TaskContext';

interface CollaboratorModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const CollaboratorModal: React.FC<CollaboratorModalProps> = ({ 
  task, 
  isOpen, 
  onClose 
}) => {
  const { updateTask, collaborators } = useTasks();
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handleAddCollaborator = async () => {
    if (!newCollaboratorEmail.trim()) return;

    setIsAddingCollaborator(true);

    try {
      // Vérifier si le collaborateur existe déjà dans la base
      let collaborator = collaborators.find(c => c.email === newCollaboratorEmail.trim());
      
      if (!collaborator) {
        // Créer un nouveau collaborateur
        const emailName = newCollaboratorEmail.split('@')[0];
        collaborator = {
          id: Date.now().toString(),
          name: emailName.charAt(0).toUpperCase() + emailName.slice(1),
          email: newCollaboratorEmail.trim(),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${newCollaboratorEmail.trim()}&backgroundColor=3B82F6&textColor=ffffff`
        };
      }

      // Vérifier si le collaborateur n'est pas déjà assigné à cette tâche
      if (!task.collaborators?.some(c => c.id === collaborator!.id)) {
        const updatedCollaborators = [...(task.collaborators || []), collaborator];
        updateTask(task.id, { collaborators: updatedCollaborators });
      }

      setNewCollaboratorEmail('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du collaborateur:', error);
    } finally {
      setIsAddingCollaborator(false);
    }
  };

  const handleRemoveCollaborator = (collaboratorId: string) => {
    const collaboratorToRemove = task.collaborators?.find(c => c.id === collaboratorId);
    
    if (collaboratorToRemove && window.confirm(`Êtes-vous sûr de vouloir retirer ${collaboratorToRemove.name} de cette tâche ?`)) {
      const updatedCollaborators = task.collaborators?.filter(c => c.id !== collaboratorId) || [];
      updateTask(task.id, { collaborators: updatedCollaborators });
    }
  };

  const handleAddExistingCollaborator = (collaborator: Collaborator) => {
    if (!task.collaborators?.some(c => c.id === collaborator.id)) {
      const updatedCollaborators = [...(task.collaborators || []), collaborator];
      updateTask(task.id, { collaborators: updatedCollaborators });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAddingCollaborator) {
      handleAddCollaborator();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canAddCollaborator = newCollaboratorEmail.trim() && 
                            isValidEmail(newCollaboratorEmail.trim()) && 
                            !task.collaborators?.some(c => c.email === newCollaboratorEmail.trim());

  // Filtrer les collaborateurs disponibles (non assignés à cette tâche)
  const availableCollaborators = collaborators.filter(c => 
    !task.collaborators?.some(tc => tc.id === c.id) &&
    (searchTerm === '' || 
     c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Gérer les collaborateurs
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Tâche : {task.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Current Collaborators */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                Collaborateurs assignés
              </h3>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-sm font-medium">
                {task.collaborators?.length || 0}
              </span>
            </div>
            
            {task.collaborators && task.collaborators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {task.collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={collaborator.avatar}
                        alt={collaborator.name}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {collaborator.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                          <Mail size={12} />
                          <span>{collaborator.email}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Retirer le collaborateur"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Aucun collaborateur assigné à cette tâche
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                  Ajoutez des collaborateurs pour travailler en équipe
                </p>
              </div>
            )}
          </div>

          {/* Add New Collaborator by Email */}
          <div className="mb-8 border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              Ajouter par email
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={newCollaboratorEmail}
                  onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="exemple@email.com"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  disabled={isAddingCollaborator}
                />
                {newCollaboratorEmail && !isValidEmail(newCollaboratorEmail) && (
                  <p className="text-red-500 text-xs mt-1">
                    Veuillez entrer une adresse email valide
                  </p>
                )}
                {newCollaboratorEmail && task.collaborators?.some(c => c.email === newCollaboratorEmail.trim()) && (
                  <p className="text-orange-500 text-xs mt-1">
                    Ce collaborateur est déjà assigné à cette tâche
                  </p>
                )}
              </div>
              
              <button
                onClick={handleAddCollaborator}
                disabled={!canAddCollaborator || isAddingCollaborator}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {isAddingCollaborator ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Ajout en cours...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Ajouter le collaborateur</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Add Existing Collaborators */}
          {availableCollaborators.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                Collaborateurs disponibles
              </h3>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un collaborateur..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {availableCollaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={collaborator.avatar}
                        alt={collaborator.name}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {collaborator.name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {collaborator.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddExistingCollaborator(collaborator)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      title="Ajouter à cette tâche"
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 font-medium transition-colors"
          >
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorModal;