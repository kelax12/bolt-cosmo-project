import React, { useState } from 'react';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { useTasks, TaskList } from '../context/TaskContext';

const ListManager: React.FC = () => {
  const { lists, addList, deleteList, updateList } = useTasks();
  const [isCreating, setIsCreating] = useState(false);
  const [editingList, setEditingList] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListColor, setNewListColor] = useState('blue');
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('blue');

  const colorOptions = [
    { value: 'blue', color: '#3B82F6', name: 'Bleu' },
    { value: 'red', color: '#EF4444', name: 'Rouge' },
    { value: 'green', color: '#10B981', name: 'Vert' },
    { value: 'purple', color: '#8B5CF6', name: 'Violet' },
    { value: 'orange', color: '#F97316', name: 'Orange' },
    { value: 'yellow', color: '#F59E0B', name: 'Jaune' },
    { value: 'pink', color: '#EC4899', name: 'Rose' },
    { value: 'indigo', color: '#6366F1', name: 'Indigo' },
  ];

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    
    const newList: TaskList = {
      id: Date.now().toString(),
      name: newListName,
      taskIds: [],
      color: newListColor
    };
    
    addList(newList);
    setNewListName('');
    setNewListColor('blue');
    setIsCreating(false);
  };

  const handleEditList = (listId: string) => {
    const list = lists.find(l => l.id === listId);
    if (list) {
      setEditingList(listId);
      setEditName(list.name);
      setEditColor(list.color);
    }
  };

  const handleSaveEdit = () => {
    if (!editName.trim() || !editingList) return;
    
    updateList(editingList, {
      name: editName,
      color: editColor
    });
    
    setEditingList(null);
    setEditName('');
    setEditColor('blue');
  };

  const handleCancelEdit = () => {
    setEditingList(null);
    setEditName('');
    setEditColor('blue');
  };

  return (
    <div className="p-6 rounded-lg shadow-sm border transition-colors" style={{
      backgroundColor: 'rgb(var(--color-surface))',
      borderColor: 'rgb(var(--color-border))'
    }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>Gestion des listes</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Nouvelle liste</span>
        </button>
      </div>

      {/* Create new list form */}
      {isCreating && (
        <div className="p-4 rounded-lg mb-6 transition-colors" style={{ backgroundColor: 'rgb(var(--color-hover))' }}>
          <h3 className="text-lg font-medium mb-4" style={{ color: 'rgb(var(--color-text-primary))' }}>Créer une nouvelle liste</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                Nom de la liste
              </label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                style={{
                  backgroundColor: 'rgb(var(--color-surface))',
                  color: 'rgb(var(--color-text-primary))',
                  borderColor: 'rgb(var(--color-border))'
                }}
                placeholder="Entrez le nom de la liste"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                Couleur
              </label>
              <select
                value={newListColor}
                onChange={(e) => setNewListColor(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                style={{
                  backgroundColor: 'rgb(var(--color-surface))',
                  color: 'rgb(var(--color-text-primary))',
                  borderColor: 'rgb(var(--color-border))'
                }}
              >
                {colorOptions.map(color => (
                  <option key={color.value} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsCreating(false)}
              className="px-6 py-3 rounded-lg transition-all font-medium"
              style={{
                backgroundColor: 'rgb(var(--color-hover))',
                color: 'rgb(var(--color-text-secondary))'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--color-active))'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover))'}
            >
              Annuler
            </button>
            <button
              onClick={handleCreateList}
              className="px-6 py-3 rounded-lg transition-all font-medium text-white"
              style={{ backgroundColor: 'rgb(var(--nav-item-active-bg))' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Créer
            </button>
          </div>
        </div>
      )}

      {/* Lists grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.map(list => (
          <div key={list.id} className="border rounded-lg p-4 transition-colors" style={{
            backgroundColor: 'rgb(var(--color-surface))',
            borderColor: 'rgb(var(--color-border))'
          }}>
            {editingList === list.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  style={{
                    backgroundColor: 'rgb(var(--color-surface))',
                    color: 'rgb(var(--color-text-primary))',
                    borderColor: 'rgb(var(--color-border))'
                  }}
                />
                <select
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  style={{
                    backgroundColor: 'rgb(var(--color-surface))',
                    color: 'rgb(var(--color-text-primary))',
                    borderColor: 'rgb(var(--color-border))'
                  }}
                >
                  {colorOptions.map(color => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 transition-colors"
                    style={{ color: 'rgb(var(--color-text-muted))' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(var(--color-text-secondary))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(var(--color-text-muted))'}
                  >
                    <X size={16} />
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="p-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                  >
                    <Check size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: colorOptions.find(c => c.value === list.color)?.color || '#3B82F6' }}
                  />
                  <span className="font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>{list.name}</span>
                </div>
                <div className="text-sm mb-3" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                  {list.taskIds.length} tâche{list.taskIds.length !== 1 ? 's' : ''}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEditList(list.id)}
                    className="p-1 transition-colors"
                    style={{ color: 'rgb(var(--color-text-muted))' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(var(--color-text-secondary))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(var(--color-text-muted))'}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteList(list.id)}
                    className="p-1 transition-colors"
                    style={{ color: 'rgb(var(--color-text-muted))' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(var(--color-error))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(var(--color-text-muted))'}
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
  );
};

export default ListManager;
