import React, { useState } from 'react';
import { Settings, User, Bell, Palette, Shield } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import ThemeToggle from '../components/ThemeToggle';

const SettingsPage: React.FC = () => {
  const { user, updateUserSettings } = useTasks();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance' | 'privacy'>('profile');

  if (!user) return null;

  const handleAutoValidationChange = (autoValidation: boolean) => {
    updateUserSettings({ autoValidation });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Paramètres</h1>
          <p className="text-gray-600">Personnalisez votre expérience Cosmo</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Menu latéral */}
        <div className="col-span-3 card p-6">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User size={20} />
              <span className="font-bold">Profil</span>
            </button>
            
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                activeTab === 'notifications' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Bell size={20} />
              <span className="font-bold">Notifications</span>
            </button>
            
            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                activeTab === 'appearance' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Palette size={20} />
              <span className="font-bold">Apparence</span>
            </button>
            
            <button
              onClick={() => setActiveTab('privacy')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                activeTab === 'privacy' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Shield size={20} />
              <span className="font-bold">Confidentialité</span>
            </button>
          </nav>
        </div>

        {/* Contenu principal */}
        <div className="col-span-9 card p-8">
          
          {/* Profil */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations du profil</h2>
                
                <div className="space-y-6">
                  {/* Photo de profil */}
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Photo de profil</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Ajoutez une photo pour personnaliser votre profil
                      </p>
                      <button className="btn-secondary">
                        Changer la photo
                      </button>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => updateUserSettings({ name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 neomorphic-inset"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => updateUserSettings({ email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 neomorphic-inset"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Préférences de notification</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <h3 className="font-bold text-gray-900">Notifications push</h3>
                      <p className="text-gray-600 text-sm">Recevoir des notifications sur votre appareil</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <h3 className="font-bold text-gray-900">Notifications email</h3>
                      <p className="text-gray-600 text-sm">Recevoir des emails pour les événements importants</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <h3 className="font-bold text-gray-900">Rappels de tâches</h3>
                      <p className="text-gray-600 text-sm">Être notifié des deadlines approchantes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Apparence */}
          {activeTab === 'appearance' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Apparence</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Thème</h3>
                    <ThemeToggle showLabel={true} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confidentialité */}
          {activeTab === 'privacy' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Confidentialité et sécurité</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <h3 className="font-bold text-gray-900">Validation automatique des tâches</h3>
                      <p className="text-gray-600 text-sm">
                        Accepter automatiquement les tâches partagées sans demander confirmation
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={user.autoValidation}
                        onChange={(e) => handleAutoValidationChange(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
                    <h3 className="font-bold text-red-900 mb-2">Zone de danger</h3>
                    <p className="text-red-700 text-sm mb-4">
                      Ces actions sont irréversibles. Procédez avec prudence.
                    </p>
                    <div className="space-y-3">
                      <button className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-3 px-4 rounded-2xl font-bold transition-colors">
                        Supprimer toutes les données
                      </button>
                      <button className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-3 px-4 rounded-2xl font-bold transition-colors">
                        Supprimer le compte
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bouton de sauvegarde */}
          <div className="flex justify-end pt-8 border-t border-gray-200">
            <button className="btn-primary px-8">
              Sauvegarder les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;