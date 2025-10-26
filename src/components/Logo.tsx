import React from 'react';
import { Target } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-xl transition-colors" style={{ backgroundColor: 'rgb(var(--nav-item-active-bg))', color: 'rgb(var(--nav-item-active-text))' }}>
        <Target size={20} />
      </div>
      <div>
        <span className="text-xl font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>Cosmo</span>
        <div className="text-xs font-medium" style={{ color: 'rgb(var(--color-text-muted))' }}>Task Manager</div>
      </div>
    </div>
  );
};

export default Logo;