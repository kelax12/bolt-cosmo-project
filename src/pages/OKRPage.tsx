import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Calendar, Edit2, Trash2, CheckCircle, BarChart3, Settings, Clock } from 'lucide-react';
import CategoryManager, { getColorHex } from '../components/CategoryManager';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useTasks, OKR, KeyResult, OKRCategory as Category } from '../context/TaskContext';
import AddTaskForm from '../components/AddTaskForm';
import AddEventModal from '../components/AddEventModal';
import OKRModal from '../components/OKRModal';

const OKRPage: React.FC = () => {
  const location = useLocation();
  const { 
    okrs: objectives, 
    okrCategories: categories,
    updateKeyResult: contextUpdateKR, 
    deleteOKR, 
    addEvent, 
    addOKRCategory,
    updateOKRCategory,
    deleteOKRCategory
  } = useTasks();

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedKeyResultForModal, setSelectedKeyResultForModal] = useState<{kr: KeyResult; obj: OKR;} | null>(null);
  const [selectedOKRForModal, setSelectedOKRForModal] = useState<OKR | undefined>(undefined);
  const [showOKRModal, setShowOKRModal] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deletingObjective, setDeletingObjective] = useState<string | null>(null);

  const getProgress = (keyResults: KeyResult[]) => {
    if (keyResults.length === 0) return 0;
    const totalProgress = keyResults.reduce((sum, kr) => {
      return sum + Math.min(kr.currentValue / kr.targetValue * 100, 100);
    }, 0);
    return Math.round(totalProgress / keyResults.length);
  };

  const updateKeyResult = (objectiveId: string, keyResultId: string, newValue: number) => {
    const obj = objectives.find((o) => o.id === objectiveId);
    const kr = obj?.keyResults.find((k) => k.id === keyResultId);
    if (kr) {
      contextUpdateKR(objectiveId, keyResultId, {
        currentValue: newValue,
        completed: newValue >= kr.targetValue
      });
    }
  };

  const deleteObjective = (objectiveId: string) => {
    deleteOKR(objectiveId);
    setDeletingObjective(null);
  };

  const handleEditObjective = (okr: OKR) => {
    setSelectedOKRForModal(okr);
    setShowOKRModal(true);
  };

  const handleAddObjective = () => {
    setSelectedOKRForModal(undefined);
    setShowOKRModal(true);
  };

  const filteredObjectives = selectedCategory === 'all' ?
  objectives :
  selectedCategory === 'finished' ?
  objectives.filter((obj) => obj.completed) :
  objectives.filter((obj) => obj.category === selectedCategory);

  const stats = {
    total: objectives.length,
    completed: objectives.filter((obj) => obj.completed).length,
    inProgress: objectives.filter((obj) => !obj.completed).length,
    avgProgress: objectives.length > 0 ?
    Math.round(objectives.reduce((sum, obj) => sum + getProgress(obj.keyResults), 0) / objectives.length) :
    0
  };

  const getCategoryById = (id: string) => categories.find((cat) => cat.id === id);

  useEffect(() => {
    const state = location.state as {selectedOKRId?: string;};
    if (state?.selectedOKRId) {
      const objective = objectives.find(o => o.id === state.selectedOKRId);
      if (objective) {
        handleEditObjective(objective);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location, objectives]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-8 max-w-7xl mx-auto"
      style={{ backgroundColor: 'rgb(var(--color-background))' }}>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'rgb(var(--color-text-primary))' }}>
          OKR - Objectifs & Résultats Clés
        </h1>
        <p className="text-sm sm:text-base" style={{ color: 'rgb(var(--color-text-secondary))' }}>
          Définissez et suivez vos objectifs avec des résultats mesurables
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {[
        { icon: TrendingUp, color: 'orange', label: 'En Cours', value: stats.inProgress },
        { icon: BarChart3, color: 'purple', label: 'Progression Moy.', value: `${stats.avgProgress}%` }].
        map((stat) =>
        <div
          key={stat.label}
          className="p-4 sm:p-6 rounded-lg shadow-sm border transition-all"
          style={{
            backgroundColor: 'rgb(var(--color-surface))',
            borderColor: 'rgb(var(--color-border))'
          }}>

            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: `rgba(var(--color-${stat.color}-rgb), 0.1)` }}>
                <stat.icon size={24} style={{ color: `rgb(var(--color-${stat.color}))` }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm truncate" title={stat.label} style={{ color: 'rgb(var(--color-text-secondary))' }}>{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold truncate" style={{ color: 'rgb(var(--color-text-primary))' }}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 mb-8">
        <button
          onClick={() => setShowCategoryManager(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-all shadow-sm hover:bg-blue-600 hover:border-blue-600 hover:scale-105 group"
          style={{
            borderColor: 'rgb(var(--color-border))',
            backgroundColor: 'rgb(var(--color-surface))'
          }}>

          <Settings size={20} className="transition-transform group-hover:scale-110 group-hover:!text-white" style={{ color: 'rgb(var(--color-text-secondary))' }} />
          <span className="whitespace-nowrap transition-all group-hover:!text-white group-hover:font-bold" style={{ color: 'rgb(var(--color-text-secondary))' }}>
            Gérer les catégories
          </span>
        </button>
            <button
              onClick={handleAddObjective}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white hover:text-white shadow-lg shadow-blue-500/25 transform transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">

          <Plus size={20} />
          <span className="whitespace-nowrap">Nouvel Objectif</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <span className="text-sm font-medium whitespace-nowrap" style={{ color: 'rgb(var(--color-text-secondary))' }}>Filtrer par catégorie :</span>
        <div className="flex gap-2 flex-wrap">
            <button
            onClick={() => setSelectedCategory('all')}
            className="px-3 py-1 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: selectedCategory === 'all' ? 'rgb(var(--color-accent) / 0.1)' : 'rgb(var(--color-hover))',
              color: selectedCategory === 'all' ? 'rgb(var(--color-accent))' : 'rgb(var(--color-text-secondary))'
            }}>

              Tous
            </button>
            <button
            onClick={() => setSelectedCategory('finished')}
            className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: selectedCategory === 'finished' ? 'rgb(var(--color-accent) / 0.1)' : 'rgb(var(--color-hover))',
              color: selectedCategory === 'finished' ? 'rgb(var(--color-accent))' : 'rgb(var(--color-text-secondary))'
            }}>

              <CheckCircle size={14} />
              <span>Finis</span>
            </button>
          {categories.map((category) =>
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: selectedCategory === category.id ? getColorHex(category.color) : 'rgb(var(--color-hover))',
              color: selectedCategory === category.id ? '#ffffff' : 'rgb(var(--color-text-secondary))',
              boxShadow: selectedCategory === category.id ? `0 4px 12px ${getColorHex(category.color)}40` : 'none'
            }}>

              {category.icon && <span>{category.icon}</span>}
              <span>{category.name}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredObjectives.map((objective, index) => {
            const progress = getProgress(objective.keyResults);
            const category = getCategoryById(objective.category);

            return (
              <motion.div
                key={objective.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg shadow-sm border p-6 transition-all"
                style={{
                  backgroundColor: 'rgb(var(--color-surface))',
                  borderColor: 'rgb(var(--color-border))'
                }}>

                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap" style={{ backgroundColor: 'rgb(var(--color-accent) / 0.1)', color: 'rgb(var(--color-accent))' }}>
                          {category?.icon && <span>{category.icon}</span>}
                          <span>{category?.name}</span>
                        </span>
                        <span className="text-xs sm:text-sm whitespace-nowrap" style={{ color: 'rgb(var(--color-text-muted))' }}>
                          {new Date(objective.startDate).toLocaleDateString('fr-FR')} - {new Date(objective.endDate).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap" style={{ color: 'rgb(var(--color-text-muted))' }}>
                          <Clock size={14} />
                          {objective.estimatedTime} min
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold mb-1 truncate" style={{ color: 'rgb(var(--color-text-primary))' }}>{objective.title}</h3>
                      <p className="text-xs sm:text-sm line-clamp-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>{objective.description}</p>
                    </div>
                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                          <button
                            onClick={() => handleEditObjective(objective)}
                            className="p-1.5 transition-colors hover:bg-hover rounded-md"
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#2563eb'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgb(var(--color-text-muted))'; }}
                            style={{ color: 'rgb(var(--color-text-muted))' }}>
                            <Edit2 size={16} />
                          </button>
                            <button
                              onClick={() => setDeletingObjective(objective.id)}
                              className="p-1.5 transition-colors hover:bg-hover rounded-md"
                              onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgb(var(--color-text-muted))'; }}
                              style={{ color: 'rgb(var(--color-text-muted))' }}>
                              <Trash2 size={16} />
                            </button>
                        </div>
                  </div>

                  <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                      <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="32" stroke="rgb(var(--color-border-muted))" strokeWidth="8" fill="none" />
                        <circle cx="40" cy="40" r="32" stroke="rgb(var(--color-accent))" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 32}`} strokeDashoffset={2 * Math.PI * 32 * (1 - progress / 100)} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg sm:text-xl font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>{progress}%</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs sm:text-sm font-medium" style={{ color: 'rgb(var(--color-text-secondary))' }}>Progression globale</span>
                        <span className="text-xs sm:text-sm font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>{progress}%</span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ backgroundColor: 'rgb(var(--color-border-muted))' }}>
                        <div className="h-2 rounded-full transition-all duration-500" style={{ backgroundColor: 'rgb(var(--color-accent))', width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs sm:text-sm font-medium mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>Résultats Clés</h4>
                    {objective.keyResults.map((keyResult) => {
                      const krProgress = Math.min(keyResult.currentValue / keyResult.targetValue * 100, 100);

                      return (
                        <div key={keyResult.id} className="rounded-lg p-3 transition-all" style={{ backgroundColor: 'rgb(var(--color-hover))' }}>
                          <div className="flex justify-between items-center mb-3 gap-2">
                            <span className="text-xs sm:text-sm font-medium truncate" style={{ color: 'rgb(var(--color-text-primary))' }}>{keyResult.title}</span>
                            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                <button
                                  onClick={() => {
                                    setSelectedKeyResultForModal({ kr: keyResult, obj: objective });
                                    setShowAddTaskModal(true);
                                  }}
                                  className="p-1.5 rounded-md transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 group"
                                  title="Créer une tâche">

                                  <CheckCircle size={14} className="text-blue-500 group-hover:text-blue-600" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedKeyResultForModal({ kr: keyResult, obj: objective });
                                    setShowAddEventModal(true);
                                  }}
                                  className="p-1.5 rounded-md transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 group"
                                  title="Planifier un événement">

                                  <Calendar size={14} className="text-purple-500 group-hover:text-blue-600" />
                                </button>
                              <span className="text-[10px] sm:text-xs flex items-center gap-1" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                <Clock size={12} />
                                {keyResult.estimatedTime}min
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <input
                                type="number"
                                value={keyResult.currentValue}
                                onChange={(e) => updateKeyResult(objective.id, keyResult.id, Number(e.target.value))}
                                className="w-16 sm:w-20 px-2 py-1 text-xs sm:text-sm border rounded focus:outline-none"
                                style={{ backgroundColor: 'rgb(var(--color-surface))', color: 'rgb(var(--color-text-primary))', borderColor: 'rgb(var(--color-border))' }} />

                              <span className="text-xs sm:text-sm whitespace-nowrap" style={{ color: 'rgb(var(--color-text-secondary))' }}>/ {keyResult.targetValue}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 w-full">
                              <div className="flex-1 rounded-full h-1.5" style={{ backgroundColor: 'rgb(var(--color-border-muted))' }}>
                                <div className={`h-1.5 rounded-full transition-all duration-500 ${keyResult.completed ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${krProgress}%` }} />
                              </div>
                              <span className="text-[10px] sm:text-xs font-medium w-8 text-right" style={{ color: 'rgb(var(--color-text-secondary))' }}>{Math.round(krProgress)}%</span>
                            </div>
                          </div>
                        </div>);

                    })}
                  </div>
              </motion.div>);

          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {deletingObjective &&
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl max-w-sm">
              <h2 className="text-lg font-bold mb-4">Supprimer l'objectif ?</h2>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeletingObjective(null)}>Annuler</button>
                <button onClick={() => deleteObjective(deletingObjective)} className="bg-red-600 text-white px-4 py-2 rounded">Supprimer</button>
              </div>
            </div>
          </div>
        }
      </AnimatePresence>

      <CategoryManager
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        categories={categories}
        onAdd={addOKRCategory}
        onUpdate={updateOKRCategory}
        onDelete={deleteOKRCategory}
      />

      <AddTaskForm expanded={showAddTaskModal} onFormToggle={setShowAddTaskModal} initialData={selectedKeyResultForModal ? { name: `OKR: ${selectedKeyResultForModal.kr.title}`, estimatedTime: selectedKeyResultForModal.kr.estimatedTime, category: 'okr', priority: 2, isFromOKR: true } : undefined} />

      <OKRModal 
        isOpen={showOKRModal} 
        onClose={() => setShowOKRModal(false)} 
        okr={selectedOKRForModal} 
      />
      
      <AnimatePresence>
        {selectedKeyResultForModal && showAddEventModal &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

            <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}>

              <AddEventModal
              isOpen={showAddEventModal}
              onClose={() => setShowAddEventModal(false)}
              task={{
                id: selectedKeyResultForModal.kr.id,
                name: selectedKeyResultForModal.kr.title,
                completed: selectedKeyResultForModal.kr.completed,
                priority: 2,
                category: 'okr',
                estimatedTime: selectedKeyResultForModal.kr.estimatedTime,
                deadline: selectedKeyResultForModal.obj.endDate,
                bookmarked: false
              }}
              onAddEvent={(event) => {
                addEvent(event);
                setShowAddEventModal(false);
              }} />

            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>);

};

export default OKRPage;
