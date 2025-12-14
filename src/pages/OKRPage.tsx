import React, { useState, useEffect } from 'react';
import { Plus, Target, TrendingUp, Calendar, Edit2, Trash2, CheckCircle, BarChart3, Settings, X, Minus, Clock } from 'lucide-react';
import OKRModal from '../components/OKRModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

type KeyResult = {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  completed: boolean;
  estimatedTime: number;
};

type Objective = {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  keyResults: KeyResult[];
  completed: boolean;
  estimatedTime: number;
};

type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

const OKRPage: React.FC = () => {
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>([
    { id: 'personal', name: 'Personnel', color: 'blue', icon: '👤' },
    { id: 'professional', name: 'Professionnel', color: 'green', icon: '💼' },
    { id: 'health', name: 'Santé', color: 'red', icon: '❤️' },
    { id: 'learning', name: 'Apprentissage', color: 'purple', icon: '📚' },
  ]);

  const [objectives, setObjectives] = useState<Objective[]>([
    {
      id: '1',
      title: 'Améliorer mes compétences en français',
      description: 'Développer une maîtrise approfondie de la littérature française et des techniques de dissertation',
      category: 'learning',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      completed: false,
      estimatedTime: 180,
      keyResults: [
        {
          id: '1-1',
          title: 'Ficher 20 textes littéraires',
          currentValue: 8,
          targetValue: 20,
          unit: 'textes',
          completed: false,
          estimatedTime: 60
        },
        {
          id: '1-2',
          title: 'Réviser 15 textes par semaine',
          currentValue: 12,
          targetValue: 15,
          unit: 'textes/semaine',
          completed: false,
          estimatedTime: 90
        },
        {
          id: '1-3',
          title: 'Écrire 10 dissertations complètes',
          currentValue: 3,
          targetValue: 10,
          unit: 'dissertations',
          completed: false,
          estimatedTime: 30
        }
      ]
    },
    {
      id: '2',
      title: 'Optimiser ma productivité',
      description: 'Développer des habitudes de travail efficaces et maintenir un équilibre vie-travail',
      category: 'personal',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      completed: false,
      estimatedTime: 120,
      keyResults: [
        {
          id: '2-1',
          title: 'Compléter 90% des tâches planifiées',
          currentValue: 75,
          targetValue: 90,
          unit: '%',
          completed: false,
          estimatedTime: 60
        },
        {
          id: '2-2',
          title: 'Maintenir 8h de sommeil par nuit',
          currentValue: 7,
          targetValue: 8,
          unit: 'heures',
          completed: false,
          estimatedTime: 60
        }
      ]
    }
  ]);

  const [showAddObjective, setShowAddObjective] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingObjective, setEditingObjective] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deletingObjective, setDeletingObjective] = useState<string | null>(null);

  const [newObjective, setNewObjective] = useState({
    title: '',
    description: '',
    category: 'personal',
    startDate: '',
    endDate: '',
    estimatedTime: 60
  });

  const [keyResults, setKeyResults] = useState([
    { title: '', targetValue: '', currentValue: '', estimatedTime: '' },
    { title: '', targetValue: '', currentValue: '', estimatedTime: '' },
    { title: '', targetValue: '', currentValue: '', estimatedTime: '' }
  ]);

  const categoryColors = {
    blue: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6', border: '#BFDBFE' },
    green: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981', border: '#A7F3D0' },
    red: { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444', border: '#FECACA' },
    purple: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8B5CF6', border: '#DDD6FE' },
    orange: { bg: 'rgba(249, 115, 22, 0.1)', text: '#F97316', border: '#FED7AA' },
    yellow: { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B', border: '#FDE68A' },
    pink: { bg: 'rgba(236, 72, 153, 0.1)', text: '#EC4899', border: '#FBCFE8' },
    indigo: { bg: 'rgba(99, 102, 241, 0.1)', text: '#6366F1', border: '#C7D2FE' },
  };

  const getProgress = (keyResults: KeyResult[]) => {
    if (keyResults.length === 0) return 0;
    const totalProgress = keyResults.reduce((sum, kr) => {
      return sum + Math.min((kr.currentValue / kr.targetValue) * 100, 100);
    }, 0);
    return Math.round(totalProgress / keyResults.length);
  };

  const updateKeyResult = (objectiveId: string, keyResultId: string, newValue: number) => {
    setObjectives(prev => prev.map(obj => {
      if (obj.id === objectiveId) {
        return {
          ...obj,
          keyResults: obj.keyResults.map(kr => 
            kr.id === keyResultId 
              ? { ...kr, currentValue: newValue, completed: newValue >= kr.targetValue }
              : kr
          )
        };
      }
      return obj;
    }));
  };

  const addKeyResult = () => {
    if (keyResults.length < 10) {
      setKeyResults([...keyResults, { title: '', targetValue: '', currentValue: '', estimatedTime: '' }]);
    }
  };

  const removeKeyResult = (index: number) => {
    if (keyResults.length > 1) {
      setKeyResults(keyResults.filter((_, i) => i !== index));
    }
  };

  const updateKeyResultField = (index: number, field: string, value: string) => {
    const updated = keyResults.map((kr, i) => 
      i === index ? { ...kr, [field]: value } : kr
    );
    setKeyResults(updated);
  };

  const addCategory = (category: Category) => {
    setCategories([...categories, category]);
  };

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, ...updates } : cat
    ));
  };

  const deleteCategory = (categoryId: string) => {
    const isUsed = objectives.some(obj => obj.category === categoryId);
    if (isUsed) {
      alert('Cette catégorie est utilisée par des objectifs existants et ne peut pas être supprimée.');
      return;
    }
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const deleteObjective = (objectiveId: string) => {
    setObjectives(prev => prev.filter(obj => obj.id !== objectiveId));
    setDeletingObjective(null);
  };

  const handleSubmitObjective = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newObjective.title.trim()) {
      alert('Veuillez saisir un titre pour l\'objectif');
      return;
    }

    const validKeyResults = keyResults.filter(kr => 
      kr.title.trim() && kr.targetValue && Number(kr.targetValue) > 0
    );

    if (validKeyResults.length === 0) {
      alert('Veuillez définir au moins un résultat clé valide');
      return;
    }

    const newObj: Objective = {
      id: Date.now().toString(),
      title: newObjective.title,
      description: newObjective.description,
      category: newObjective.category,
      startDate: newObjective.startDate,
      endDate: newObjective.endDate,
      completed: false,
      estimatedTime: newObjective.estimatedTime,
      keyResults: validKeyResults.map((kr, index) => ({
        id: `${Date.now()}-${index}`,
        title: kr.title,
        currentValue: Number(kr.currentValue) || 0,
        targetValue: Number(kr.targetValue),
        unit: '',
        completed: false,
        estimatedTime: Number(kr.estimatedTime) || 30
      }))
    };

    setObjectives([...objectives, newObj]);
    
    setNewObjective({
      title: '',
      description: '',
      category: 'personal',
      startDate: '',
      endDate: '',
      estimatedTime: 60
    });
    setKeyResults([
      { title: '', targetValue: '', currentValue: '', estimatedTime: '' },
      { title: '', targetValue: '', currentValue: '', estimatedTime: '' },
      { title: '', targetValue: '', currentValue: '', estimatedTime: '' }
    ]);
    setShowAddObjective(false);
  };

  const filteredObjectives = selectedCategory === 'all' 
    ? objectives 
    : objectives.filter(obj => obj.category === selectedCategory);

  const stats = {
    total: objectives.length,
    completed: objectives.filter(obj => obj.completed).length,
    inProgress: objectives.filter(obj => !obj.completed).length,
    avgProgress: objectives.length > 0 
      ? Math.round(objectives.reduce((sum, obj) => sum + getProgress(obj.keyResults), 0) / objectives.length)
      : 0
  };

  const getCategoryById = (id: string) => categories.find(cat => cat.id === id);

  // Auto-open modal when navigating from dashboard
  useEffect(() => {
    const state = location.state as { selectedOKRId?: string };
    if (state?.selectedOKRId) {
      setEditingObjective(state.selectedOKRId);
      // Clear the state to avoid reopening on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-7xl mx-auto" 
      style={{ backgroundColor: 'rgb(var(--color-background))' }}
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-between items-start mb-8"
      >
        <div>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-2" 
            style={{ color: 'rgb(var(--color-text-primary))' }}
          >
            OKR - Objectifs & Résultats Clés
          </motion.h1>
          <motion.p 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ color: 'rgb(var(--color-text-secondary))' }}
          >
            Définissez et suivez vos objectifs avec des résultats mesurables
          </motion.p>
        </div>
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCategoryManager(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg transition-all shadow-sm"
            style={{
              borderColor: 'rgb(var(--color-border))',
              color: 'rgb(var(--color-text-secondary))',
              backgroundColor: 'rgb(var(--color-surface))'
            }}
          >
            <Settings size={20} />
            <span>Gérer les catégories</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddObjective(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Nouvel Objectif</span>
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: Target, color: 'blue', label: 'Total Objectifs', value: stats.total },
          { icon: CheckCircle, color: 'green', label: 'Complétés', value: stats.completed },
          { icon: TrendingUp, color: 'orange', label: 'En Cours', value: stats.inProgress },
          { icon: BarChart3, color: 'purple', label: 'Progression Moy.', value: `${stats.avgProgress}%` }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-6 rounded-lg shadow-sm border transition-all cursor-pointer"
            style={{
              backgroundColor: 'rgb(var(--color-surface))',
              borderColor: 'rgb(var(--color-border))'
            }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`p-2 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg`}
              >
                <stat.icon size={24} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </motion.div>
              <div>
                <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{stat.label}</p>
                <motion.p 
                  key={stat.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold" 
                  style={{ color: 'rgb(var(--color-text-primary))' }}
                >
                  {stat.value}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-4 mb-6"
      >
        <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-secondary))' }}>Filtrer par catégorie :</span>
        <div className="flex gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('all')}
            className="px-3 py-1 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: selectedCategory === 'all' ? 'rgb(var(--color-accent) / 0.1)' : 'rgb(var(--color-hover))',
              color: selectedCategory === 'all' ? 'rgb(var(--color-accent))' : 'rgb(var(--color-text-secondary))'
            }}
          >
            Tous
          </motion.button>
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: selectedCategory === category.id 
                  ? categoryColors[category.color as keyof typeof categoryColors]?.bg || 'rgb(var(--color-accent) / 0.1)'
                  : 'rgb(var(--color-hover))',
                color: selectedCategory === category.id 
                  ? categoryColors[category.color as keyof typeof categoryColors]?.text || 'rgb(var(--color-accent))'
                  : 'rgb(var(--color-text-secondary))'
              }}
            >
              {category.icon && <span>{category.icon}</span>}
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredObjectives.map((objective, index) => {
            const progress = getProgress(objective.keyResults);
            const category = getCategoryById(objective.category);
            const categoryStyle = category ? categoryColors[category.color as keyof typeof categoryColors] : categoryColors.blue;
            
            return (
              <motion.div
                key={objective.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="rounded-lg shadow-sm border p-6 transition-all"
                style={{
                  backgroundColor: 'rgb(var(--color-surface))',
                  borderColor: 'rgb(var(--color-border))'
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}
                      >
                        {category?.icon && <span>{category.icon}</span>}
                        <span>{category?.name}</span>
                      </motion.span>
                      <span className="text-sm" style={{ color: 'rgb(var(--color-text-muted))' }}>
                        {new Date(objective.startDate).toLocaleDateString('fr-FR')} - {new Date(objective.endDate).toLocaleDateString('fr-FR')}
                      </span>
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className="text-sm flex items-center gap-1" 
                        style={{ color: 'rgb(var(--color-text-muted))' }}
                      >
                        <Clock size={14} />
                        {objective.estimatedTime} min
                      </motion.span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1" style={{ color: 'rgb(var(--color-text-primary))' }}>{objective.title}</h3>
                    <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{objective.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <motion.button 
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingObjective(objective.id)}
                      className="p-1 transition-colors"
                      style={{ color: 'rgb(var(--color-text-muted))' }}
                      title="Modifier l'objectif"
                    >
                      <Edit2 size={16} />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeletingObjective(objective.id)}
                      className="p-1 transition-colors" 
                      style={{ color: 'rgb(var(--color-text-muted))' }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-6">
                  <div className="relative">
                    <svg className="transform -rotate-90" width="80" height="80">
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="rgb(var(--color-border-muted))"
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="rgb(var(--color-accent))"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 32}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                        animate={{ strokeDashoffset: (2 * Math.PI * 32) * (1 - progress / 100) }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span 
                        key={progress}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-xl font-bold" 
                        style={{ color: 'rgb(var(--color-text-primary))' }}
                      >
                        {progress}%
                      </motion.span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-secondary))' }}>Progression globale</span>
                      <motion.span 
                        key={progress}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-sm font-bold" 
                        style={{ color: 'rgb(var(--color-text-primary))' }}
                      >
                        {progress}%
                      </motion.span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ backgroundColor: 'rgb(var(--color-border-muted))' }}>
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: 'rgb(var(--color-accent))' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>Résultats Clés</h4>
                  {objective.keyResults.map((keyResult, krIndex) => {
                    const krProgress = Math.min((keyResult.currentValue / keyResult.targetValue) * 100, 100);
                    
                    return (
                      <motion.div
                        key={keyResult.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: krIndex * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="rounded-lg p-3 transition-all" 
                        style={{ backgroundColor: 'rgb(var(--color-hover))' }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>{keyResult.title}</span>
                          <motion.span 
                            whileHover={{ scale: 1.1 }}
                            className="text-xs flex items-center gap-1" 
                            style={{ color: 'rgb(var(--color-text-muted))' }}
                          >
                            <Clock size={12} />
                            {keyResult.estimatedTime}min
                          </motion.span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            value={keyResult.currentValue}
                            onChange={(e) => updateKeyResult(objective.id, keyResult.id, Number(e.target.value))}
                            className="w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            style={{
                              backgroundColor: 'rgb(var(--color-surface))',
                              color: 'rgb(var(--color-text-primary))',
                              borderColor: 'rgb(var(--color-border))'
                            }}
                          />
                          <span className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>/ {keyResult.targetValue}</span>
                          <div className="flex-1 rounded-full h-1.5 ml-3" style={{ backgroundColor: 'rgb(var(--color-border-muted))' }}>
                            <motion.div 
                              className={`h-1.5 rounded-full ${
                                keyResult.completed ? 'bg-green-500 dark:bg-green-400' : 'bg-primary-600 dark:bg-primary-500'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${krProgress}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: krIndex * 0.1 }}
                            />
                          </div>
                          <motion.span 
                            key={krProgress}
                            initial={{ scale: 1.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-xs font-medium w-10 text-right" 
                            style={{ color: 'rgb(var(--color-text-secondary))' }}
                          >
                            {Math.round(krProgress)}%
                          </motion.span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showCategoryManager && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CategoryManagerModal
              categories={categories}
              onAddCategory={addCategory}
              onUpdateCategory={updateCategory}
              onDeleteCategory={deleteCategory}
              onClose={() => setShowCategoryManager(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingObjective && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OKRModal
              okr={objectives.find(obj => obj.id === editingObjective)!}
              isOpen={!!editingObjective}
              onClose={() => setEditingObjective(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddObjective && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto transition-colors" 
              style={{ backgroundColor: 'rgb(var(--color-surface))' }}
            >
              <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-primary-50 dark:from-primary-900/20 to-purple-50 dark:to-purple-900/20 transition-colors" style={{ borderColor: 'rgb(var(--color-border))' }}>
                <h2 className="text-xl font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>Nouvel Objectif</h2>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddObjective(false)}
                  className="p-1 rounded-lg transition-colors"
                  style={{ color: 'rgb(var(--color-text-muted))' }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <form onSubmit={handleSubmitObjective} className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                         Titre de l'objectif *
                      </label>
                      <input
                        type="text"
                        value={newObjective.title}
                        onChange={(e) => setNewObjective({...newObjective, title: e.target.value})}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg transition-colors"
                        style={{
                          backgroundColor: 'rgb(var(--color-surface))',
                          color: 'rgb(var(--color-text-primary))',
                          borderColor: 'rgb(var(--color-border))'
                        }}
                        placeholder="Ex: Améliorer mes compétences en français"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                         Description
                      </label>
                      <textarea
                        rows={4}
                        value={newObjective.description}
                        onChange={(e) => setNewObjective({...newObjective, description: e.target.value})}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-colors"
                        style={{
                          backgroundColor: 'rgb(var(--color-surface))',
                          color: 'rgb(var(--color-text-primary))',
                          borderColor: 'rgb(var(--color-border))'
                        }}
                        placeholder="Décrivez votre objectif en détail..."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                         Catégorie
                      </label>
                      <select 
                        value={newObjective.category}
                        onChange={(e) => setNewObjective({...newObjective, category: e.target.value})}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                        style={{
                          backgroundColor: 'rgb(var(--color-surface))',
                          color: 'rgb(var(--color-text-primary))',
                          borderColor: 'rgb(var(--color-border))'
                        }}
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.icon ? `${category.icon} ${category.name}` : category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                           Date début
                        </label>
                        <input
                          type="date"
                          value={newObjective.startDate}
                          onChange={(e) => setNewObjective({...newObjective, startDate: e.target.value})}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                          style={{
                            backgroundColor: 'rgb(var(--color-surface))',
                            color: 'rgb(var(--color-text-primary))',
                            borderColor: 'rgb(var(--color-border))'
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                           Date fin
                        </label>
                        <input
                          type="date"
                          value={newObjective.endDate}
                          onChange={(e) => setNewObjective({...newObjective, endDate: e.target.value})}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                          style={{
                            backgroundColor: 'rgb(var(--color-surface))',
                            color: 'rgb(var(--color-text-primary))',
                            borderColor: 'rgb(var(--color-border))'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                         Temps estimé total (minutes) *
                      </label>
                      <input
                        type="number"
                        value={newObjective.estimatedTime}
                        onChange={(e) => setNewObjective({...newObjective, estimatedTime: Number(e.target.value)})}
                        min="1"
                        max="1440"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                        style={{
                          backgroundColor: 'rgb(var(--color-surface))',
                          color: 'rgb(var(--color-text-primary))',
                          borderColor: 'rgb(var(--color-border))'
                        }}
                        placeholder="60"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 dark:from-gray-800 to-blue-50 dark:to-blue-900/20 p-6 rounded-lg border transition-colors" style={{ borderColor: 'rgb(var(--color-border))' }}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                       Résultats Clés
                      <span className="text-sm font-normal" style={{ color: 'rgb(var(--color-text-muted))' }}>({keyResults.length}/10)</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={addKeyResult}
                        disabled={keyResults.length >= 10}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 dark:bg-green-500 text-white rounded-lg text-sm hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus size={16} />
                        <span>Ajouter</span>
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {keyResults.map((keyResult, index) => (
                      <div key={index} className="p-4 rounded-lg border transition-colors" style={{
                        backgroundColor: 'rgb(var(--color-surface))',
                        borderColor: 'rgb(var(--color-border))'
                      }}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium" style={{ color: 'rgb(var(--color-text-secondary))' }}>Résultat clé {index + 1}</span>
                          {keyResults.length > 1 && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => removeKeyResult(index)}
                              className="ml-auto p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="Supprimer ce résultat clé"
                            >
                              <Minus size={16} />
                            </motion.button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                          <div className="lg:col-span-2">
                            <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text-muted))' }}>
                              Description du résultat *
                            </label>
                            <input
                              type="text"
                              value={keyResult.title}
                              onChange={(e) => updateKeyResultField(index, 'title', e.target.value)}
                              placeholder={`Ex: Ficher ${index === 0 ? '20' : index === 1 ? '15' : '10'} textes littéraires`}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                              style={{
                                backgroundColor: 'rgb(var(--color-surface))',
                                color: 'rgb(var(--color-text-primary))',
                                borderColor: 'rgb(var(--color-border))'
                              }}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                Objectif *
                              </label>
                              <input
                                type="number"
                                value={keyResult.targetValue}
                                onChange={(e) => updateKeyResultField(index, 'targetValue', e.target.value)}
                                placeholder="20"
                                min="1"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                                style={{
                                  backgroundColor: 'rgb(var(--color-surface))',
                                  color: 'rgb(var(--color-text-primary))',
                                  borderColor: 'rgb(var(--color-border))'
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                Actuel
                              </label>
                              <input
                                type="number"
                                value={keyResult.currentValue}
                                onChange={(e) => updateKeyResultField(index, 'currentValue', e.target.value)}
                                placeholder="0"
                                min="0"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                                style={{
                                  backgroundColor: 'rgb(var(--color-surface))',
                                  color: 'rgb(var(--color-text-primary))',
                                  borderColor: 'rgb(var(--color-border))'
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text-muted))' }}>
                              Temps (min) *
                            </label>
                            <input
                              type="number"
                              value={keyResult.estimatedTime}
                              onChange={(e) => updateKeyResultField(index, 'estimatedTime', e.target.value)}
                              placeholder="30"
                              min="1"
                              max="480"
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                              style={{
                                backgroundColor: 'rgb(var(--color-surface))',
                                color: 'rgb(var(--color-text-primary))',
                                borderColor: 'rgb(var(--color-border))'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                  >
                     Valider
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingObjective && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeletingObjective(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="rounded-xl shadow-2xl w-full max-w-md p-6 transition-colors"
              style={{ backgroundColor: 'rgb(var(--color-surface))' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-2" style={{ color: 'rgb(var(--color-text-primary))' }}>
                Confirmer la suppression
              </h2>
              <p className="text-sm mb-6" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                Êtes-vous sûr de vouloir supprimer cet objectif ? Cette action est irréversible et supprimera tous les résultats clés associés.
              </p>
              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeletingObjective(null)}
                  className="px-4 py-2 rounded-lg font-medium border transition-colors"
                  style={{
                    borderColor: 'rgb(var(--color-border))',
                    color: 'rgb(var(--color-text-primary))'
                  }}
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deletingObjective && deleteObjective(deletingObjective)}
                  className="px-4 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Supprimer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CategoryManagerModal: React.FC<{
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (id: string, updates: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
  onClose: () => void;
}> = ({ categories, onAddCategory, onUpdateCategory, onDeleteCategory, onClose }) => {
  const [newCategory, setNewCategory] = useState({ name: '', color: 'blue', icon: '' });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: '', color: 'blue', icon: '' });

  const colorOptions = [
    { value: 'blue', name: 'Bleu', color: '#3B82F6' },
    { value: 'green', name: 'Vert', color: '#10B981' },
    { value: 'red', name: 'Rouge', color: '#EF4444' },
    { value: 'purple', name: 'Violet', color: '#8B5CF6' },
    { value: 'orange', name: 'Orange', color: '#F97316' },
    { value: 'yellow', name: 'Jaune', color: '#F59E0B' },
    { value: 'pink', name: 'Rose', color: '#EC4899' },
    { value: 'indigo', name: 'Indigo', color: '#6366F1' },
  ];

  const iconOptions = [
    { value: '', label: 'Aucun emoji' },
    { value: '📁', label: '📁 Dossier' },
    { value: '👤', label: '👤 Personnel' },
    { value: '💼', label: '💼 Professionnel' },
    { value: '❤️', label: '❤️ Santé' },
    { value: '📚', label: '📚 Apprentissage' },
    { value: '🎯', label: '🎯 Objectif' },
    { value: '🏆', label: '🏆 Réussite' },
    { value: '💡', label: '💡 Idée' },
    { value: '🚀', label: '🚀 Projet' },
    { value: '⭐', label: '⭐ Important' },
    { value: '🔥', label: '🔥 Urgent' },
    { value: '💪', label: '💪 Effort' }
  ];

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      color: newCategory.color,
      icon: newCategory.icon
    };

    onAddCategory(category);
    setNewCategory({ name: '', color: 'blue', icon: '' });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category.id);
    setEditData({ name: category.name, color: category.color, icon: category.icon });
  };

  const handleSaveEdit = () => {
    if (!editData.name.trim() || !editingCategory) return;
    
    onUpdateCategory(editingCategory, editData);
    setEditingCategory(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-colors">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 dark:from-blue-900/20 to-purple-50 dark:to-purple-900/20">
          <h2 className="text-xl font-bold text-primary-900 dark:text-white">Gérer les catégories</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg mb-6 transition-colors">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Ajouter une nouvelle catégorie</h3>
            <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-600 text-gray-900 dark:text-white transition-colors"
                  placeholder="Nom de la catégorie"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icône</label>
                <select
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-600 text-gray-900 dark:text-white transition-colors"
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Couleur</label>
                <select
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-600 text-gray-900 dark:text-white transition-colors"
                >
                  {colorOptions.map(color => (
                    <option key={color.value} value={color.value}>{color.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Catégories existantes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(category => (
                <div key={category.id} className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors">
                  {editingCategory === category.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-600 text-gray-900 dark:text-white transition-colors"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={editData.icon}
                          onChange={(e) => setEditData({...editData, icon: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-600 text-gray-900 dark:text-white transition-colors"
                        >
                          {iconOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <select
                          value={editData.color}
                          onChange={(e) => setEditData({...editData, color: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-600 text-gray-900 dark:text-white transition-colors"
                        >
                          {colorOptions.map(color => (
                            <option key={color.value} value={color.value}>{color.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="px-3 py-1 bg-green-600 dark:bg-green-500 text-white rounded hover:bg-green-700 dark:hover:bg-green-600"
                        >
                          Sauvegarder
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        {category.icon ? (
                          <span className="text-2xl">{category.icon}</span>
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">—</span>
                          </div>
                        )}
                        <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: colorOptions.find(c => c.value === category.color)?.color }}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteCategory(category.id)}
                          className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OKRPage;
