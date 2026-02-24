import { getWeekNumber } from '../utils';

// Distinct palette for projects
const PROJECT_COLORS = [
  { bar: 'bg-indigo-500',  task: 'bg-indigo-300',  text: 'text-indigo-700',  label: 'text-white' },
  { bar: 'bg-violet-500',  task: 'bg-violet-300',  text: 'text-violet-700',  label: 'text-white' },
  { bar: 'bg-sky-500',     task: 'bg-sky-300',     text: 'text-sky-700',     label: 'text-white' },
  { bar: 'bg-emerald-500', task: 'bg-emerald-300', text: 'text-emerald-700', label: 'text-white' },
  { bar: 'bg-amber-500',   task: 'bg-amber-300',   text: 'text-amber-700',   label: 'text-white' },
  { bar: 'bg-rose-500',    task: 'bg-rose-300',    text: 'text-rose-700',    label: 'text-white' },
];

const CELL_W = 80; // px per week column — must match heatmap
const ROW_H  = 36; // px per row

function getProjectSpan(project, weeks) {
  const start = getWeekNumber(project.startDate, weeks);
  const end   = getWeekNumber(project.endDate,   weeks);
  return { start: Math.max(0, start), end: Math.min(weeks.length - 1, end) };
}

function getTaskSpan(task, weeks) {
  const start = getWeekNumber(task.startDate, weeks);
  const end   = getWeekNumber(task.endDate,   weeks);
  return { start: Math.max(0, start), end: Math.min(weeks.length - 1, end) };
}

function GanttBar({ colStart, colEnd, label, colorClass, labelClass, title, slim = false }) {
  const width = (colEnd - colStart + 1) * CELL_W - 4;
  const left  = colStart * CELL_W + 2;
  const height = slim ? ROW_H - 12 : ROW_H - 8;
  const top    = slim ? 6 : 4;

  return (
    <div
      className={`absolute rounded-md flex items-center px-2 overflow-hidden whitespace-nowrap ${colorClass}`}
      style={{ left, width: Math.max(width, 24), height, top }}
      title={title}
    >
      <span className={`text-xs font-semibold truncate ${labelClass}`}>{label}</span>
    </div>
  );
}

