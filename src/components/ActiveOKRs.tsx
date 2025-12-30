import React from 'react';
import { Target, TrendingUp, Clock } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const ActiveOKRs: React.FC = () => {
  const { okrs } = useTasks();
  
  const activeOKRs = okrs.filter(okr => !okr.completed).slice(0, 3);

  const getProgress = (keyResults: any[]) => {
    if (keyResults.length === 0) return 0;
    const totalProgress = keyResults.reduce((sum, kr) => {
      return sum + Math.min((kr.currentValue / kr.targetValue) * 100, 100);
    }, 0);
    return Math.round(totalProgress / keyResults.length);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-xl">
          <Target size={24} className="text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">OKR en cours</h2>
          <p className="text-gray-600 text-sm">{activeOKRs.length} objectifs actifs</p>
        </div>
      </div>

      <div className="space-y-4">
        {activeOKRs.map(okr => {
          const progress = getProgress(okr.keyResults);
          
          return (
            <div key={okr.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">{okr.title}</h3>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-500" />
                  <span className="font-bold text-green-600">{progress}%</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} className="text-gray-400" />
                  <span className="font-medium">
                    {okr.keyResults.reduce((sum: number, kr: any) => sum + (kr.currentValue * kr.estimatedTime), 0)} / {okr.keyResults.reduce((sum: number, kr: any) => sum + (kr.estimatedTime * kr.targetValue), 0)} min
                  </span>
                </div>
                <p className="mb-1">{okr.keyResults.length} résultats clés</p>
                <p>Échéance: {new Date(okr.endDate).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          );
        })}

        {activeOKRs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Target size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Aucun OKR actif</p>
            <p className="text-sm">Définissez vos objectifs dans la section OKR</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveOKRs;
