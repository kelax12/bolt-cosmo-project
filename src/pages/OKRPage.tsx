import React, { useState } from 'react';
import { Plus, Target, TrendingUp, Calendar, Edit2, Trash2, CheckCircle, Circle, BarChart3, Settings, X, Minus, Clock } from 'lucide-react';
import OKRModal from '../components/OKRModal';

type KeyResult = {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  completed: boolean;
  estimatedTime: number; // AJOUT: Temps estimé en minutes
};

type Objective = {
  id: string;
  title: string;
  description: string;
  category: string; // Changé pour permettre des catégories personnalisées
  startDate: string;
  endDate: string;
  keyResults: KeyResult[];
  completed: boolean;
  estimatedTime: number; // AJOUT: Temps estimé total en minutes
};

type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

const OKRPage: React.FC = () => {
  // Catégories par défaut
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
      estimatedTime: 180, // AJOUT: 3 heures au total
      keyResults: [
        {
          id: '1-1',
          title: 'Ficher 20 textes littéraires',
          currentValue: 8,
          targetValue: 20,
          unit: 'textes',
          completed: false,
          estimatedTime: 60 // AJOUT: 1 heure par résultat clé
        },
        {
          id: '1-2',
          title: 'Réviser 15 textes par semaine',
          currentValue: 12,
          targetValue: 15,
          unit: 'textes/semaine',
          completed: false,
          estimatedTime: 90 // AJOUT: 1h30 par résultat clé
        },
        {
          id: '1-3',
          title: 'Écrire 10 dissertations complètes',
          currentValue: 3,
          targetValue: 10,
          unit: 'dissertations',
          completed: false,
          estimatedTime: 30 // AJOUT: 30 min par résultat clé
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
      estimatedTime: 120, // AJOUT: 2 heures au total
      keyResults: [
        {
          id: '2-1',
          title: 'Compléter 90% des tâches planifiées',
          currentValue: 75,
          targetValue: 90,
          unit: '%',
          completed: false,
          estimatedTime: 60 // AJOUT: 1 heure par résultat clé
        },
        {
          id: '2-2',
          title: 'Maintenir 8h de sommeil par nuit',
          currentValue: 7,
          targetValue: 8,
          unit: 'heures',
          completed: false,
          estimatedTime: 60 // AJOUT: 1 heure par résultat clé
        }
      ]
    }
  ]);

  const [showAddObjective, setShowAddObjective] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingObjective, setEditingObjective] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // État pour la modal d'ajout d'objectif
  const [newObjective, setNewObjective] = useState({
    title: '',
    description: '',
    category: 'personal',
    startDate: '',
    endDate: '',
    estimatedTime: 60 // AJOUT: Temps estimé par défaut
  });

  const [keyResults, setKeyResults] = useState([
    { title: '', targetValue: '', currentValue: '', estimatedTime: '' }, // AJOUT: estimatedTime
    { title: '', targetValue: '', currentValue: '', estimatedTime: '' }, // AJOUT: estimatedTime
    { title: '', targetValue: '', currentValue: '', estimatedTime: '' }  // AJOUT: estimatedTime
  ]);

  const categoryColors = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    red: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
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
    if (keyResults.length < 10) { // Limite à 10 résultats clés
      setKeyResults([...keyResults, { title: '', targetValue: '', currentValue: '', estimatedTime: '' }]); // AJOUT: estimatedTime
    }
  };

  const removeKeyResult = (index: number) => {
    if (keyResults.length > 1) { // Minimum 1 résultat clé
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
    // Vérifier si la catégorie est utilisée
    const isUsed = objectives.some(obj => obj.category === categoryId);
    if (isUsed) {
      alert('Cette catégorie est utilisée par des objectifs existants et ne peut pas être supprimée.');
      return;
    }
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
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
      estimatedTime: newObjective.estimatedTime, // AJOUT
      keyResults: validKeyResults.map((kr, index) => ({
        id: `${Date.now()}-${index}`,
        title: kr.title,
        currentValue: Number(kr.currentValue) || 0,
        targetValue: Number(kr.targetValue),
        unit: '', // Pas d'unité dans cette version
        completed: false,
        estimatedTime: Number(kr.estimatedTime) || 30 // AJOUT
      }))
    };

    setObjectives([...objectives, newObj]);
    
    // Reset form
    setNewObjective({
      title: '',
      description: '',
      category: 'personal',
      startDate: '',
      endDate: '',
      estimatedTime: 60 // AJOUT
    });
    setKeyResults([
      { title: '', targetValue: '', currentValue: '', estimatedTime: '' }, // AJOUT: estimatedTime
      { title: '', targetValue: '', currentValue: '', estimatedTime: '' }, // AJOUT: estimatedTime
      { title: '', targetValue: '', currentValue: '', estimatedTime: '' }  // AJOUT: estimatedTime
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

  return (
    <div className="p-8 max-w-7xl mx-auto" style={{ backgroundColor: 'rgb(var(--color-background))' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'rgb(var(--color-text-primary))' }}>OKR - Objectifs & Résultats Clés</h1>
          <p style={{ color: 'rgb(var(--color-text-secondary))' }}>Définissez et suivez vos objectifs avec des résultats mesurables</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCategoryManager(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors"
            style={{
              borderColor: 'rgb(var(--color-border))',
              color: 'rgb(var(--color-text-secondary))',
              backgroundColor: 'rgb(var(--color-surface))'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--color-surface))'}
          >
            <Settings size={20} />
            <span>Gérer les catégories</span>
          </button>
          <button
            onClick={() => setShowAddObjective(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Nouvel Objectif</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-lg shadow-sm border transition-colors" style={{
          backgroundColor: 'rgb(var(--color-surface))',
          borderColor: 'rgb(var(--color-border))'
        }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>Total Objectifs</p>
              <p className="text-2xl font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-sm border transition-colors" style={{
          backgroundColor: 'rgb(var(--color-surface))',
          borderColor: 'rgb(var(--color-border))'
        }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>Complétés</p>
              <p className="text-2xl font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-sm border transition-colors" style={{
          backgroundColor: 'rgb(var(--color-surface))',
          borderColor: 'rgb(var(--color-border))'
        }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <TrendingUp size={24} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>En Cours</p>
              <p className="text-2xl font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-sm border transition-colors" style={{
          backgroundColor: 'rgb(var(--color-surface))',
          borderColor: 'rgb(var(--color-border))'
        }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <BarChart3 size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>Progression Moy.</p>
              <p className="text-2xl font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>{stats.avgProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-secondary))' }}>Filtrer par catégorie :</span>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
            style={{
              backgroundColor: selectedCategory === 'all' ? 'rgb(var(--color-accent) / 0.1)' : 'rgb(var(--color-hover))',
              color: selectedCategory === 'all' ? 'rgb(var(--color-accent))' : 'rgb(var(--color-text-secondary))'
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== 'all') e.currentTarget.style.backgroundColor = 'rgb(var(--color-active))';
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== 'all') e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))';
            }}
          >
            Tous
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors"
              style={{
                backgroundColor: selectedCategory === category.id 
                  ? `${categoryColors[category.color as keyof typeof categoryColors]?.bg || 'rgb(var(--color-accent) / 0.1)'}`
                  : 'rgb(var(--color-hover))',
                color: selectedCategory === category.id 
                  ? `${categoryColors[category.color as keyof typeof categoryColors]?.text || 'rgb(var(--color-accent))'}`
                  : 'rgb(var(--color-text-secondary))'
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== category.id) e.currentTarget.style.backgroundColor = 'rgb(var(--color-active))';
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category.id) e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))';
              }}
            >
              {category.icon && <span>{category.icon}</span>}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Objectives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredObjectives.map(objective => {
          const progress = getProgress(objective.keyResults);
          const category = getCategoryById(objective.category);
          const categoryStyle = category ? categoryColors[category.color as keyof typeof categoryColors] : categoryColors.blue;
          
          return (
            <div key={objective.id} className="rounded-lg shadow-sm border p-6 transition-colors" style={{
              backgroundColor: 'rgb(var(--color-surface))',
              borderColor: 'rgb(var(--color-border))'
            }}>
              {/* Objective Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
                      {category?.icon && <span>{category.icon}</span>}
                      <span>{category?.name}</span>
                    </span>
                    <span className="text-sm" style={{ color: 'rgb(var(--color-text-muted))' }}>
                      {new Date(objective.startDate).toLocaleDateString('fr-FR')} - {new Date(objective.endDate).toLocaleDateString('fr-FR')}
                    </span>
                    {/* AJOUT: Affichage du temps estimé */}
                    <span className="text-sm flex items-center gap-1" style={{ color: 'rgb(var(--color-text-muted))' }}>
                      <Clock size={14} />
                      {objective.estimatedTime} min
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1" style={{ color: 'rgb(var(--color-text-primary))' }}>{objective.title}</h3>
                  <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{objective.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={() => setEditingObjective(objective.id)}
                    className="p-1 transition-colors"
                    style={{ color: 'rgb(var(--color-text-muted))' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(var(--color-text-secondary))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(var(--color-text-muted))'}
                    title="Modifier l'objectif"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button className="p-1 transition-colors" style={{ color: 'rgb(var(--color-text-muted))' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(var(--color-error))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(var(--color-text-muted))'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-secondary))' }}>Progression globale</span>
                  <span className="text-sm font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>{progress}%</span>
                </div>
                <div className="w-full rounded-full h-2" style={{ backgroundColor: 'rgb(var(--color-border-muted))' }}>
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ backgroundColor: 'rgb(var(--color-accent))', width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Key Results */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>Résultats Clés</h4>
                {objective.keyResults.map(keyResult => {
                  const krProgress = Math.min((keyResult.currentValue / keyResult.targetValue) * 100, 100);
                  
                  return (
                    <div key={keyResult.id} className="rounded-lg p-3 transition-colors" style={{ backgroundColor: 'rgb(var(--color-hover))' }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>{keyResult.title}</span>
                        <div className="flex items-center gap-2">
                          {/* AJOUT: Affichage du temps estimé pour chaque résultat clé */}
                          <span className="text-xs flex items-center gap-1" style={{ color: 'rgb(var(--color-text-muted))' }}>
                            <Clock size={12} />
                            {keyResult.estimatedTime}min
                          </span>
                          {keyResult.completed ? (
                            <CheckCircle size={16} className="text-green-500 dark:text-green-400" />
                          ) : (
                            <Circle size={16} style={{ color: 'rgb(var(--color-text-muted))' }} />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={keyResult.currentValue}
                          onChange={(e) => updateKeyResult(objective.id, keyResult.id, Number(e.target.value))}
                          className="w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                          style={{
                            backgroundColor: 'rgb(var(--color-surface))',
                            color: 'rgb(var(--color-text-primary))',
                            borderColor: 'rgb(var(--color-border))'
                          }}
                        />
                        <span className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>/ {keyResult.targetValue}</span>
                        <div className="flex-1 rounded-full h-1.5 ml-3" style={{ backgroundColor: 'rgb(var(--color-border-muted))' }}>
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              keyResult.completed ? 'bg-green-500 dark:bg-green-400' : 'bg-primary-600 dark:bg-primary-500'
                            }`}
                            style={{ width: `${krProgress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-10 text-right" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                          {Math.round(krProgress)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <CategoryManagerModal
          categories={categories}
          onAddCategory={addCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={deleteCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}

      {/* Edit Objective Modal */}
      {editingObjective && (
        <OKRModal
          okr={objectives.find(obj => obj.id === editingObjective)!}
          isOpen={!!editingObjective}
          onClose={() => setEditingObjective(null)}
        />
      )}

      {/* Add Objective Modal */}
      {showAddObjective && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto transition-colors" style={{ backgroundColor: 'rgb(var(--color-surface))' }}>
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-primary-50 dark:from-primary-900/20 to-purple-50 dark:to-purple-900/20 transition-colors" style={{ borderColor: 'rgb(var(--color-border))' }}>
              <h2 className="text-xl font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>Nouvel Objectif</h2>
              <button 
                onClick={() => setShowAddObjective(false)}
                className="p-1 rounded-lg transition-colors"
                style={{ color: 'rgb(var(--color-text-muted))' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgb(var(--color-text-primary))';
                  e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgb(var(--color-text-muted))';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitObjective} className="p-6 space-y-6">
              {/* Informations principales */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                      🎯 Titre de l'objectif *
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
                      📝 Description
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
                      🏷️ Catégorie
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
                        📅 Date début
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
                        🏁 Date fin
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

                  {/* AJOUT: Champ temps estimé pour l'objectif */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                      ⏱️ Temps estimé total (minutes) *
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

              {/* Résultats Clés Dynamiques */}
              <div className="bg-gradient-to-r from-gray-50 dark:from-gray-800 to-blue-50 dark:to-blue-900/20 p-6 rounded-lg border transition-colors" style={{ borderColor: 'rgb(var(--color-border))' }}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                    🎯 Résultats Clés
                    <span className="text-sm font-normal" style={{ color: 'rgb(var(--color-text-muted))' }}>({keyResults.length}/10)</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={addKeyResult}
                      disabled={keyResults.length >= 10}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 dark:bg-green-500 text-white rounded-lg text-sm hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={16} />
                      <span>Ajouter</span>
                    </button>
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
                          <button
                            type="button"
                            onClick={() => removeKeyResult(index)}
                            className="ml-auto p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Supprimer ce résultat clé"
                          >
                            <Minus size={16} />
                          </button>
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

                        {/* AJOUT: Champ temps estimé pour chaque résultat clé */}
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

              {/* Action - Bouton unique Valider */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  ✅ Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant pour gérer les catégories
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
          {/* Ajouter une nouvelle catégorie */}
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

          {/* Liste des catégories existantes */}
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
