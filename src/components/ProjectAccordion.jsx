import { useState } from 'react';
import { FolderKanban, Plus, Trash2, ChevronDown, ChevronRight, Calendar } from 'lucide-react';
import TaskEditor from './TaskEditor';

function ProjectItem({
  project,
  people,
  isOpen,
  onToggle,
  updateProject,
  removeProject,
  addTask,
  updateTask,
  removeTask,
  addResourceToTask,
  removeResourceFromTask,
  updateResourceHours,
}) {
  const taskCount = project.tasks.length;
  const dateRange = project.startDate && project.endDate
    ? `${new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → ${new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : 'No dates set';

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Accordion Header */}
      <div
        className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-white/50 transition-colors select-none"
        onClick={onToggle}
      >
        <div className="text-slate-400">
          {isOpen
            ? <ChevronDown className="w-5 h-5 text-indigo-500" />
            : <ChevronRight className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-800 truncate">
              {project.name || <span className="text-slate-400 italic">Untitled project</span>}
            </span>
            <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full font-medium flex-shrink-0">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500 mono">
            <Calendar className="w-3 h-3" />
            {dateRange}
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); removeProject(project.id); }}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
          title="Remove project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <div className="border-t border-slate-200/80 px-6 py-5 space-y-5 bg-white/40">
          {/* Project fields */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Project Name</label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
              <input
                type="date"
                value={project.startDate}
                onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
              <input
                type="date"
                value={project.endDate}
                onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
              />
            </div>
          </div>

          {/* Tasks */}
          <div>
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
              {project.tasks.map(task => (
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
      )}
    </div>
  );
}

export default function ProjectAccordion({
  projects,
  people,
  addProject,
  updateProject,
  removeProject,
  addTask,
  updateTask,
  removeTask,
  addResourceToTask,
  removeResourceFromTask,
  updateResourceHours,
}) {
  const [openIds, setOpenIds] = useState(() => projects.map(p => p.id));

  const toggle = (id) =>
    setOpenIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleAddProject = () => {
    addProject();
    // new project will get the next id; open it by reopening all after add
    // we schedule a tick so the new project is in state
    setTimeout(() => setOpenIds(prev => {
      const allIds = projects.map(p => p.id);
      const maxId = Math.max(0, ...allIds) + 1;
      return [...prev, maxId];
    }), 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Projects</h2>
        <button
          onClick={handleAddProject}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center text-slate-400">
          <FolderKanban className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No projects yet. Create a project to start planning.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(project => (
            <ProjectItem
              key={project.id}
              project={project}
              people={people}
              isOpen={openIds.includes(project.id)}
              onToggle={() => toggle(project.id)}
              updateProject={updateProject}
              removeProject={removeProject}
              addTask={addTask}
              updateTask={updateTask}
              removeTask={removeTask}
              addResourceToTask={addResourceToTask}
              removeResourceFromTask={removeResourceFromTask}
              updateResourceHours={updateResourceHours}
            />
          ))}
        </div>
      )}
    </div>
  );
}
