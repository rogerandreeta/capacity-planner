import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { Calendar, Users, FolderKanban, Download, Plus, Trash2, ChevronRight } from 'lucide-react';

import './styles.css';

// Utility functions
const generateWeeks = (startDate, numWeeks) => {
  const weeks = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay()); // Start from Sunday
  
  for (let i = 0; i < numWeeks; i++) {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + (i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    weeks.push({
      id: i,
      start: weekStart,
      end: weekEnd,
      label: `W${i + 1}`,
      monthYear: weekStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });
  }
  return weeks;
};

const getWeekNumber = (date, weeks) => {
  const targetDate = new Date(date);
  return weeks.findIndex(week => {
    return targetDate >= week.start && targetDate <= week.end;
  });
};

const getDaysBetween = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

// Build calendar day objects from a task start date
const buildCalendarDays = (taskStartDate, numDays) => {
  const days = [];
  const start = new Date(taskStartDate);
  for (let i = 0; i < numDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({
      dayIndex: i,
      date: d,
      dayOfMonth: d.getDate(),
      monthKey: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      monthShort: d.toLocaleDateString('en-US', { month: 'short' }),
    });
  }
  return days;
};

// Group calendar days by month for header rendering
const groupDaysByMonth = (calendarDays) => {
  const groups = [];
  let currentMonth = null;
  let currentGroup = null;
  calendarDays.forEach(day => {
    if (day.monthKey !== currentMonth) {
      currentMonth = day.monthKey;
      currentGroup = { monthKey: day.monthKey, monthShort: day.monthShort, days: [] };
      groups.push(currentGroup);
    }
    currentGroup.days.push(day);
  });
  return groups;
};

