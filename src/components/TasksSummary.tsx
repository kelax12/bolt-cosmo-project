import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import ColorSettingsModal from './ColorSettingsModal';

const TasksSummary: React.FC = () => {
  const { tasks, colorSettings } = useTasks();
  const [showColorSettings, setShowColorSettings] = useState(false);
  
  // Filter out completed tasks and count by category
  const activeTasks = tasks.filter(task => !task.completed);
  const categoryCounts = {
    red: activeTasks.filter(task => task.category === 'red').length,
    blue: activeTasks.filter(task => task.category === 'blue').length,
    green: activeTasks.filter(task => task.category === 'green').length,
    purple: activeTasks.filter(task => task.category === 'purple').length,
    orange: activeTasks.filter(task => task.category === 'orange').length,
  };

  const totalTasks = activeTasks.length;

  return (
    <>
      <div className="card p-6 relative">
        <button
          onClick={() => setShowColorSettings(true)}
          className="absolute top-[5px] right-[5px] p-2 rounded-lg transition-colors"
          style={{ color: 'rgb(var(--color-text-muted))' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'rgb(var(--color-text-secondary))';
            e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgb(var(--color-text-muted))';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Modifier la légende des couleurs"
        >
          <Settings size={18} />
        </button>
        
        <h2 className="text-xl font-bold mb-4 pr-12" style={{ color: 'rgb(var(--color-text-primary))' }}>Taches en cour : {totalTasks}</h2>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="task-category-red w-4 h-4 rounded"></div>
            <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>{colorSettings.red}</span>
            <span className="ml-auto text-sm font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>{categoryCounts.red}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="task-category-blue w-4 h-4 rounded"></div>
            <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>{colorSettings.blue}</span>
            <span className="ml-auto text-sm font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>{categoryCounts.blue}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="task-category-green w-4 h-4 rounded"></div>
            <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>{colorSettings.green}</span>
            <span className="ml-auto text-sm font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>{categoryCounts.green}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="task-category-purple w-4 h-4 rounded"></div>
            <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>{colorSettings.purple}</span>
            <span className="ml-auto text-sm font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>{categoryCounts.purple}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="task-category-orange w-4 h-4 rounded"></div>
            <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>{colorSettings.orange}</span>
            <span className="ml-auto text-sm font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>{categoryCounts.orange}</span>
          </div>
        </div>
      </div>

      <ColorSettingsModal
        isOpen={showColorSettings}
        onClose={() => setShowColorSettings(false)}
      />
    </>
  );
};

export default TasksSummary;