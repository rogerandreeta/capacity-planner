import { Users } from 'lucide-react';

const getColor = (hours, maxHours) => {
  if (hours === 0) return 'bg-slate-100';
  if (hours > maxHours) return 'bg-red-500';
  const pct = hours / maxHours;
  if (pct >= 0.9) return 'bg-orange-400';
  if (pct >= 0.7) return 'bg-amber-300';
  if (pct >= 0.5) return 'bg-yellow-200';
  if (pct >= 0.3) return 'bg-emerald-200';
  return 'bg-emerald-100';
};

const LEGEND = [
  { color: 'bg-slate-100', label: 'No allocation' },
  { color: 'bg-emerald-100', label: '0–30%' },
  { color: 'bg-emerald-200', label: '30–50%' },
  { color: 'bg-yellow-200', label: '50–70%' },
  { color: 'bg-amber-300', label: '70–90%' },
  { color: 'bg-orange-400', label: '90–100%' },
  { color: 'bg-red-500', label: '>100% (Over capacity)' },
];

export default function CapacityHeatmap({ people, weeks, allocations }) {
  // Group weeks by month
  let currentMonth = '';
  const monthGroups = [];
  let currentGroup = [];

  weeks.forEach((week, index) => {
    if (week.monthYear !== currentMonth) {
      if (currentGroup.length > 0) monthGroups.push({ month: currentMonth, weeks: currentGroup });
      currentMonth = week.monthYear;
      currentGroup = [{ ...week, index }];
    } else {
      currentGroup.push({ ...week, index });
    }
  });
  if (currentGroup.length > 0) monthGroups.push({ month: currentMonth, weeks: currentGroup });

  return (
    <div className="glass rounded-xl p-6 overflow-hidden">
      <div className="overflow-x-auto scroll-container">
        <div className="inline-block min-w-full">
          {/* Month headers */}
          <div className="flex mb-2">
            <div className="w-48 flex-shrink-0" />
            {monthGroups.map((group, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 px-2"
                style={{ width: `${group.weeks.length * 80}px` }}
              >
                <div className="text-xs font-semibold text-slate-600 text-center">{group.month}</div>
              </div>
            ))}
          </div>

          {/* Week headers */}
          <div className="flex mb-2">
            <div className="w-48 flex-shrink-0" />
            {weeks.map(week => (
              <div key={week.id} className="w-20 flex-shrink-0 px-1">
                <div className="text-[10px] text-slate-500 text-center mono">{week.label}</div>
              </div>
            ))}
          </div>

          {/* Heatmap rows */}
          {people.map(person => (
            <div key={person.id} className="flex items-center mb-2">
              <div className="w-48 flex-shrink-0 pr-4">
                <div className="text-sm font-medium text-slate-700 truncate">{person.name}</div>
                <div className="text-xs text-slate-500 mono">{person.hoursPerWeek}h/wk max</div>
              </div>
              {allocations[person.id].map((hours, weekIndex) => (
                <div key={weekIndex} className="w-20 flex-shrink-0 px-1">
                  <div
                    className={`heatmap-cell h-16 rounded-lg flex items-center justify-center relative ${getColor(hours, person.hoursPerWeek)}`}
                    title={`Week ${weekIndex + 1}: ${hours.toFixed(1)} hours`}
                  >
                    <span
                      className={`text-xs font-semibold mono ${hours > person.hoursPerWeek ? 'text-white' : 'text-slate-700'}`}
                    >
                      {hours > 0 ? hours.toFixed(1) : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {people.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No people configured. Add team members in the setup page.</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="text-xs font-semibold text-slate-600 mb-2">Capacity Legend</div>
        <div className="flex items-center gap-4 flex-wrap">
          {LEGEND.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded ${color}`} />
              <span className="text-xs text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
