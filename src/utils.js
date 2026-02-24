export const generateWeeks = (startDate, numWeeks) => {
  const weeks = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay());

  for (let i = 0; i < numWeeks; i++) {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    weeks.push({
      id: i,
      start: weekStart,
      end: weekEnd,
      label: `W${i + 1}`,
      monthYear: weekStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });
  }
  return weeks;
};

export const getWeekNumber = (date, weeks) => {
  const targetDate = new Date(date);
  return weeks.findIndex(week => targetDate >= week.start && targetDate <= week.end);
};

export const getDaysBetween = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};