// Main App Component
function CapacityPlanner() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [activeTab, setActiveTab] = useState('people');
  
  // People state
  const [people, setPeople] = useState([
    { id: 1, name: 'Sarah Chen', hoursPerWeek: 38 },
    { id: 2, name: 'Marcus Rodriguez', hoursPerWeek: 38 },
  ]);
  
  // Projects state
  const [projects, setProjects] = useState([
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
          resources: [
            {
              personId: 1,
              dailyHours: Array(19).fill(4)
            }
          ]
        },
        {
          id: 2,
          name: 'Design Phase',
          startDate: '2026-03-01',
          endDate: '2026-03-21',
          resources: [
            {
              personId: 1,
              dailyHours: Array(21).fill(6)
            },
            {
              personId: 2,
              dailyHours: Array(21).fill(4)
            }
          ]
        }
      ]
    }
  ]);
  
  const weeks = useMemo(() => generateWeeks(new Date(), 52), []);
  
  // People management
  const addPerson = () => {
    const newId = Math.max(0, ...people.map(p => p.id)) + 1;
    setPeople([...people, { id: newId, name: '', hoursPerWeek: 38 }]);
  };
  
  const updatePerson = (id, field, value) => {
    setPeople(people.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  
  const removePerson = (id) => {
    setPeople(people.filter(p => p.id !== id));
  };
  
  // Project management
  const addProject = () => {
    const newId = Math.max(0, ...projects.map(p => p.id)) + 1;
    setProjects([...projects, {
      id: newId,
      name: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      tasks: []
    }]);
  };
  
  const updateProject = (id, field, value) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  
  const removeProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };
  
  const addTask = (projectId) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        const newTaskId = Math.max(0, ...p.tasks.map(t => t.id)) + 1;
        return {
          ...p,
          tasks: [...p.tasks, {
            id: newTaskId,
            name: '',
            startDate: p.startDate,
            endDate: p.endDate,
            resources: []
          }]
        };
      }
      return p;
    }));
  };
  
  const updateTask = (projectId, taskId, field, value) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t)
        };
      }
      return p;
    }));
  };
  
  const removeTask = (projectId, taskId) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: p.tasks.filter(t => t.id !== taskId)
        };
      }
      return p;
    }));
  };
  
  const addResourceToTask = (projectId, taskId, personId) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: p.tasks.map(t => {
            if (t.id === taskId) {
              const days = getDaysBetween(t.startDate, t.endDate);
              return {
                ...t,
                resources: [...t.resources, {
                  personId,
                  dailyHours: Array(days).fill(0)
                }]
              };
            }
            return t;
          })
        };
      }
      return p;
    }));
  };
  
  const removeResourceFromTask = (projectId, taskId, personId) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: p.tasks.map(t => {
            if (t.id === taskId) {
              return {
                ...t,
                resources: t.resources.filter(r => r.personId !== personId)
              };
            }
            return t;
          })
        };
      }
      return p;
    }));
  };
  
  const updateResourceHours = (projectId, taskId, personId, dayIndex, hours) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: p.tasks.map(t => {
            if (t.id === taskId) {
              return {
                ...t,
                resources: t.resources.map(r => {
                  if (r.personId === personId) {
                    const newHours = [...r.dailyHours];
                    newHours[dayIndex] = parseFloat(hours) || 0;
                    return { ...r, dailyHours: newHours };
                  }
                  return r;
                })
              };
            }
            return t;
          })
        };
      }
      return p;
    }));
  };
  
  // Calculate weekly allocations for heatmap
  const calculateWeeklyAllocations = () => {
    const allocations = {};
    
    // Initialize all people and weeks to 0
    people.forEach(person => {
      allocations[person.id] = Array(52).fill(0);
    });
    
    // Sum up hours from all projects and tasks
    projects.forEach(project => {
      project.tasks.forEach(task => {
        task.resources.forEach(resource => {
          const person = people.find(p => p.id === resource.personId);
          if (!person) return;
          
          const startDate = new Date(task.startDate);
          let currentDay = 0;
          
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
  
  // Export to CSV
  const exportToCSV = () => {
    const allocations = calculateWeeklyAllocations();
    let csv = 'Person,';
    
    // Header row with weeks
    weeks.forEach((week, i) => {
      csv += `Week ${i + 1} (${week.start.toLocaleDateString()}),`;
    });
    csv += '\n';
    
    // Data rows
    people.forEach(person => {
      csv += `${person.name},`;
      allocations[person.id].forEach(hours => {
        csv += `${hours},`;
      });
      csv += '\n';
    });
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capacity-plan-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        
        * {
          font-family: 'Outfit', sans-serif;
        }
        
        .mono {
          font-family: 'Space Mono', monospace;
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }
        
        .heatmap-cell {
          transition: all 0.2s ease;
        }
        
        .heatmap-cell:hover {
          transform: scale(1.1);
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        .scroll-container {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        
        .scroll-container::-webkit-scrollbar {
          height: 8px;
        }
        
        .scroll-container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        
        .scroll-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        .scroll-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      
      {/* Header */}
      <header className="glass border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Capacity Planner
                </h1>
                <p className="text-xs text-slate-500 mono">Resource allocation dashboard</p>
              </div>
            </div>
            
            <div className="flex gap-2">
            <button
                onClick={() => setCurrentPage('overview')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'overview'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setCurrentPage('setup')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'setup'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Setup
              </button>

            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentPage === 'setup' ? (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="glass rounded-xl p-1 inline-flex gap-1">
              <button
                onClick={() => setActiveTab('people')}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'people'
                    ? 'bg-white shadow-md text-indigo-600'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                <Users className="w-4 h-4" />
                People
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'projects'
                    ? 'bg-white shadow-md text-indigo-600'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                Projects
              </button>
            </div>
            
            {/* People Tab */}
            {activeTab === 'people' && (
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-800">Team Members</h2>
                  <button
                    onClick={addPerson}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Person
                  </button>
                </div>
                
                <div className="space-y-3">
                  {people.map((person, index) => (
                    <div key={person.id} className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 flex items-center gap-4">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Name</label>
                          <input
                            type="text"
                            value={person.name}
                            onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="Enter name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Hours per Week</label>
                          <input
                            type="number"
                            value={person.hoursPerWeek}
                            onChange={(e) => updatePerson(person.id, 'hoursPerWeek', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none mono"
                            min="0"
                            step="0.5"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removePerson(person.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove person"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {people.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No team members yet. Add someone to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800">Projects</h2>
                  <button
                    onClick={addProject}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>
                
                {projects.map((project) => (
                  <div key={project.id} className="glass rounded-xl p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Project Name</label>
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="Enter project name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={project.startDate}
                            onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
                          <input
                            type="date"
                            value={project.endDate}
                            onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeProject(project.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Tasks */}
                    <div className="border-t border-slate-200 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-slate-700">Tasks / Streams</h3>
                        <button
                          onClick={() => addTask(project.id)}
                          className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center gap-1 text-sm"
                        >
                          <Plus className="w-3 h-3" />
                          Add Task
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {project.tasks.map((task) => (
                          <TaskEditor
                            key={task.id}
                            task={task}
                            project={project}
                            people={people}
                            updateTask={updateTask}
                            removeTask={removeTask}
                            addResourceToTask={addResourceToTask}
                            removeResourceFromTask={removeResourceFromTask}
                            updateResourceHours={updateResourceHours}
                          />
                        ))}
                        
                        {project.tasks.length === 0 && (
                          <div className="text-center py-8 text-slate-400 bg-white rounded-lg border-2 border-dashed border-slate-200">
                            <p className="text-sm">No tasks yet. Add a task to start planning.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {projects.length === 0 && (
                  <div className="glass rounded-xl p-12 text-center text-slate-400">
                    <FolderKanban className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No projects yet. Create a project to start planning.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Overview Page
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Team Capacity Overview</h2>
                <p className="text-sm text-slate-500 mt-1">52-week capacity heatmap • Red indicates over-capacity (&gt;38 hours/week)</p>
              </div>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
            
            <CapacityHeatmap
              people={people}
              weeks={weeks}
              allocations={calculateWeeklyAllocations()}
            />
          </div>
        )}
      </main>
    </div>
  );
}

// Task Editor Component
function TaskEditor({ task, project, people, updateTask, removeTask, addResourceToTask, removeResourceFromTask, updateResourceHours }) {
  const [showResourceDropdown, setShowResourceDropdown] = useState(false);
  const days = getDaysBetween(task.startDate, task.endDate);
  
  const availablePeople = people.filter(p => 
    !task.resources.some(r => r.personId === p.id)
  );
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 space-y-3">
      <div className="flex items-start gap-4">
        <div className="flex-1 grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Task Name</label>
            <input
              type="text"
              value={task.name}
              onChange={(e) => updateTask(project.id, task.id, 'name', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
              placeholder="Enter task name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
            <input
              type="date"
              value={task.startDate}
              onChange={(e) => {
                const newDays = getDaysBetween(e.target.value, task.endDate);
                updateTask(project.id, task.id, 'startDate', e.target.value);
                // Resize all resource arrays
                task.resources.forEach(resource => {
                  const newHours = Array(newDays).fill(0);
                  resource.dailyHours.slice(0, newDays).forEach((h, i) => newHours[i] = h);
                });
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
            <input
              type="date"
              value={task.endDate}
              onChange={(e) => {
                const newDays = getDaysBetween(task.startDate, e.target.value);
                updateTask(project.id, task.id, 'endDate', e.target.value);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>
        <button
          onClick={() => removeTask(project.id, task.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-xs text-slate-500 mono bg-slate-50 px-3 py-1.5 rounded-lg inline-block">
        Duration: {days} days
      </div>
      
      {/* Resources */}
      <div className="border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-slate-700">Resource Allocation</h4>
          {availablePeople.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowResourceDropdown(!showResourceDropdown)}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1 text-xs"
              >
                <Plus className="w-3 h-3" />
                Add Resource
              </button>
              
              {showResourceDropdown && (
                <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 min-w-[200px]">
                  {availablePeople.map(person => (
                    <button
                      key={person.id}
                      onClick={() => {
                        addResourceToTask(project.id, task.id, person.id);
                        setShowResourceDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-indigo-50 text-sm text-slate-700 transition-colors"
                    >
                      {person.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {task.resources.length > 0 && (() => {
          const calendarDays = buildCalendarDays(task.startDate, days);
          const monthGroups = groupDaysByMonth(calendarDays);
          const COL_W = 56;
          const GAP = 4;
          const LABEL_W = 130;

          return (
            <div className="mb-3 overflow-x-auto scroll-container rounded-lg border border-slate-200 bg-slate-50">
              <div style={{ minWidth: 'max-content' }}>

                {/* Calendar header row */}
                <div className="flex items-end" style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', paddingBottom: 4, paddingTop: 6 }}>
                  {/* Sticky label spacer */}
                  <div style={{ width: LABEL_W, flexShrink: 0 }} />
                  {/* Month + day labels */}
                  <div style={{ paddingLeft: 8 }}>
                    {/* Month row */}
                    <div style={{ display: 'flex', gap: GAP, marginBottom: 2 }}>
                      {monthGroups.map((group) => (
                        <div
                          key={group.monthKey}
                          style={{ flexShrink: 0, width: group.days.length * (COL_W + GAP) - GAP, textAlign: 'center' }}
                        >
                          <div style={{ fontSize: 10, fontWeight: 700, color: '#4f46e5', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #a5b4fc', paddingBottom: 2 }}>
                            {group.monthShort}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Day number + D-label */}
                    <div style={{ display: 'flex', gap: GAP }}>
                      {calendarDays.map((day) => (
                        <div key={day.dayIndex} style={{ flexShrink: 0, width: COL_W, textAlign: 'center', lineHeight: 1.2 }}>
                          <div style={{ fontSize: 9, color: '#6366f1', fontFamily: 'monospace', fontWeight: 600 }}>{day.dayOfMonth}</div>
                          <div style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'monospace' }}>D{day.dayIndex + 1}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Per-person rows — same scroll context */}
                {task.resources.map((resource, idx) => {
                  const person = people.find(p => p.id === resource.personId);
                  if (!person) return null;
                  const isLast = idx === task.resources.length - 1;

                  return (
                    <div key={resource.personId} style={{ display: 'flex', alignItems: 'center', padding: '8px 0 8px 0', borderBottom: isLast ? 'none' : '1px solid #e2e8f0' }}>
                      {/* Person label — fixed width, never scrolls */}
                      <div style={{ width: LABEL_W, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 6 }}>
                        <span className="text-xs font-semibold text-slate-700 truncate" style={{ maxWidth: 90 }}>{person.name}</span>
                        <button
                          onClick={() => removeResourceFromTask(project.id, task.id, resource.personId)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                          title="Remove"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Input cells */}
                      <div style={{ display: 'flex', gap: GAP, paddingLeft: 8, paddingRight: 8 }}>
                        {resource.dailyHours.map((hours, dayIndex) => {
                          const day = calendarDays[dayIndex];
                          const isMonthStart = day && day.dayOfMonth === 1;
                          return (
                            <div key={dayIndex} style={{ flexShrink: 0, width: COL_W }}>
                              <input
                                type="number"
                                value={hours}
                                onChange={(e) => updateResourceHours(project.id, task.id, resource.personId, dayIndex, e.target.value)}
                                className="mono focus:ring-2 focus:ring-indigo-500 outline-none"
                                style={{
                                  width: '100%', padding: '4px 2px', fontSize: 11, textAlign: 'center',
                                  border: `1px solid ${isMonthStart ? '#a5b4fc' : '#cbd5e1'}`,
                                  borderRadius: 6,
                                  background: isMonthStart ? '#eef2ff' : 'white',
                                  boxSizing: 'border-box'
                                }}
                                min="0"
                                step="0.5"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
        
        {task.resources.length === 0 && (
          <div className="text-center py-4 text-slate-400 text-xs bg-white rounded-lg border border-dashed border-slate-200">
            No resources assigned yet
          </div>
        )}
      </div>
    </div>
  );
}

// Capacity Heatmap Component
function CapacityHeatmap({ people, weeks, allocations }) {
  const getColor = (hours, maxHours) => {
    if (hours === 0) return 'bg-slate-100';
    if (hours > maxHours) return 'bg-red-500';
    
    const percentage = hours / maxHours;
    if (percentage >= 0.9) return 'bg-orange-400';
    if (percentage >= 0.7) return 'bg-amber-300';
    if (percentage >= 0.5) return 'bg-yellow-200';
    if (percentage >= 0.3) return 'bg-emerald-200';
    return 'bg-emerald-100';
  };
  
  // Group weeks by month
  let currentMonth = '';
  const monthGroups = [];
  let currentGroup = [];
  
  weeks.forEach((week, index) => {
    if (week.monthYear !== currentMonth) {
      if (currentGroup.length > 0) {
        monthGroups.push({ month: currentMonth, weeks: currentGroup });
      }
      currentMonth = week.monthYear;
      currentGroup = [{ ...week, index }];
    } else {
      currentGroup.push({ ...week, index });
    }
  });
  if (currentGroup.length > 0) {
    monthGroups.push({ month: currentMonth, weeks: currentGroup });
  }
  
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
                <div className="text-xs font-semibold text-slate-600 text-center">
                  {group.month}
                </div>
              </div>
            ))}
          </div>
          
          {/* Week headers */}
          <div className="flex mb-2">
            <div className="w-48 flex-shrink-0" />
            {weeks.map((week) => (
              <div key={week.id} className="w-20 flex-shrink-0 px-1">
                <div className="text-[10px] text-slate-500 text-center mono">{week.label}</div>
              </div>
            ))}
          </div>
          
          {/* Heatmap rows */}
          {people.map((person) => (
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
                    <span className={`text-xs font-semibold mono ${hours > person.hoursPerWeek ? 'text-white' : 'text-slate-700'}`}>
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
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-100" />
            <span className="text-xs text-slate-600">No allocation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-100" />
            <span className="text-xs text-slate-600">0-30%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-200" />
            <span className="text-xs text-slate-600">30-50%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-yellow-200" />
            <span className="text-xs text-slate-600">50-70%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-300" />
            <span className="text-xs text-slate-600">70-90%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-orange-400" />
            <span className="text-xs text-slate-600">90-100%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-500" />
            <span className="text-xs text-slate-600">&gt;100% (Over capacity)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mount the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CapacityPlanner />
  </React.StrictMode>
);
