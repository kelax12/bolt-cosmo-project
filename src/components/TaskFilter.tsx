import React, { useState } from 'react';
import { ChevronDown, Filter, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TaskFilterProps = {
  onFilterChange: (value: string) => void;
  currentFilter: string;
  showCompleted?: boolean;
  onShowCompletedChange?: (show: boolean) => void;
};

const TaskFilter: React.FC<TaskFilterProps> = ({ 
  onFilterChange, 
  currentFilter, 
  showCompleted = false,
  onShowCompletedChange 
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priorityRange, setPriorityRange] = useState<[number, number]>([1, 5]);

  const categories = [
    { value: 'red', label: 'Réviser textes', color: '#EF4444' },
    { value: 'blue', label: 'Texte à fichées', color: '#3B82F6' },
    { value: 'green', label: 'Apprendre textes', color: '#10B981' },
    { value: 'purple', label: 'Autres taches', color: '#8B5CF6' },
    { value: 'orange', label: 'Entrainement dissert', color: '#F97316' },
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setPriorityRange([1, 5]);
    onFilterChange('');
    onShowCompletedChange?.(false);
  };

  const hasActiveFilters = searchTerm || selectedCategories.length > 0 || 
                          priorityRange[0] !== 1 || priorityRange[1] !== 5 || 
                          showCompleted;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="task-filter" className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-secondary))' }}>
            Trier par :
          </label>
          <div className="relative">
            <select
              id="task-filter"
              className="appearance-none border rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              style={{ 
                backgroundColor: 'rgb(var(--color-surface))',
                borderColor: 'rgb(var(--color-border))',
                color: 'rgb(var(--color-text-primary))'
              }}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'completed') {
                  onShowCompletedChange?.(true);
                  onFilterChange('');
                } else {
                  onShowCompletedChange?.(false);
                  onFilterChange(value);
                }
              }}
              value={showCompleted ? 'completed' : currentFilter}
              aria-label="Trier les tâches par"
            >
              <option value="">Toutes les tâches</option>
              <option value="priority">Par priorité</option>
              <option value="deadline">Par échéance</option>
              <option value="createdAt">Par date de création</option>
              <option value="name">Par nom</option>
              <option value="category">Par catégorie</option>
              <option value="completed">Tâches complétées</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2" style={{ color: 'rgb(var(--color-text-muted))' }}>
              <ChevronDown size={16} aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm ${
            showAdvancedFilters || hasActiveFilters
              ? 'bg-blue-600 text-white border-2 border-blue-700'
              : 'bg-slate-100 text-slate-700 hover:bg-blue-50 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700'
          }`}
          aria-label={showAdvancedFilters ? "Masquer les filtres avancés" : "Afficher les filtres avancés"}
          aria-expanded={showAdvancedFilters}
        >
          <Filter size={18} aria-hidden="true" />
          <span>Filtres</span>
          {hasActiveFilters && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white dark:bg-blue-500 text-blue-600 dark:text-white text-xs px-2 py-0.5 rounded-full font-bold"
              aria-label={`${[searchTerm, ...selectedCategories, showCompleted ? 'completed' : ''].filter(Boolean).length} filtres actifs`}
            >
              {[searchTerm, ...selectedCategories, showCompleted ? 'completed' : ''].filter(Boolean).length}
            </motion.span>
          )}
        </motion.button>

        {/* Clear Filters */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all shadow-sm"
              aria-label="Réinitialiser tous les filtres"
            >
              <X size={18} aria-hidden="true" />
              <span>Réinitialiser</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="p-6 rounded-xl border shadow-lg space-y-6"
              style={{
                backgroundColor: 'rgb(var(--color-surface))',
                borderColor: 'rgb(var(--color-border))'
              }}
            >
              {/* Search */}
              <div>
                <label htmlFor="search-tasks" className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                  🔍 Rechercher
                </label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    id="search-tasks"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher une tâche..."
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    style={{
                      backgroundColor: 'rgb(var(--color-surface))',
                      borderColor: 'rgb(var(--color-border))',
                      color: 'rgb(var(--color-text-primary))'
                    }}
                    aria-label="Rechercher une tâche par nom"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      aria-label="Effacer la recherche"
                    >
                      <X size={18} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories Filter */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                  🏷️ Filtrer par catégories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCategory(category.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategories.includes(category.value)
                          ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md border-2 border-slate-900 dark:border-slate-100'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
                      }`}
                      aria-label={`${selectedCategories.includes(category.value) ? 'Retirer' : 'Ajouter'} le filtre ${category.label}`}
                      aria-pressed={selectedCategories.includes(category.value)}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                        aria-hidden="true"
                      />
                      <span>{category.label}</span>
                      {selectedCategories.includes(category.value) && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          aria-hidden="true"
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Priority Range */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                  🎯 Filtrer par priorité: {priorityRange[0]} - {priorityRange[1]}
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>Min: 1</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={priorityRange[0]}
                    onChange={(e) => setPriorityRange([Number(e.target.value), priorityRange[1]])}
                    className="flex-1 h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    aria-label="Priorité minimale"
                  />
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={priorityRange[1]}
                    onChange={(e) => setPriorityRange([priorityRange[0], Number(e.target.value)])}
                    className="flex-1 h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    aria-label="Priorité maximale"
                  />
                  <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>Max: 5</span>
                </div>
                <div className="flex justify-between mt-2">
                  {[1, 2, 3, 4, 5].map(priority => (
                    <span 
                      key={priority}
                      className={`text-xs ${
                        priority >= priorityRange[0] && priority <= priorityRange[1]
                          ? 'text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-400'
                      }`}
                      aria-hidden="true"
                    >
                      {priority}
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'rgb(var(--color-hover))',
                    borderColor: 'rgb(var(--color-border))'
                  }}
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                      Filtres actifs
                    </span>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline"
                      aria-label="Effacer tous les filtres"
                    >
                      Tout effacer
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">
                        Recherche: "{searchTerm}"
                      </span>
                    )}
                    {selectedCategories.map(cat => (
                      <span key={cat} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs">
                        {categories.find(c => c.value === cat)?.label}
                      </span>
                    ))}
                    {showCompleted && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs">
                        Complétées
                      </span>
                    )}
                    {(priorityRange[0] !== 1 || priorityRange[1] !== 5) && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-xs">
                        Priorité: {priorityRange[0]}-{priorityRange[1]}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskFilter;
