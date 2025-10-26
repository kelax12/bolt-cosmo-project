import React, { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';

const DashboardChart: React.FC = () => {
  // Données simulées pour les 7 derniers jours
  const chartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Générer des données réalistes
      const baseTime = 60; // 1 heure de base
      const variation = Math.sin((i * Math.PI) / 6) * 30;
      const randomFactor = (Math.random() - 0.5) * 20;
      const totalTime = Math.max(0, baseTime + variation + randomFactor);
      
      days.push({
        date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        time: Math.round(totalTime),
        fullDate: date.toLocaleDateString('fr-FR')
      });
    }
    return days;
  }, []);

  const maxTime = Math.max(...chartData.map(d => d.time));
  const chartHeight = 200;

  return (
    <div className="card p-8 dark:bg-slate-800">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-slate-100 rounded-xl">
          <BarChart3 size={24} className="text-slate-700" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Temps de travail quotidien</h2>
          <p className="text-slate-600 text-sm">7 derniers jours</p>
        </div>
      </div>

      {/* Graphique en barres */}
      <div className="relative">
        <div className="flex items-end justify-between gap-3" style={{ height: `${chartHeight}px` }}>
          {chartData.map((day, index) => {
            const barHeight = (day.time / maxTime) * (chartHeight - 40);
            const isToday = index === chartData.length - 1;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative flex-1 flex items-end">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isToday 
                        ? 'bg-slate-900' 
                        : 'bg-slate-300'
                    }`}
                    style={{ height: `${barHeight}px` }}
                  >
                    {/* Valeur au-dessus de la barre */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                      <span className={`text-xs font-semibold ${isToday ? 'text-slate-900' : 'text-slate-600'}`}>
                        {Math.floor(day.time / 60)}h{day.time % 60}min
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Label du jour */}
                <div className="mt-4 text-center">
                  <div className={`text-sm font-semibold ${isToday ? 'text-slate-900' : 'text-slate-600'}`}>
                    {day.date}
                  </div>
                  <div className="text-xs text-slate-500">
                    {day.fullDate}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistiques */}
      <div className="mt-8 grid grid-cols-3 gap-6 pt-6 border-t border-slate-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">
            {Math.floor(chartData[chartData.length - 1].time / 60)}h{chartData[chartData.length - 1].time % 60}min
          </div>
          <div className="text-xs text-slate-600">Aujourd'hui</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.floor(chartData.reduce((sum, d) => sum + d.time, 0) / chartData.length / 60)}h
          </div>
          <div className="text-xs text-slate-600">Moyenne</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.floor(chartData.reduce((sum, d) => sum + d.time, 0) / 60)}h
          </div>
          <div className="text-xs text-slate-600">Total semaine</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;