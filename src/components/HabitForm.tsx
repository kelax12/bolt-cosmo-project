import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

interface HabitFormProps {
  onClose: () => void;
}

const colorOptions = [
  { value: 'blue', color: '#3B82F6', name: 'Bleu' },
  { value: 'green', color: '#10B981', name: 'Vert' },
  { value: 'purple', color: '#8B5CF6', name: 'Violet' },
  { value: 'orange', color: '#F97316', name: 'Orange' },
  { value: 'red', color: '#EF4444', name: 'Rouge' },
  { value: 'pink', color: '#EC4899', name: 'Rose' },
];

const HabitForm: React.FC<HabitFormProps> = ({ onClose }) => {
  const { addHabit } = useTasks();
  const [formData, setFormData] = useState({
    name: '',
    estimatedTime: 30,
    color: 'blue'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const habit = {
      id: Date.now().toString(),
      name: formData.name,
      estimatedTime: formData.estimatedTime,
      completions: {},
      streak: 0,
      color: formData.color
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
          <label className="block text-sm font-medium mb-3" style={{ color: 'rgb(var(--color-text-secondary))' }}>
            Couleur
          </label>
          <div className="flex gap-3">
            {colorOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, color: option.value })}
                className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-105 ${
                  formData.color === option.value ? 'scale-110' : ''
                }`}
                style={{
                  backgroundColor: option.color,
                  borderColor: formData.color === option.value ? 'rgb(var(--color-text-primary))' : 'rgb(var(--color-border))'
                }}
                title={option.name}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-3 rounded-lg transition-colors"
            style={{ color: 'rgb(var(--color-text-secondary))' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgb(var(--color-text-primary))';
              e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgb(var(--color-text-secondary))';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            Créer l'habitude
          </button>
        </div>
      </form>
    </div>
  );
};

export default HabitForm;