export default function GanttChart({ projects, weeks }) {
  // Build grouped month headers (same logic as heatmap)
  let currentMonth = '';
  const monthGroups = [];
  let currentGroup  = [];

  weeks.forEach((week, index) => {
    if (week.monthYear !== currentMonth) {
      if (currentGroup.length > 0) monthGroups.push({ month: currentMonth, weeks: currentGroup });
      currentMonth  = week.monthYear;
      currentGroup  = [{ ...week, index }];
    } else {
      currentGroup.push({ ...week, index });
    }
  });
  if (currentGroup.length > 0) monthGroups.push({ month: currentMonth, weeks: currentGroup });

  // Today marker
  const todayWeekIndex = getWeekNumber(new Date(), weeks);

  const visibleProjects = projects.filter(p => p.startDate && p.endDate);

  return (
    <div className="glass rounded-xl p-6 overflow-hidden">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800">Project Timeline</h2>
        <p className="text-sm text-slate-500 mt-0.5">Gantt view across 52 weeks</p>
      </div>

      <div className="overflow-x-auto scroll-container">
        <div style={{ minWidth: weeks.length * CELL_W + 192 }}>

          {/* ── Month headers ── */}
          <div className="flex mb-1">
            <div style={{ width: 192 }} className="flex-shrink-0" />
            {monthGroups.map((group, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 px-2 border-l border-slate-200 first:border-l-0"
                style={{ width: group.weeks.length * CELL_W }}
              >
                <span className="text-xs font-semibold text-slate-600">{group.month}</span>
              </div>
            ))}
          </div>

          {/* ── Week headers ── */}
          <div className="flex mb-2">
            <div style={{ width: 192 }} className="flex-shrink-0" />
            {weeks.map(week => (
              <div key={week.id} style={{ width: CELL_W }} className="flex-shrink-0 px-1">
                <span className="text-[10px] text-slate-400 mono">{week.label}</span>
              </div>
            ))}
          </div>

          {/* ── Grid + bars ── */}
          {visibleProjects.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              No projects with dates configured yet.
            </div>
          ) : (
            visibleProjects.map((project, projectIdx) => {
              const color = PROJECT_COLORS[projectIdx % PROJECT_COLORS.length];
              const { start: pStart, end: pEnd } = getProjectSpan(project, weeks);

              return (
                <div key={project.id}>
                  {/* Project row */}
                  <div className="flex items-center mb-px">
                    {/* Row label */}
                    <div
                      style={{ width: 192 }}
                      className="flex-shrink-0 pr-4 flex items-center"
                    >
                      <div className={`w-2.5 h-2.5 rounded-sm mr-2 flex-shrink-0 ${color.bar}`} />
                      <span className="text-sm font-semibold text-slate-700 truncate">
                        {project.name || 'Untitled project'}
                      </span>
                    </div>

                    {/* Bar track */}
                    <div
                      className="relative flex-shrink-0 bg-slate-50 rounded-lg border border-slate-100"
                      style={{ width: weeks.length * CELL_W, height: ROW_H }}
                    >
                      {/* Today line */}
                      {todayWeekIndex >= 0 && (
                        <div
                          className="absolute top-0 bottom-0 w-px bg-red-400 z-10"
                          style={{ left: todayWeekIndex * CELL_W }}
                        />
                      )}

                      {/* Alternating month bands */}
                      {monthGroups.map((group, idx) => (
                        <div
                          key={idx}
                          className={`absolute top-0 bottom-0 ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-100/60'}`}
                          style={{
                            left:  group.weeks[0].index * CELL_W,
                            width: group.weeks.length * CELL_W,
                          }}
                        />
                      ))}

                      {/* Project bar */}
                      <GanttBar
                        colStart={pStart}
                        colEnd={pEnd}
                        label={project.name || 'Untitled project'}
                        colorClass={color.bar}
                        labelClass={color.label}
                        title={`${project.name}: W${pStart + 1} → W${pEnd + 1}`}
                      />
                    </div>
                  </div>

                  {/* Task rows */}
                  {project.tasks.map(task => {
                    const { start: tStart, end: tEnd } = getTaskSpan(task, weeks);
                    return (
                      <div key={task.id} className="flex items-center mb-px">
                        {/* Task label */}
                        <div
                          style={{ width: 192 }}
                          className="flex-shrink-0 pr-4 pl-5 flex items-center gap-1.5"
                        >
                          <span className={`text-[10px] mono ${color.text}`}>↳</span>
                          <h3 className="text-xs text-slate-500 truncate">
                            {task.name || <span className="italic">Untitled task</span>}
                          </h3>
                        </div>

                        {/* Task bar track */}
                        <div
                          className="relative flex-shrink-0"
                          style={{ width: weeks.length * CELL_W, height: ROW_H }}
                        >
                          {/* Today line */}
                          {todayWeekIndex >= 0 && (
                            <div
                              className="absolute top-0 bottom-0 w-px bg-red-400/50 z-10"
                              style={{ left: todayWeekIndex * CELL_W }}
                            />
                          )}

                          <GanttBar
                            colStart={tStart}
                            colEnd={tEnd}
                            label={task.name || 'Untitled task'}
                            colorClass={color.task}
                            labelClass={color.text}
                            title={`${task.name}: W${tStart + 1} → W${tEnd + 1}`}
                            slim
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Spacer between projects */}
                  <div className="h-3" />
                </div>
              );
            })
          )}

          {/* ── Today legend ── */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
            <div className="w-4 h-px bg-red-400" />
            <span className="text-xs text-slate-500">Today</span>
          </div>

        </div>
      </div>
    </div>
  );
}
