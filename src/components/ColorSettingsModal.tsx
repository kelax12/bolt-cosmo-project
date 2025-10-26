import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTasks, ColorSettings } from '../context/TaskContext';

type ColorSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ColorSettingsModal: React.FC<ColorSettingsModalProps> = ({ isOpen, onClose }) => {
  const { colorSettings, updateColorSettings } = useTasks();
  const [localSettings, setLocalSettings] = useState<ColorSettings>(colorSettings);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateColorSettings(localSettings);
    onClose();
  };

  const handleColorChange = (color: keyof ColorSettings, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [color]: value
    }));
  };

  const colorOptions = [
    { key: 'blue' as const, color: '#3B82F6', defaultValue: 'Texte à fichées' },
    { key: 'red' as const, color: '#EF4444', defaultValue: 'Réviser textes' },
    { key: 'orange' as const, color: '#F97316', defaultValue: 'Entrainement dissert' },
    { key: 'green' as const, color: '#10B981', defaultValue: 'Apprendre textes' },
    { key: 'purple' as const, color: '#8B5CF6', defaultValue: 'Autres taches' },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div
        className="rounded-2xl shadow-xl p-6 w-full max-w-md transition-colors"
        style={{ backgroundColor: 'rgb(var(--color-surface))' }}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center mb-6 border-b pb-3"
          style={{ borderColor: 'rgb(var(--color-border))' }}
        >
          <h2
            className="text-xl font-bold"
            style={{ color: 'rgb(var(--color-text-primary))' }}
          >
            Définir des états personnalisés
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {colorOptions.map(({ key, color, defaultValue }) => (
            <div key={key} className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: color }}
              />
              <input
                type="text"
                value={localSettings[key]}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'rgb(var(--color-surface))',
                  border: `1px solid rgb(var(--color-border))`,
                  color: 'rgb(var(--color-text-primary))'
                }}
                placeholder={defaultValue}
              />
            </div>
          ))}

          {/* Footer */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-8 py-3 rounded-lg transition-colors duration-200 font-medium"
              style={{
                backgroundColor: 'rgb(var(--color-active))',
                color: 'rgb(var(--color-text-primary))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(var(--color-active))';
              }}
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ColorSettingsModal;
