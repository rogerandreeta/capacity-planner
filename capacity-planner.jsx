import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

import Header from './src/components/Header';
import Overview from './src/components/Overview';
import Setup from './src/components/Setup';
import { generateWeeks, getWeekNumber, getDaysBetween } from './src/utils';

import './styles.css';

// ─── Initial Data ────────────────────────────────────────────────────────────

const INITIAL_PEOPLE = [
  { id: 1, name: 'Sarah Chen', hoursPerWeek: 38 },
  { id: 2, name: 'Marcus Rodriguez', hoursPerWeek: 38 },
];

const INITIAL_PROJECTS = [
  {
    id: 1,
    name: 'Website Redesign',
    startDate: '2026-02-10',
    endDate: '2026-04-15',
    tasks: [
      {
        id: 1,
        name: 'Discovery & Research',
        startDate: '2026-02-10',
        endDate: '2026-02-28',
        resources: [{ personId: 1, dailyHours: Array(19).fill(4) }],
      },
      {
        id: 2,
        name: 'Design Phase',
        startDate: '2026-03-01',
        endDate: '2026-03-21',
        resources: [
          { personId: 1, dailyHours: Array(21).fill(6) },
          { personId: 2, dailyHours: Array(21).fill(4) },
        ],
      },
    ],
  },
];

// ─── Global Styles ────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  * { font-family: 'Outfit', sans-serif; }
  .mono { font-family: 'Space Mono', monospace; }
  .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.8); }
  .heatmap-cell { transition: all 0.2s ease; }
  .heatmap-cell:hover { transform: scale(1.1); z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  .scroll-container { scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9; }
  .scroll-container::-webkit-scrollbar { height: 8px; }
  .scroll-container::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
  .scroll-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  .scroll-container::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
`;

// ─── App ──────────────────────────────────────────────────────────────────────

function CapacityPlanner() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [people, setPeople] = useState(INITIAL_PEOPLE);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);

  const weeks = useMemo(() => generateWeeks(new Date(), 52), []);

  // ── People ──────────────────────────────────────────────────────────────────

  const addPerson = () => {
    const newId = Math.max(0, ...people.map(p => p.id)) + 1;
    setPeople([...people, { id: newId, name: '', hoursPerWeek: 38 }]);
  };

  const updatePerson = (id, field, value) =>
    setPeople(people.map(p => (p.id === id ? { ...p, [field]: value } : p)));

  const removePerson = (id) => setPeople(people.filter(p => p.id !== id));

  // ── Projects ────────────────────────────────────────────────────────────────

  const addProject = () => {
    const newId = Math.max(0, ...projects.map(p => p.id)) + 1;
    const today = new Date().toISOString().split('T')[0];
    setProjects([...projects, { id: newId, name: '', startDate: today, endDate: today, tasks: [] }]);
  };

  const updateProject = (id, field, value) =>
    setProjects(projects.map(p => (p.id === id ? { ...p, [field]: value } : p)));

  const removeProject = (id) => setProjects(projects.filter(p => p.id !== id));

  // ── Tasks ───────────────────────────────────────────────────────────────────

  const addTask = (projectId) =>
    setProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      const newTaskId = Math.max(0, ...p.tasks.map(t => t.id)) + 1;
      return {
        ...p,
        tasks: [...p.tasks, { id: newTaskId, name: '', startDate: p.startDate, endDate: p.endDate, resources: [] }],
      };
    }));

  const updateTask = (projectId, taskId, field, value) =>
    setProjects(projects.map(p => p.id !== projectId ? p : {
      ...p,
      tasks: p.tasks.map(t => (t.id === taskId ? { ...t, [field]: value } : t)),
    }));

  const removeTask = (projectId, taskId) =>
    setProjects(projects.map(p => p.id !== projectId ? p : {
      ...p,
      tasks: p.tasks.filter(t => t.id !== taskId),
    }));

  // ── Resources ───────────────────────────────────────────────────────────────

  const addResourceToTask = (projectId, taskId, personId) =>
    setProjects(projects.map(p => p.id !== projectId ? p : {
      ...p,
      tasks: p.tasks.map(t => {
        if (t.id !== taskId) return t;
        const days = getDaysBetween(t.startDate, t.endDate);
        return { ...t, resources: [...t.resources, { personId, dailyHours: Array(days).fill(0) }] };
      }),
    }));

  const removeResourceFromTask = (projectId, taskId, personId) =>
    setProjects(projects.map(p => p.id !== projectId ? p : {
      ...p,
      tasks: p.tasks.map(t =>
        t.id !== taskId ? t : { ...t, resources: t.resources.filter(r => r.personId !== personId) }
      ),
    }));

  const updateResourceHours = (projectId, taskId, personId, dayIndex, hours) =>
    setProjects(projects.map(p => p.id !== projectId ? p : {
      ...p,
      tasks: p.tasks.map(t => t.id !== taskId ? t : {
        ...t,
        resources: t.resources.map(r => {
          if (r.personId !== personId) return r;
          const newHours = [...r.dailyHours];
          newHours[dayIndex] = parseFloat(hours) || 0;
          return { ...r, dailyHours: newHours };
        }),
      }),
    }));

  // ── Allocations ─────────────────────────────────────────────────────────────

  const calculateWeeklyAllocations = () => {
    const allocations = {};
    people.forEach(person => { allocations[person.id] = Array(52).fill(0); });

    projects.forEach(project => {
      project.tasks.forEach(task => {
        task.resources.forEach(resource => {
          if (!allocations[resource.personId]) return;
          const startDate = new Date(task.startDate);
          resource.dailyHours.forEach((hours, dayIndex) => {
            const workDate = new Date(startDate);
            workDate.setDate(startDate.getDate() + dayIndex);
            const weekIndex = getWeekNumber(workDate, weeks);
            if (weekIndex >= 0 && weekIndex < 52) {
              allocations[resource.personId][weekIndex] += hours;
            }
          });
        });
      });
    });

    return allocations;
  };

  // ── CSV Export ───────────────────────────────────────────────────────────────

  const exportToCSV = () => {
    const allocations = calculateWeeklyAllocations();
    let csv = 'Person,' + weeks.map((w, i) => `Week ${i + 1} (${w.start.toLocaleDateString()})`).join(',') + '\n';
    people.forEach(person => {
      csv += `${person.name},` + allocations[person.id].join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capacity-plan-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const sharedHandlers = {
    addPerson, updatePerson, removePerson,
    addProject, updateProject, removeProject,
    addTask, updateTask, removeTask,
    addResourceToTask, removeResourceFromTask, updateResourceHours,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{GLOBAL_STYLES}</style>

      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentPage === 'overview' ? (
          <Overview
            people={people}
            weeks={weeks}
            allocations={calculateWeeklyAllocations()}
            projects={projects}
            onExportCSV={exportToCSV}
          />
        ) : (
          <Setup people={people} projects={projects} {...sharedHandlers} />
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CapacityPlanner />
  </React.StrictMode>
);
