import React from 'react';
import { ChevronDown } from 'lucide-react';

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
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="task-filter" className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-secondary))' }}>
          Trier par :
        </label>
        <div className="relative">
          <select
            id="task-filter"
            className="appearance-none border rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
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
          >
            <option value="">Choisis une option</option>
            <option value="priority">Priorité</option>
            <option value="deadline">Date limite</option>
            <option value="createdAt">Date de création</option>
            <option value="name">Nom</option>
            <option value="category">Catégorie</option>
            <option value="completed">Tâches réalisées</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2" style={{ color: 'rgb(var(--color-text-muted))' }}>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;