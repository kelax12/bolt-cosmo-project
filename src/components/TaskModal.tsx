import React, { useState, useEffect } from 'react';
import { X, Clock, Users, Search, UserPlus, Save, AlertCircle, CheckCircle, Calendar, Star, Bookmark } from 'lucide-react';
import { Task, useTasks } from '../context/TaskContext';

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (taskData: any) => void;
  isCreating?: boolean;
  showCollaborators?: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onSave, isCreating = false, showCollaborators = false }) => {
  const { updateTask, deleteTask, colorSettings, friends, shareTask, isPremium } = useTasks();
  
  // Form state with validation
  const [formData, setFormData] = useState({
    name: '',
    priority: 3,
    category: 'blue' as const,
    deadline: '',
    estimatedTime: 30,
    completed: false,
    bookmarked: false
  });
  
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [searchUser, setSearchUser] = useState('');
  const [showCollaboratorSection, setShowCollaboratorSection] = useState(showCollaborators);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when task changes
  useEffect(() => {
    if (isOpen && task) {
      setFormData({
        name: task.name,
        priority: task.priority,
        category: task.category,
        deadline: task.deadline ? task.deadline.split('T')[0] : '',
        estimatedTime: task.estimatedTime,
        completed: task.completed,
        bookmarked: task.bookmarked
      });
      setCollaborators(task.collaborators || []);
      setHasChanges(false);
      setErrors({});
    }
  }, [isOpen, task]);

  // Track changes
  useEffect(() => {
    if (!task) return;
    
    const hasFormChanges = 
      formData.name !== task.name ||
      formData.priority !== task.priority ||
      formData.category !== task.category ||
      formData.deadline !== (task.deadline ? task.deadline.split('T')[0] : '') ||
      formData.estimatedTime !== task.estimatedTime ||
      formData.completed !== task.completed ||
      formData.bookmarked !== task.bookmarked ||
      JSON.stringify(collaborators) !== JSON.stringify(task.collaborators || []);
    
    setHasChanges(hasFormChanges);
  }, [formData, collaborators, task]);

  if (!isOpen) return null;

  // Validation rules
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Rule 1: Task name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la tâche est obligatoire';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Le nom ne peut pas dépasser 100 caractères';
    }
    
    // Rule 2: Estimated time validation
    if (formData.estimatedTime < 5) {
      newErrors.estimatedTime = 'Le temps estimé doit être d\'au moins 5 minutes';
    } else if (formData.estimatedTime > 480) {
      newErrors.estimatedTime = 'Le temps estimé ne peut pas dépasser 8 heures (480 minutes)';
    }
    
    // Rule 3: Deadline validation
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        newErrors.deadline = 'La date limite ne peut pas être dans le passé';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isCreating && onSave) {
        // Creating new task
        const newTaskData = {
          ...formData,
          deadline: formData.deadline ? new Date(formData.deadline).toISOString() : new Date().toISOString(),
          isCollaborative: collaborators.length > 0,
          collaborators: collaborators.length > 0 ? collaborators : undefined
        };
        onSave(newTaskData);
      } else {
        // Updating existing task
        const updatedTask: Partial<Task> = {
          ...formData,
          deadline: formData.deadline ? new Date(formData.deadline).toISOString() : task.deadline,
          isCollaborative: collaborators.length > 0,
          collaborators: collaborators.length > 0 ? collaborators : undefined
        };
        
        updateTask(task.id, updatedTask);
        
        // Share with collaborators if any
        if (collaborators.length > 0 && isPremium()) {
          collaborators.forEach(userId => {
            shareTask(task.id, userId, 'editor');
          });
        }
      }
      
      onClose();
    } catch (error) {
      setErrors({ general: 'Erreur lors de la sauvegarde. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.')) {
      setIsLoading(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        deleteTask(task.id);
        onClose();
      } catch (error) {
        setErrors({ general: 'Erreur lors de la suppression. Veuillez réessayer.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment fermer ?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Auto-scroll to collaborators section when showCollaborators is true
  useEffect(() => {
    if (showCollaborators && isOpen) {
      const timer = setTimeout(() => {
        const collaboratorSection = document.querySelector('[data-collaborator-section]');
        if (collaboratorSection) {
          collaboratorSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 300); // Small delay to ensure modal is fully rendered
      
      return () => clearTimeout(timer);
    }
  }, [showCollaborators, isOpen]);

  const toggleCollaborator = (userId: string) => {
    setCollaborators(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const availableFriends = friends || [
    { id: 'user2', name: 'Marie Dupont', email: 'marie@example.com', avatar: '👩‍💼' },
    { id: 'user3', name: 'Jean Martin', email: 'jean@example.com', avatar: '👨‍💻' },
    { id: 'user4', name: 'Sophie Bernard', email: 'sophie@example.com', avatar: '👩‍🔬' },
  ];

  const filteredFriends = availableFriends.filter(friend => 
    friend.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const categoryColors = {
    red: '#EF4444',
    blue: '#3B82F6',
    green: '#10B981',
    purple: '#8B5CF6',
    orange: '#F97316'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
      <div className="rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-colors" style={{ backgroundColor: 'rgb(var(--color-surface))' }}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-blue-50 dark:from-blue-900/20 to-purple-50 dark:to-purple-900/20 transition-colors" style={{ borderColor: 'rgb(var(--color-border))' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <CheckCircle size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 id="task-modal-title" className="text-xl font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>
              {isCreating ? 'Ajouter une tâche' : 'Modifier la tâche'}
            </h2>
            {hasChanges && (
              <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-sm">
                <AlertCircle size={16} />
                <span>Modifications non sauvegardées</span>
              </div>
            )}
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'rgb(var(--color-text-muted))' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgb(var(--color-text-primary))';
              e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgb(var(--color-text-muted))';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Fermer la modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Error display */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle size={16} />
                <span className="font-medium">{errors.general}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Main Information */}
            <div className="space-y-6">
              
              {/* Task Name */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                  📝 Nom de la tâche *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.name ? 'border-red-300 dark:border-red-600' : ''
                  }`}
                  style={{
                    backgroundColor: 'rgb(var(--color-surface))',
                    color: 'rgb(var(--color-text-primary))',
                    borderColor: errors.name ? 'rgb(var(--color-error))' : 'rgb(var(--color-border))'
                  }}
                  placeholder="Entrez le nom de la tâche"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <div id="name-error" className="flex items-center gap-2 mt-1 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle size={14} />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Priority and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                    🎯 Priorité
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', Number(e.target.value))}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    style={{
                      backgroundColor: 'rgb(var(--color-surface))',
                      color: 'rgb(var(--color-text-primary))',
                      borderColor: 'rgb(var(--color-border))'
                    }}
                  >
                    <option value="1">1 (Très haute)</option>
                    <option value="2">2 (Haute)</option>
                    <option value="3">3 (Moyenne)</option>
                    <option value="4">4 (Basse)</option>
                    <option value="5">5 (Très basse)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                    🏷️ Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    style={{
                      backgroundColor: 'rgb(var(--color-surface))',
                      color: 'rgb(var(--color-text-primary))',
                      borderColor: 'rgb(var(--color-border))'
                    }}
                  >
                    {Object.entries(colorSettings).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: categoryColors[formData.category] }}
                    />
                    <span className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{colorSettings[formData.category]}</span>
                  </div>
                </div>
              </div>

              {/* Deadline and Estimated Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                    📅 Date limite
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.deadline ? 'border-red-300 dark:border-red-600' : ''
                    }`}
                    style={{
                      backgroundColor: 'rgb(var(--color-surface))',
                      color: 'rgb(var(--color-text-primary))',
                      borderColor: errors.deadline ? 'rgb(var(--color-error))' : 'rgb(var(--color-border))'
                    }}
                    aria-describedby={errors.deadline ? 'deadline-error' : undefined}
                  />
                  {errors.deadline && (
                    <div id="deadline-error" className="flex items-center gap-2 mt-1 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle size={14} />
                      {errors.deadline}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                    ⏱️ Temps estimé (min)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedTime}
                    onChange={(e) => handleInputChange('estimatedTime', Number(e.target.value))}
                    min="5"
                    max="480"
                    step="5"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.estimatedTime ? 'border-red-300 dark:border-red-600' : ''
                    }`}
                    style={{
                      backgroundColor: 'rgb(var(--color-surface))',
                      color: 'rgb(var(--color-text-primary))',
                      borderColor: errors.estimatedTime ? 'rgb(var(--color-error))' : 'rgb(var(--color-border))'
                    }}
                    aria-describedby={errors.estimatedTime ? 'time-error' : undefined}
                  />
                  {errors.estimatedTime && (
                    <div id="time-error" className="flex items-center gap-2 mt-1 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle size={14} />
                      {errors.estimatedTime}
                    </div>
                  )}
                </div>
              </div>

              {/* Status toggles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg border transition-colors" style={{
                  backgroundColor: 'rgb(var(--color-hover))',
                  borderColor: 'rgb(var(--color-border))'
                }}>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className={formData.completed ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'} />
                    <span className="font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>Tâche complétée</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.completed}
                      onChange={(e) => handleInputChange('completed', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border transition-colors" style={{
                  backgroundColor: 'rgb(var(--color-hover))',
                  borderColor: 'rgb(var(--color-border))'
                }}>
                  <div className="flex items-center gap-3">
                    <Bookmark size={20} className={formData.bookmarked ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500'} />
                    <span className="font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>Favori</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.bookmarked}
                      onChange={(e) => handleInputChange('bookmarked', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Collaborators and Actions */}
            <div className="space-y-6">
              
              {/* Collaborators Section */}
              <div data-collaborator-section>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                    👥 Collaborateurs
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCollaboratorSection(!showCollaboratorSection)}
                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <Users size={16} />
                    <span>{showCollaboratorSection ? 'Masquer' : 'Gérer'}</span>
                  </button>
                </div>

                {showCollaboratorSection && (
                  <div className="rounded-lg p-4 border transition-colors" style={{
                    backgroundColor: 'rgb(var(--color-hover))',
                    borderColor: 'rgb(var(--color-border))'
                  }}>
                    {!isPremium() ? (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Users size={24} className="text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <p className="text-sm mb-3" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                          Fonctionnalité Premium requise
                        </p>
                        <button className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full transition-colors">
                          Débloquer Premium
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Search users */}
                        <div className="relative mb-4">
                          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                          <input
                            type="text"
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                            placeholder="Rechercher un utilisateur..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                            style={{
                              backgroundColor: 'rgb(var(--color-surface))',
                              color: 'rgb(var(--color-text-primary))',
                              borderColor: 'rgb(var(--color-border))'
                            }}
                          />
                        </div>

                        {/* Friends list */}
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {filteredFriends.map(friend => (
                            <div 
                              key={friend.id}
                              className="flex items-center justify-between p-3 rounded-lg border transition-colors"
                              style={{
                                backgroundColor: 'rgb(var(--color-surface))',
                                borderColor: 'rgb(var(--color-border))'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgb(var(--color-text-muted))'}
                              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgb(var(--color-border))'}
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-2xl">{friend.avatar}</div>
                                <div>
                                  <div className="font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>{friend.name}</div>
                                  <div className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{friend.email}</div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleCollaborator(friend.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  collaborators.includes(friend.id)
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                              >
                                {collaborators.includes(friend.id) ? (
                                  <X size={16} />
                                ) : (
                                  <UserPlus size={16} />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Selected collaborators */}
                        {collaborators.length > 0 && (
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgb(var(--color-border))' }}>
                            <div className="text-sm font-medium mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                              Collaborateurs sélectionnés ({collaborators.length})
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {collaborators.map(userId => {
                                const friend = availableFriends.find(f => f.id === userId);
                                return friend ? (
                                  <div 
                                    key={userId}
                                    className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                                  >
                                    <span>{friend.avatar}</span>
                                    <span>{friend.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => toggleCollaborator(userId)}
                                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Task Preview */}
              <div className="p-4 rounded-lg border transition-colors" style={{
                backgroundColor: 'rgb(var(--color-hover))',
                borderColor: 'rgb(var(--color-border))'
              }}>
                <h4 className="text-sm font-semibold mb-3" style={{ color: 'rgb(var(--color-text-secondary))' }}>👁️ Aperçu de la tâche</h4>
                <div className="p-4 rounded-lg border transition-colors" style={{
                  backgroundColor: 'rgb(var(--color-surface))',
                  borderColor: 'rgb(var(--color-border))'
                }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: categoryColors[formData.category] }}
                    />
                    <span className="font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>
                      {formData.name || 'Nom de la tâche'}
                    </span>
                    {formData.bookmarked && <Star size={16} className="text-yellow-500" />}
                  </div>
                  <div className="flex items-center gap-4 text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                    <span>Priorité {formData.priority}</span>
                    <span>{formData.estimatedTime} min</span>
                    {formData.completed && <span className="text-green-600 dark:text-green-400">✓ Complétée</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-8 border-t mt-8" style={{ borderColor: 'rgb(var(--color-border))' }}>
            {!isCreating && (
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors border border-red-200 dark:border-red-800 disabled:opacity-50"
              >
                <X size={16} />
                Supprimer
              </button>
            )}
            
            {isCreating && <div></div>}
            
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: 'rgb(var(--color-hover))',
                  color: 'rgb(var(--color-text-secondary))'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.backgroundColor = 'rgb(var(--color-active))';
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))';
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading || !hasChanges || Object.keys(errors).length > 0}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {isCreating ? 'Créer la tâche' : 'Sauvegarder'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
