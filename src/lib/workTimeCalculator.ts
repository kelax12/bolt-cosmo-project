export function parseLocalDate(dateString: string): Date {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

export function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateWorkTimeForPeriod(
  startDate: Date,
  endDate: Date,
  data: { tasks: any[]; events: any[]; habits: any[]; okrs: any[] }
) {
  const { tasks, events, habits, okrs } = data;

  const completedTasks = tasks.filter((task) => {
    if (!task.completed || !task.completedAt) return false;
    const completedDate = parseLocalDate(task.completedAt);
    return completedDate >= startDate && completedDate <= endDate;
  });

  const filteredEvents = events.filter((event) => {
    const eventDate = parseLocalDate(event.start);
    return eventDate >= startDate && eventDate <= endDate;
  });

  const tasksTime = completedTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);

  const eventsTime = filteredEvents.reduce((sum, event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    return sum + (end.getTime() - start.getTime()) / (1000 * 60);
  }, 0);

  let habitsTime = 0;
  const filteredHabits: any[] = [];
  
  habits.forEach((habit) => {
    let completionsCount = 0;
    Object.keys(habit.completions || {}).forEach((dateStr) => {
      if (habit.completions[dateStr]) {
        const hDate = parseLocalDate(dateStr);
        if (hDate >= startDate && hDate <= endDate) {
          completionsCount++;
        }
      }
    });
    if (completionsCount > 0) {
      habitsTime += completionsCount * (habit.estimatedTime || 0);
      filteredHabits.push({ ...habit, periodCompletions: completionsCount });
    }
  });

  let okrTime = 0;
  okrs.forEach((okr) => {
    (okr.keyResults || []).forEach((kr: any) => {
      const historyInRange = (kr.history || []).filter((h: any) => {
        const hDate = parseLocalDate(h.date);
        return hDate >= startDate && hDate <= endDate;
      });
      const totalIncrements = historyInRange.reduce((sum: number, h: any) => sum + h.increment, 0);
      okrTime += totalIncrements * (kr.estimatedTime || 0);
    });
  });

  const totalTime = tasksTime + eventsTime + habitsTime + okrTime;

  return {
    completedTasks,
    events: filteredEvents,
    habits: filteredHabits,
    totalTime,
    tasksTime,
    eventsTime,
    habitsTime,
    okrTime,
  };
}
