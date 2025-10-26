import React, { useState } from 'react';
import { BarChart3, Clock, TrendingUp, Calendar, ChevronDown, Target, CheckSquare, Repeat, CalendarDays, Settings } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

type StatSection = 'tasks' | 'agenda' | 'okr' | 'habits';
type TimePeriod = 'day' | 'week' | 'month' | 'year';

export default function StatisticsPage() {
  const { tasks, events, colorSettings } = useTasks();
  const [selectedSection, setSelectedSection] = useState<StatSection>('tasks');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('week');
  const [showReferenceBar, setShowReferenceBar] = useState(true);
  const [referenceValue, setReferenceValue] = useState(60);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Données simulées pour les habitudes et OKR
  const mockHabits = [
    { id: '1', name: 'Lire 30 minutes', estimatedTime: 30, completions: { '2025-01-15': true, '2025-01-14': true } },
    { id: '2', name: 'Exercice physique', estimatedTime: 60, completions: { '2025-01-15': true } }
  ];

  const mockOKRs = [
    { id: '1', title: 'Améliorer français', estimatedTime: 180, keyResults: [{ estimatedTime: 60 }, { estimatedTime: 90 }] },
    { id: '2', title: 'Optimiser productivité', estimatedTime: 120, keyResults: [{ estimatedTime: 60 }, { estimatedTime: 60 }] }
  ];

  const getPeriodDetails = (period: TimePeriod, periodDate: Date) => {
    const details = {
      completedTasks: [] as any[],
      events: [] as any[],
      habits: [] as any[],
      totalTime: 0
    };

    let startDate: Date, endDate: Date;

    if (period === 'day') {
      startDate = new Date(periodDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(periodDate);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === 'week') {
      startDate = new Date(periodDate);
      endDate = new Date(periodDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === 'month') {
      startDate = new Date(periodDate.getFullYear(), periodDate.getMonth(), 1);
      endDate = new Date(periodDate.getFullYear(), periodDate.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === 'year') {
      startDate = new Date(periodDate.getFullYear(), 0, 1);
      endDate = new Date(periodDate.getFullYear(), 11, 31);
      endDate.setHours(23, 59, 59, 999);
    } else {
      return details;
    }

    details.completedTasks = tasks.filter(task => {
      if (!task.completed || !task.completedAt) return false;
      const taskDate = new Date(task.completedAt);
      return taskDate >= startDate && taskDate <= endDate;
    });

    details.events = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= startDate && eventDate <= endDate;
    });

    details.habits = mockHabits.filter(habit => {
      return Object.keys(habit.completions).some(date => {
        const habitDate = new Date(date);
        return habitDate >= startDate && habitDate <= endDate && habit.completions[date];
      });
    });

    details.totalTime += details.completedTasks.reduce((sum, task) => sum + task.estimatedTime, 0);
    
    details.events.forEach(event => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      details.totalTime += durationMinutes;
    });

    details.habits.forEach(habit => {
      const habitCompletions = Object.keys(habit.completions).filter(date => {
        const habitDate = new Date(date);
        return habitDate >= startDate && habitDate <= endDate && habit.completions[date];
      });
      details.totalTime += habitCompletions.length * habit.estimatedTime;
    });

    return details;
  };

  const calculateWorkTime = (period: TimePeriod) => {
    const now = new Date();
    let periods = [];

    switch (period) {
      case 'day':
        for (let i = 9; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          periods.push({
            label: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
            date: date.toISOString().split('T')[0],
            fullDate: date
          });
        }
        break;
      case 'week':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - (i * 7));
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          
          const startOfYear = new Date(weekStart.getFullYear(), 0, 1);
          const weekNumber = Math.ceil(((weekStart.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
          
          periods.push({
            label: `S${weekNumber}`,
            date: weekStart.toISOString().split('T')[0],
            fullDate: weekStart,
            weekNumber: weekNumber
          });
        }
        break;
      case 'month':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          periods.push({
            label: date.toLocaleDateString('fr-FR', { month: 'short' }),
            date: date.toISOString().split('T')[0],
            fullDate: date
          });
        }
        break;
      case 'year':
        for (let i = 4; i >= 0; i--) {
          const date = new Date(now);
          date.setFullYear(date.getFullYear() - i);
          periods.push({
            label: date.getFullYear().toString(),
            date: date.toISOString().split('T')[0],
            fullDate: date
          });
        }
        break;
    }

    return periods.map((p, index) => {
      const periodDetails = getPeriodDetails(period, p.fullDate);
      
      let simulatedTime = 0;
      if (periodDetails.totalTime < 10) {
        const baseTime = 45;
        const variation = Math.sin((index * Math.PI) / (periods.length - 1)) * 30;
        const randomFactor = (Math.random() - 0.5) * 20;
        simulatedTime = Math.max(0, baseTime + variation + randomFactor);
      }

      const totalTime = Math.round(Math.max(periodDetails.totalTime, simulatedTime));

      return {
        ...p,
        totalTime: totalTime,
        hours: Math.floor(totalTime / 60),
        minutes: Math.round(totalTime % 60),
        details: periodDetails,
        index
      };
    });
  };

  const workTimeData = React.useMemo(() => calculateWorkTime(selectedPeriod), [selectedPeriod, tasks, events]);
  
  const totalWorkTime = workTimeData.reduce((sum, d) => sum + d.totalTime, 0);
  const avgWorkTime = workTimeData.length > 0 ? Math.round(totalWorkTime / workTimeData.length) : 0;
  const maxWorkTime = Math.max(...workTimeData.map(d => d.totalTime), 1);

  const globalStats = {
    today: workTimeData[workTimeData.length - 1]?.totalTime || 0,
    week: workTimeData.slice(-7).reduce((sum, d) => sum + d.totalTime, 0),
    month: workTimeData.slice(-30).reduce((sum, d) => sum + d.totalTime, 0),
    year: totalWorkTime
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins}min`;
  };

  const formatTimeShort = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h` : `${minutes}min`;
  };

  // Génération d'échelle Y améliorée pour afficher les demi-heures correctement
  const generateSmartYScale = (maxValue: number, referenceValue: number) => {
    const maxDisplayValue = Math.max(maxValue, referenceValue, 15);
    
    let step;
    if (maxDisplayValue <= 30) step = 15; // 15min, 30min, 45min, 1h, 1h15...
    else if (maxDisplayValue <= 60) step = 30; // 30min, 1h, 1h30, 2h...
    else if (maxDisplayValue <= 120) step = 30; // 30min, 1h, 1h30, 2h...
    else if (maxDisplayValue <= 240) step = 60; // 1h, 2h, 3h, 4h...
    else step = Math.ceil(maxDisplayValue / 6 / 60) * 60;
    
    const scaleMax = Math.ceil((maxDisplayValue * 1.2) / step) * step;
    
    const ticks = [];
    for (let i = 0; i <= scaleMax; i += step) {
      ticks.push(i);
    }
    
    return { ticks, max: scaleMax, step };
  };

  const yScale = React.useMemo(() => generateSmartYScale(maxWorkTime, referenceValue), [maxWorkTime, referenceValue]);
  const chartHeight = 400;

  const sections = [
    { id: 'tasks', label: 'Tâches', icon: CheckSquare },
    { id: 'agenda', label: 'Agenda', icon: CalendarDays },
    { id: 'okr', label: 'OKR', icon: Target },
    { id: 'habits', label: 'Habitudes', icon: Repeat }
  ];

  const periods = [
    { id: 'day', label: 'Par jour' },
    { id: 'week', label: 'Par semaine' },
    { id: 'month', label: 'Par mois' },
    { id: 'year', label: 'Par année' }
  ];

  const curvePoints = React.useMemo(() => {
    const padding = 60;
    const chartWidth = 800;
    const chartInnerWidth = chartWidth - (padding * 2);
    const chartInnerHeight = chartHeight - (padding * 2);
    
    return workTimeData.map((data, index) => {
      const x = padding + (index / Math.max(workTimeData.length - 1, 1)) * chartInnerWidth;
      const yRatio = data.totalTime / Math.max(yScale.max, 1);
      const y = padding + chartInnerHeight - (yRatio * chartInnerHeight);
      return { x, y, data };
    });
  }, [workTimeData, yScale.max, chartHeight]);

  const smoothPath = React.useMemo(() => {
    if (curvePoints.length < 2) return '';
    
    let path = `M ${curvePoints[0].x} ${curvePoints[0].y}`;
    
    for (let i = 1; i < curvePoints.length; i++) {
      const prev = curvePoints[i - 1];
      const curr = curvePoints[i];
      const next = curvePoints[i + 1];
      
      if (i === 1) {
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        const cp1x = prev.x + (curr.x - (curvePoints[i - 2]?.x || prev.x)) * 0.2;
        const cp1y = prev.y + (curr.y - (curvePoints[i - 2]?.y || prev.y)) * 0.2;
        const cp2x = curr.x - (next ? (next.x - prev.x) * 0.2 : (curr.x - prev.x) * 0.3);
        const cp2y = curr.y - (next ? (next.y - prev.y) * 0.2 : 0);
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }
    
    return path;
  }, [curvePoints]);

  const DetailedTooltip: React.FC<{ point: any, isVisible: boolean }> = ({ point, isVisible }) => {
    if (!isVisible || !point.data.details) return null;

    const details = point.data.details;
    const isAboveTarget = showReferenceBar && point.data.totalTime >= referenceValue;
    const progressPercent = showReferenceBar ? Math.round((point.data.totalTime / referenceValue) * 100) : 0;

    const tooltipWidth = 300;
    const tooltipHeight = 180;
    
    let left = point.x - (tooltipWidth / 2);
    let top = point.y - tooltipHeight - 15;
    
    const padding = 20;
    
    if (left < padding) {
      left = padding;
    } else if (left + tooltipWidth > 800 - padding) {
      left = 800 - tooltipWidth - padding;
    }
    
    if (top < padding) {
      top = point.y + 25;
    }

    return (
      <div 
        className="fixed bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 pointer-events-none"
        style={{
          left: `${left}px`,
          top: `${top}px`,
          width: `${tooltipWidth}px`,
          maxHeight: `${tooltipHeight}px`,
          overflowY: 'auto',
          zIndex: 9999
        }}
      >
        <div className="border-b border-slate-600 pb-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-blue-300">📅 {point.data.label}</span>
            <span className="text-2xl font-bold text-white">{formatTime(point.data.totalTime)}</span>
          </div>
          {showReferenceBar && (
            <div className="flex items-center justify-between mt-1 text-sm">
              <span className="text-slate-300">🎯 Objectif: {formatTime(referenceValue)}</span>
              <span className={`font-bold ${isAboveTarget ? 'text-green-400' : 'text-red-400'}`}>
                {progressPercent}% {isAboveTarget ? '✅' : '❌'}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm">
          {details.completedTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckSquare size={14} className="text-green-400" />
                <span className="font-semibold text-green-300">
                  Tâches ({details.completedTasks.length})
                </span>
                <span className="text-slate-400">
                  {formatTime(details.completedTasks.reduce((sum, task) => sum + task.estimatedTime, 0))}
                </span>
              </div>
              <div className="ml-4 space-y-1 max-h-16 overflow-y-auto">
                {details.completedTasks.slice(0, 3).map((task, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="truncate flex-1 mr-2" title={task.name}>
                      • {task.name}
                    </span>
                    <span className="text-slate-400">{formatTime(task.estimatedTime)}</span>
                  </div>
                ))}
                {details.completedTasks.length > 3 && (
                  <div className="text-xs text-slate-400">
                    ... et {details.completedTasks.length - 3} autre{details.completedTasks.length - 3 > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          )}

          {details.events.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays size={14} className="text-blue-400" />
                <span className="font-semibold text-blue-300">
                  Événements ({details.events.length})
                </span>
                <span className="text-slate-400">
                  {formatTime(details.events.reduce((sum, event) => {
                    const start = new Date(event.start);
                    const end = new Date(event.end);
                    return sum + ((end.getTime() - start.getTime()) / (1000 * 60));
                  }, 0))}
                </span>
              </div>
              <div className="ml-4 space-y-1 max-h-16 overflow-y-auto">
                {details.events.slice(0, 3).map((event, idx) => {
                  const start = new Date(event.start);
                  const end = new Date(event.end);
                  const duration = (end.getTime() - start.getTime()) / (1000 * 60);
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="truncate flex-1 mr-2" title={event.title}>
                        • {event.title}
                      </span>
                      <span className="text-slate-400">{formatTime(duration)}</span>
                    </div>
                  );
                })}
                {details.events.length > 3 && (
                  <div className="text-xs text-slate-400">
                    ... et {details.events.length - 3} autre{details.events.length - 3 > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          )}

          {details.habits.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Repeat size={14} className="text-purple-400" />
                <span className="font-semibold text-purple-300">
                  Habitudes ({details.habits.length})
                </span>
                <span className="text-slate-400">
                  {formatTime(details.habits.reduce((sum, habit) => sum + habit.estimatedTime, 0))}
                </span>
              </div>
              <div className="ml-4 space-y-1">
                {details.habits.map((habit, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="truncate flex-1 mr-2" title={habit.name}>
                      • {habit.name}
                    </span>
                    <span className="text-slate-400">{formatTime(habit.estimatedTime)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {details.completedTasks.length === 0 && details.events.length === 0 && details.habits.length === 0 && (
            <div className="text-center text-slate-400 py-2">
              <span>📊 Données simulées pour démonstration</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">📊 Statistiques</h1>
        <p className="text-slate-600">Analysez votre productivité et vos performances</p>
      </div>

      {/* Statistiques globales du temps de travail */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="card p-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Aujourd'hui</p>
              <p className="text-2xl font-bold text-slate-900">{formatTimeShort(globalStats.today)}</p>
              <p className="text-xs text-slate-500">Temps de travail</p>
            </div>
          </div>
        </div>

        <div className="card p-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Calendar size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Cette semaine</p>
              <p className="text-2xl font-bold text-slate-900">{formatTimeShort(globalStats.week)}</p>
              <p className="text-xs text-slate-500">7 derniers jours</p>
            </div>
          </div>
        </div>

        <div className="card p-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <BarChart3 size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Ce mois</p>
              <p className="text-2xl font-bold text-slate-900">{formatTimeShort(globalStats.month)}</p>
              <p className="text-xs text-slate-500">30 derniers jours</p>
            </div>
          </div>
        </div>

        <div className="card p-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Cette année</p>
              <p className="text-2xl font-bold text-slate-900">{formatTimeShort(globalStats.year)}</p>
              <p className="text-xs text-slate-500">Total annuel</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sélecteur de section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-semibold text-slate-700">Analyser :</span>
          <div className="relative">
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value as StatSection)}
              className="appearance-none bg-white border border-slate-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            >
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Sélecteur de période */}
        <div className="flex bg-slate-100 rounded-lg p-1 w-fit">
          {periods.map(period => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id as TimePeriod)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedPeriod === period.id 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graphique en courbe avec axe Y amélioré */}
      <div className="card p-8 mb-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold" style={{ color: 'rgb(var(--color-text-primary))' }}>
            Temps de travail {periods.find(p => p.id === selectedPeriod)?.label.toLowerCase()}
            {selectedPeriod === 'day' && ' (10 derniers jours)'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-sm" style={{ color: 'rgb(var(--color-text-muted))' }}>
              Moyenne: {formatTime(avgWorkTime)} • Total: {formatTime(totalWorkTime)}
            </div>
            
            <div className="flex items-center gap-3 border-l pl-4 transition-colors" style={{ borderColor: 'rgb(var(--color-border))' }}>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showReference"
                  checked={showReferenceBar}
                  onChange={(e) => setShowReferenceBar(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-orange-600 focus:ring-orange-500 bg-white dark:bg-gray-800"
                />
                <label htmlFor="showReference" className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-primary))' }}>
                  Objectif
                </label>
              </div>
              
              {showReferenceBar && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={referenceValue}
                    onChange={(e) => setReferenceValue(Number(e.target.value))}
                    min="5"
                    max="480"
                    step="5"
                    className="w-16 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                    style={{
                      backgroundColor: 'rgb(var(--color-surface))',
                      color: 'rgb(var(--color-text-primary))',
                      borderColor: 'rgb(var(--color-border))'
                    }}
                  />
                  <span className="text-xs" style={{ color: 'rgb(var(--color-text-muted))' }}>min</span>
                </div>
              )}
              
              <button
                onClick={() => setReferenceValue(avgWorkTime)}
                className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors"
                title="Utiliser la moyenne comme référence"
              >
                Moyenne
              </button>
            </div>
          </div>
        </div>

        <div className="relative rounded-xl p-6 border transition-colors" style={{
          backgroundColor: 'rgb(var(--color-hover))',
          borderColor: 'rgb(var(--color-border))'
        }}>
          <div className="relative rounded-lg shadow-inner border overflow-visible transition-colors" style={{ 
            height: `${chartHeight}px`,
            backgroundColor: 'rgb(var(--color-surface))',
            borderColor: 'rgb(var(--color-border-muted))'
          }}>
            
            <svg width="100%" height="100%" className="absolute inset-0 overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
                </linearGradient>
                
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1E40AF" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
              </defs>
              
              {/* Grille horizontale */}
              {yScale.ticks.map((tick, index) => {
                const y = 60 + (chartHeight - 120) - ((tick / yScale.max) * (chartHeight - 120));
                return (
                  <g key={`grid-${tick}`}>
                    <line
                      x1="60"
                      y1={y}
                      x2="740"
                      y2={y}
                      stroke={tick === 0 ? "rgb(var(--color-text-secondary))" : "rgb(var(--color-border))"}
                      strokeWidth={tick === 0 ? "2" : "1"}
                      strokeDasharray={tick === 0 ? "none" : "2,2"}
                    />
                    <text
                      x="50"
                      y={y + 4}
                      textAnchor="end"
                      className="text-xs font-medium"
                      fill="rgb(var(--color-text-secondary))"
                    >
                      {formatTimeShort(tick)}
                    </text>
                  </g>
                );
              })}
              
              {/* Ligne d'objectif */}
              {showReferenceBar && referenceValue <= yScale.max && (
                <g>
                  <line
                    x1="60"
                    y1={60 + (chartHeight - 120) - ((referenceValue / yScale.max) * (chartHeight - 120))}
                    x2="740"
                    y2={60 + (chartHeight - 120) - ((referenceValue / yScale.max) * (chartHeight - 120))}
                    stroke="#F97316"
                    strokeWidth="3"
                    strokeDasharray="8,4"
                  />
                  <text
                    x="745"
                    y={60 + (chartHeight - 120) - ((referenceValue / yScale.max) * (chartHeight - 120)) + 4}
                    className="text-xs font-bold"
                    fill="#F97316"
                  >
                    🎯 {formatTime(referenceValue)}
                  </text>
                </g>
              )}
              
              {/* Zone sous la courbe */}
              {curvePoints.length > 1 && (
                <path
                  d={`${smoothPath} L ${curvePoints[curvePoints.length - 1].x} ${chartHeight - 60} L ${curvePoints[0].x} ${chartHeight - 60} Z`}
                  fill="url(#areaGradient)"
                />
              )}
              
              {/* Courbe principale */}
              {curvePoints.length > 1 && (
                <path
                  d={smoothPath}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              
              {/* Points de données */}
              {curvePoints.map((point, index) => {
                const isAboveTarget = showReferenceBar && point.data.totalTime >= referenceValue;
                const isBelowTarget = showReferenceBar && point.data.totalTime < referenceValue && point.data.totalTime > 0;
                const isEmpty = point.data.totalTime === 0;
                
                let pointColor = "#3B82F6";
                if (showReferenceBar) {
                  if (isAboveTarget) pointColor = "#10B981";
                  else if (isBelowTarget) pointColor = "#EF4444";
                  else if (isEmpty) pointColor = "#9CA3AF";
                }
                
                return (
                  <g key={index}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="21"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(index)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="6"
                      fill={pointColor}
                      stroke="white"
                      strokeWidth="3"
                      className="cursor-pointer"
                      style={{
                        filter: hoveredPoint === index ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none',
                        transition: 'filter 0.2s ease'
                      }}
                    />
                    
                    <text
                      x={point.x}
                      y={chartHeight - 35}
                      textAnchor="middle"
                      className="text-xs font-medium"
                      fill="rgb(var(--color-text-primary))"
                    >
                      {point.data.label}
                    </text>
                  </g>
                );
              })}
              
              {/* Axes */}
              <line x1="60" y1="60" x2="60" y2={chartHeight - 60} stroke="rgb(var(--color-text-secondary))" strokeWidth="2" />
              <line x1="60" y1={chartHeight - 60} x2="740" y2={chartHeight - 60} stroke="rgb(var(--color-text-secondary))" strokeWidth="2" />
              
              {/* Labels des axes */}
              <text x="400" y={chartHeight - 10} textAnchor="middle" className="text-sm fill-slate-600 font-medium">
                {selectedPeriod === 'day' && 'Jours'}
                {selectedPeriod === 'week' && 'Semaines'}
                {selectedPeriod === 'month' && 'Mois'}
                {selectedPeriod === 'year' && 'Années'}
              </text>
            </svg>
          </div>

          {/* Légende */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t transition-colors" style={{ borderColor: 'rgb(var(--color-border))' }}>
            <div className="flex items-center gap-6 text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded"></div>
                <span className="font-medium">📈 Courbe de progression</span>
              </div>
              {showReferenceBar && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="font-medium">✅ Objectif atteint</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="font-medium">❌ En dessous</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-orange-500 rounded" style={{borderStyle: 'dashed'}}></div>
                    <span className="font-medium">🎯 Ligne objectif</span>
                  </div>
                </>
              )}
            </div>
            <div className="text-xs" style={{ color: 'rgb(var(--color-text-muted))' }}>
              Échelle: 0-{formatTime(yScale.max)} • Max réel: {formatTime(maxWorkTime)}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip détaillé */}
      {hoveredPoint !== null && curvePoints[hoveredPoint] && (
        <DetailedTooltip 
          point={curvePoints[hoveredPoint]} 
          isVisible={hoveredPoint !== null}
        />
      )}

      {/* Graphiques spécifiques par section */}
      {selectedSection === 'tasks' && <TasksStatistics tasks={tasks} colorSettings={colorSettings} />}
      {selectedSection === 'agenda' && <AgendaStatistics events={events} />}
      {selectedSection === 'okr' && <OKRStatistics objectives={mockOKRs} />}
      {selectedSection === 'habits' && <HabitsStatistics habits={mockHabits} />}
    </div>
  );
}

// Composants de statistiques avec design sobre
const TasksStatistics: React.FC<{ tasks: any[], colorSettings: any }> = ({ tasks, colorSettings }) => {
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  const colorDistribution = Object.keys(colorSettings).map(color => ({
    color,
    name: colorSettings[color],
    count: tasks.filter(task => task.category === color).length,
    completed: completedTasks.filter(task => task.category === color).length
  }));

  const priorityDistribution = [1, 2, 3, 4, 5].map(priority => ({
    priority,
    count: tasks.filter(task => task.priority === priority).length,
    completed: completedTasks.filter(task => task.priority === priority).length
  }));

  const maxColorCount = Math.max(...colorDistribution.map(c => c.count), 1);
  const maxPriorityCount = Math.max(...priorityDistribution.map(p => p.count), 1);

  const getColorValue = (colorKey: string) => {
    const colors = {
      red: '#EF4444',
      blue: '#3B82F6',
      green: '#10B981',
      purple: '#8B5CF6',
      orange: '#F97316'
    };
    return colors[colorKey as keyof typeof colors] || '#64748B';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="card p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Répartition des tâches par couleur</h3>
        <div className="space-y-4">
          {colorDistribution.map(item => (
            <div key={item.color} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getColorValue(item.color) }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm text-slate-600">{item.count}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: getColorValue(item.color),
                    width: `${(item.count / maxColorCount) * 100}%` 
                  }}
                />
              </div>
              <div className="text-xs text-slate-500">
                {item.completed} complétée{item.completed !== 1 ? 's' : ''} sur {item.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Répartition des tâches par priorité</h3>
        <div className="space-y-4">
          {priorityDistribution.map(item => (
            <div key={item.priority} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Priorité {item.priority}</span>
                <span className="text-sm text-slate-600">{item.count}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-slate-600 transition-all duration-300"
                  style={{ width: `${(item.count / maxPriorityCount) * 100}%` }}
                />
              </div>
              <div className="text-xs text-slate-500">
                {item.completed} complétée{item.completed !== 1 ? 's' : ''} sur {item.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AgendaStatistics: React.FC<{ events: any[] }> = ({ events }) => {
  const today = new Date();
  const thisWeek = events.filter(event => {
    const eventDate = new Date(event.start);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return eventDate >= weekStart && eventDate <= weekEnd;
  });

  const thisMonth = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.getMonth() === today.getMonth() && 
           eventDate.getFullYear() === today.getFullYear();
  });

  const durationRanges = [
    { label: '< 30 min', min: 0, max: 30 },
    { label: '30-60 min', min: 30, max: 60 },
    { label: '1-2h', min: 60, max: 120 },
    { label: '2-4h', min: 120, max: 240 },
    { label: '> 4h', min: 240, max: Infinity }
  ];

  const durationDistribution = durationRanges.map(range => {
    const count = events.filter(event => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60);
      return duration >= range.min && duration < range.max;
    }).length;
    
    return { ...range, count };
  });

  const maxDurationCount = Math.max(...durationDistribution.map(d => d.count), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="card p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Événements planifiés</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
            <span className="font-medium text-blue-900">Cette semaine</span>
            <span className="text-2xl font-bold text-blue-600">{thisWeek.length}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <span className="font-medium text-green-900">Ce mois</span>
            <span className="text-2xl font-bold text-green-600">{thisMonth.length}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
            <span className="font-medium text-slate-900">Total</span>
            <span className="text-2xl font-bold text-slate-600">{events.length}</span>
          </div>
        </div>
      </div>

      <div className="card p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Répartition par durée</h3>
        <div className="space-y-4">
          {durationDistribution.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-slate-600">{item.count}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-slate-600 transition-all duration-300"
                  style={{ width: `${(item.count / maxDurationCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OKRStatistics: React.FC<{ objectives: any[] }> = ({ objectives }) => {
  const totalObjectives = objectives.length;
  const completedObjectives = objectives.filter(obj => obj.completed).length;
  const inProgressObjectives = totalObjectives - completedObjectives;

  const totalEstimatedTime = objectives.reduce((sum, obj) => sum + obj.estimatedTime, 0);
  const avgTimePerObjective = totalObjectives > 0 ? Math.round(totalEstimatedTime / totalObjectives) : 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins}min`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="card p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Objectifs OKR</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
            <span className="font-medium text-blue-900">Total objectifs</span>
            <span className="text-2xl font-bold text-blue-600">{totalObjectives}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <span className="font-medium text-green-900">Complétés</span>
            <span className="text-2xl font-bold text-green-600">{completedObjectives}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
            <span className="font-medium text-orange-900">En cours</span>
            <span className="text-2xl font-bold text-orange-600">{inProgressObjectives}</span>
          </div>
        </div>
      </div>

      <div className="card p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Temps estimé</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
            <span className="font-medium text-purple-900">Temps total</span>
            <span className="text-2xl font-bold text-purple-600">{formatTime(totalEstimatedTime)}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
            <span className="font-medium text-slate-900">Moyenne par objectif</span>
            <span className="text-2xl font-bold text-slate-600">{formatTime(avgTimePerObjective)}</span>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-sm font-semibold text-slate-700 mb-4">Répartition du temps</h4>
          <div className="space-y-2">
            {objectives.map(obj => (
              <div key={obj.id} className="flex justify-between items-center text-sm">
                <span className="truncate flex-1 mr-2">{obj.title}</span>
                <span className="font-medium">{formatTime(obj.estimatedTime)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const HabitsStatistics: React.FC<{ habits: any[] }> = ({ habits }) => {
  const totalHabits = habits.length;
  const totalCompletions = habits.reduce((sum, habit) => {
    return sum + Object.keys(habit.completions).filter(date => habit.completions[date]).length;
  }, 0);

  const totalEstimatedTime = habits.reduce((sum, habit) => {
    const completionCount = Object.keys(habit.completions).filter(date => habit.completions[date]).length;
    return sum + (habit.estimatedTime * completionCount);
  }, 0);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins}min`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="card p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Habitudes</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
            <span className="font-medium text-blue-900">Total habitudes</span>
            <span className="text-2xl font-bold text-blue-600">{totalHabits}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <span className="font-medium text-green-900">Complétions totales</span>
            <span className="text-2xl font-bold text-green-600">{totalCompletions}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
            <span className="font-medium text-purple-900">Temps investi</span>
            <span className="text-2xl font-bold text-purple-600">{formatTime(totalEstimatedTime)}</span>
          </div>
        </div>
      </div>

      <div className="card p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Détail par habitude</h3>
        <div className="space-y-4">
          {habits.map(habit => {
            const completionCount = Object.keys(habit.completions).filter(date => habit.completions[date]).length;
            const totalTime = habit.estimatedTime * completionCount;
            
            return (
              <div key={habit.id} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-900">{habit.name}</span>
                  <span className="text-sm text-slate-600">{completionCount} fois</span>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-600">
                  <span>{habit.estimatedTime}min par session</span>
                  <span className="font-medium">{formatTime(totalTime)} total</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
