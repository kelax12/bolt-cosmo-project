import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import ColorSettingsModal from './ColorSettingsModal';

interface HabitFormProps {
  onClose: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ onClose }) => {
  const { addHabit, favoriteColors, categories } = useTasks();
  const [formData, setFormData] = useState({
    name: '',
    estimatedTime: 30,
    color: favoriteColors[0] || '#3B82F6'
  });
  const [isColorSettingsOpen, setIsColorSettingsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const habit = {
      id: Date.now().toString(),
      name: formData.name,
      estimatedTime: formData.estimatedTime,
      completions: {},
      streak: 0,
      color: formData.color,
      createdAt: new Date().toISOString()
    };

    addHabit(habit);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="rounded-xl shadow-lg border p-6 transition-colors" style={{
      backgroundColor: 'rgb(var(--color-surface))',
      borderColor: 'rgb(var(--color-border))'
    }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold" style={{ color: 'rgb(var(--color-text-primary))' }}>Nouvelle habitude</h2>
        <button 
          onClick={onClose} 
          className="transition-colors"
          style={{ color: 'rgb(var(--color-text-muted))' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(var(--color-text-secondary))'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(var(--color-text-muted))'}
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
              Nom de l'habitude
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              style={{
                backgroundColor: 'rgb(var(--color-surface))',
                color: 'rgb(var(--color-text-primary))',
                borderColor: 'rgb(var(--color-border))'
              }}
              placeholder="Ex: Lire 30 minutes, Faire du sport..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
              Temps estimé (min)
            </label>
            <input
              type="number"
              value={formData.estimatedTime}
              onChange={(e) => setFormData({ ...formData, estimatedTime: Number(e.target.value) })}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              style={{
                backgroundColor: 'rgb(var(--color-surface))',
                color: 'rgb(var(--color-text-primary))',
                borderColor: 'rgb(var(--color-border))'
              }}
              min="1"
              required
            />
          </div>
        </div>

          <div>
            <label className="flex justify-between items-center text-sm font-medium mb-3" style={{ color: 'rgb(var(--color-text-secondary))' }}>
              <span>Couleur</span>
              <Plus 
                className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-125 transition-transform" 
                onClick={() => setIsColorSettingsOpen(true)}
              />
            </label>
            <div className="flex flex-wrap gap-3">
              {favoriteColors.map((favColor, index) => (
                <button
                  key={`${favColor}-${index}`}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: favColor })}
                  className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-105 ${
                    formData.color === favColor ? 'scale-110 shadow-lg' : ''
                  }`}
                  style={{
                    backgroundColor: favColor,
                    borderColor: formData.color === favColor ? 'rgb(var(--color-text-primary))' : 'rgb(var(--color-border))'
                  }}
                />
              ))}
            </div>
            
            {categories.length > 0 && (
              <div
                className="mt-4 p-2.5 rounded-xl border bg-opacity-30 transition-colors"
                style={{ borderColor: 'rgb(var(--color-border))' }}
              >
                <h4 className="text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgb(var(--color-text-muted))' }}>
                  Légende des catégories
                </h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                      <span className="text-[13px] font-medium truncate" style={{ color: 'rgb(var(--color-text-primary))' }}>
                        {cat.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>


          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white shadow-lg shadow-blue-500/25 transform transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            >
              Créer l'habitude
            </button>
          </div>
      </form>
      
      <ColorSettingsModal 
        isOpen={isColorSettingsOpen} 
        onClose={() => setIsColorSettingsOpen(false)} 
      />
    </div>
  );
};

export default HabitForm;
