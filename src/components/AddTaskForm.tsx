import React, { useEffect, useState } from 'react';
import { Plus, X, Users, Search, UserPlus, AlertCircle, CheckCircle, Bookmark, Mail, List, Calendar } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useTasks } from '../context/TaskContext';
import CollaboratorItem from './CollaboratorItem';

type AddTaskFormProps = {
  onFormToggle?: (isOpen: boolean) => void;
  expanded?: boolean;
  initialData?: {
    name?: string;
    estimatedTime?: number;
    category?: string;
    priority?: number;
    isFromOKR?: boolean;
  };
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onFormToggle, expanded = false, initialData }) => {
  const { addTask, colorSettings, categories, friends, shareTask, isPremium, lists, addTaskToList } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(expanded);
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    priority: initialData?.priority || 0,
    category: initialData?.category || '',
    deadline: '',
    estimatedTime: initialData?.estimatedTime || 0,
    completed: false,
    bookmarked: false,
    isFromOKR: initialData?.isFromOKR || false
  });

  const [okrFields, setOkrFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsFormOpen(expanded);
  }, [expanded]);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        name: initialData.name || prev.name,
        estimatedTime: initialData.estimatedTime || prev.estimatedTime,
        category: initialData.category || prev.category,
        priority: initialData.priority || prev.priority,
        isFromOKR: initialData.isFromOKR ?? prev.isFromOKR
      }));
      setHasChanges(true);

      if (initialData.isFromOKR) {
        setOkrFields({
          name: !!initialData.name,
          category: !!initialData.category,
          estimatedTime: !!initialData.estimatedTime,
        });
      } else {
        setOkrFields({});
      }
    }
  }, [initialData]);

  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [searchUser, setSearchUser] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [showCollaboratorSection, setShowCollaboratorSection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string;}>({});
  const [hasChanges, setHasChanges] = useState(false);

  const getCategoryColor = (id: string) => {
    return categories.find(cat => cat.id === id)?.color || '#9CA3AF';
  };

  const filteredFriends = (friends || []).filter((friend) =>
    !collaborators.includes(friend.id) && (
      friend.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchUser.toLowerCase())
    )
  );

  const displayInfo = (id: string) => {
    const friend = friends?.find((f) => f.id === id);
    if (friend) return { name: friend.name, email: friend.email, avatar: friend.avatar };
    if (emailRegex.test(id)) return { name: id.split('@')[0], email: id, avatar: undefined };
    return { name: id, email: undefined, avatar: undefined };
  };

  const handleAddEmail = () => {
    const value = emailInput.trim();
    if (!value || collaborators.includes(value)) {
      setEmailInput('');
      return;
    }
    setCollaborators([...collaborators, value]);
    setEmailInput('');
    setHasChanges(true);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string;} = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom de la tâche est obligatoire';
    else if (formData.name.trim().length < 3) newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    
    if (formData.estimatedTime === '' || formData.estimatedTime === null) newErrors.estimatedTime = 'Le temps estimé est obligatoire';
    else if (isNaN(Number(formData.estimatedTime)) || Number(formData.estimatedTime) < 0) newErrors.estimatedTime = 'Veuillez entrer un nombre valide';
    
    if (formData.priority === 0) newErrors.priority = 'Veuillez choisir une priorité';
    if (!formData.category) newErrors.category = 'Veuillez choisir une catégorie';
    
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) newErrors.deadline = 'La date limite ne peut pas être dans le passé';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    const nameValid = formData.name.length >= 1 && formData.name.length <= 100;
    const timeValid = formData.estimatedTime !== '' && formData.estimatedTime !== null && !isNaN(Number(formData.estimatedTime)) && Number(formData.estimatedTime) > 0;
    const priorityValid = formData.priority !== 0;
    const categoryValid = !!formData.category;
    return nameValid && timeValid && priorityValid && categoryValid;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (okrFields[field]) setOkrFields(prev => ({ ...prev, [field]: false }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleFormToggle = (open: boolean) => {
    setIsFormOpen(open);
    onFormToggle?.(open);
    if (!open) resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '', priority: 0, category: '', deadline: '', estimatedTime: 0, completed: false, bookmarked: false, isFromOKR: false
    });
    setCollaborators([]);
    setSelectedListIds([]);
    setSearchUser('');
    setShowCollaboratorSection(false);
    setErrors({});
    setHasChanges(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const newTask = {
        id: Date.now().toString(),
        name: formData.name,
        priority: formData.priority,
        category: formData.category,
        deadline: formData.deadline || new Date().toISOString(),
        estimatedTime: formData.estimatedTime,
        createdAt: new Date().toISOString(),
        bookmarked: formData.bookmarked,
        completed: formData.completed,
        isCollaborative: collaborators.length > 0,
        collaborators: collaborators,
        permissions: 'responsible' as const
      };
      addTask(newTask);
      selectedListIds.forEach(listId => addTaskToList(newTask.id, listId));
      if (collaborators.length > 0 && isPremium()) {
        collaborators.forEach((userId) => shareTask(newTask.id, userId, 'editor'));
      }
      handleFormToggle(false);
    } catch (error) {
      setErrors({ general: 'Erreur lors de la création. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCollaborator = (userId: string) => {
    setCollaborators((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
    setHasChanges(true);
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={handleFormToggle}>
      <DialogContent showCloseButton={false} className="p-0 border-0 bg-transparent shadow-none sm:max-w-4xl w-full max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="rounded-2xl shadow-2xl w-full transition-colors overflow-hidden" style={{ backgroundColor: 'rgb(var(--color-surface))' }}>
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-blue-50 dark:from-blue-900/20 to-purple-50 dark:to-purple-900/20 transition-colors" style={{ borderColor: 'rgb(var(--color-border))' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <CheckCircle size={24} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>Créer une nouvelle tâche</h2>
              {hasChanges && (
                <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-sm">
                  <AlertCircle size={16} aria-hidden="true" />
                  <span>Non sauvegardé</span>
                </div>
              )}
            </div>
            <button onClick={() => handleFormToggle(false)} className="p-2 rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-slate-800" style={{ color: 'rgb(var(--color-text-muted))' }} aria-label="Fermer">
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle size={16} />
                <span className="font-medium">{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>Nom de la tâche *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} ${okrFields.name ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-transparent'}`}
                      style={{ color: 'rgb(var(--color-text-primary))' }}
                      placeholder="Qu'y a-t-il à faire ?"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>Priorité</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => handleInputChange('priority', Number(e.target.value))}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        style={{ color: 'rgb(var(--color-text-primary))' }}
                      >
                        <option value="0" disabled>Choisir...</option>
                        <option value="1">1 (Très haute)</option>
                        <option value="2">2 (Haute)</option>
                        <option value="3">3 (Moyenne)</option>
                        <option value="4">4 (Basse)</option>
                        <option value="5">5 (Très basse)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>Catégorie</label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        style={{ color: 'rgb(var(--color-text-primary))' }}
                      >
                        <option value="" disabled>Choisir...</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>Échéance</label>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        style={{ color: 'rgb(var(--color-text-primary))' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>Temps (min)</label>
                      <input
                        type="number"
                        value={formData.estimatedTime || ''}
                        onChange={(e) => handleInputChange('estimatedTime', Number(e.target.value))}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        style={{ color: 'rgb(var(--color-text-primary))' }}
                      />
                    </div>
                  </div>

                  {/* Favori & Listes */}
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <Bookmark size={20} className={formData.bookmarked ? 'text-yellow-500' : 'text-slate-400'} />
                        <span className="font-medium text-sm" style={{ color: 'rgb(var(--color-text-primary))' }}>Marquer comme favori</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInputChange('bookmarked', !formData.bookmarked)}
                        className={`w-12 h-6 rounded-full transition-all relative ${formData.bookmarked ? 'bg-yellow-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.bookmarked ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                      <div className="flex-shrink-0 pt-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all shadow-sm">
                              <List size={20} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl">
                            {lists.length === 0 && <div className="p-3 text-xs text-center text-slate-500">Aucune liste</div>}
                            {lists.map(list => (
                              <DropdownMenuCheckboxItem
                                key={list.id}
                                checked={selectedListIds.includes(list.id)}
                                onCheckedChange={(checked) => {
                                  setSelectedListIds(checked ? [...selectedListIds, list.id] : selectedListIds.filter(id => id !== list.id));
                                  setHasChanges(true);
                                }}
                              >
                                {list.name}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex-1 flex flex-wrap gap-2 min-h-[40px] items-center">
                        {selectedListIds.length === 0 ? (
                          <span className="text-xs text-slate-400">Ajouter à une liste...</span>
                        ) : (
                          selectedListIds.map(id => {
                            const list = lists.find(l => l.id === id);
                            if (!list) return null;
                            return (
                              <div key={id} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                                <span className="text-xs font-semibold">{list.name}</span>
                                <button type="button" onClick={() => setSelectedListIds(selectedListIds.filter(lid => lid !== id))} className="hover:text-red-500 transition-colors">
                                  <X size={12} strokeWidth={3} />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-semibold" style={{ color: 'rgb(var(--color-text-secondary))' }}>Collaborateurs</label>
                      <button type="button" onClick={() => setShowCollaboratorSection(!showCollaboratorSection)} className="text-xs text-blue-600 flex items-center gap-1 font-medium">
                        <Users size={14} />
                        {showCollaboratorSection ? 'Masquer' : 'Gérer'}
                      </button>
                    </div>

                    {showCollaboratorSection && (
                      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                        {!isPremium() ? (
                          <div className="text-center py-4">
                            <Users size={24} className="mx-auto text-slate-400 mb-2" />
                            <p className="text-xs text-slate-500 mb-2">Premium requis pour collaborer</p>
                            <button type="button" className="text-[10px] bg-yellow-500 text-white px-2 py-1 rounded-full font-bold uppercase tracking-wider">Passer Pro</button>
                          </div>
                        ) : (
                          <>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                  type="text"
                                  value={emailInput}
                                  onChange={(e) => setEmailInput(e.target.value)}
                                  placeholder="Email ou ID..."
                                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                                />
                              </div>
                              <button type="button" onClick={handleAddEmail} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20">
                                <UserPlus size={16} />
                              </button>
                            </div>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {filteredFriends.map(friend => (
                                <CollaboratorItem key={friend.id} id={friend.id} name={friend.name} email={friend.email} avatar={friend.avatar} isSelected={collaborators.includes(friend.id)} onAction={() => toggleCollaborator(friend.id)} variant="toggle" />
                              ))}
                            </div>
                            {collaborators.length > 0 && (
                              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Sélectionnés ({collaborators.length})</p>
                                <div className="space-y-1">
                                  {collaborators.map(id => {
                                    const info = displayInfo(id);
                                    return <CollaboratorItem key={id} id={id} name={info.name} email={info.email} avatar={info.avatar} onAction={() => toggleCollaborator(id)} variant="remove" />;
                                  })}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10">
                    <h4 className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-4">Aperçu</h4>
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/50 shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCategoryColor(formData.category) }} />
                        <span className="font-bold text-slate-800 dark:text-slate-100">{formData.name || 'Ma nouvelle tâche'}</span>
                        {formData.bookmarked && <Bookmark size={14} className="fill-yellow-400 text-yellow-400" />}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1"><AlertCircle size={10} /> P{formData.priority || '?'}</span>
                        <span className="flex items-center gap-1"><Calendar size={10} /> {formData.deadline || 'Date ?'}</span>
                        <span className="flex items-center gap-1">Durée: {formData.estimatedTime || 0}m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => handleFormToggle(false)} className="px-6 py-2.5 rounded-xl font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Annuler</button>
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid()}
                  className="px-8 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? 'Création...' : 'Créer la tâche'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskForm;
