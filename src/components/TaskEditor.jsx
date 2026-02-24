import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { getDaysBetween } from '../utils';

export default function TaskEditor({
  task,
  project,
  people,
  updateTask,
  removeTask,
  addResourceToTask,
  removeResourceFromTask,
  updateResourceHours,
}) {
  const [showResourceDropdown, setShowResourceDropdown] = useState(false);
  const days = getDaysBetween(task.startDate, task.endDate);

  const availablePeople = people.filter(
    p => !task.resources.some(r => r.personId === p.id)
  );

  return (
    <div className="bg-blue-50 rounded-lg p-4 shadow-sm border border-slate-200 space-y-3">
      <h3 className="text-sm font-semibold text-slate-800">
        {task.name.trim() ? task.name : <span className="text-slate-400 italic font-normal">Untitled task</span>}
      </h3>

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
                task.resources.forEach(resource => {
                  const newHours = Array(newDays).fill(0);
                  resource.dailyHours.slice(0, newDays).forEach((h, i) => (newHours[i] = h));
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

        {task.resources.map(resource => {
          const person = people.find(p => p.id === resource.personId);
          if (!person) return null;

          return (
            <div key={resource.personId} className="mb-4 bg-slate-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">{person.name}</span>
                <button
                  onClick={() => removeResourceFromTask(project.id, task.id, resource.personId)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remove resource"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="overflow-x-auto scroll-container">
                <div className="flex gap-1 pb-2">
                  {resource.dailyHours.map((hours, dayIndex) => (
                    <div key={dayIndex} className="flex-shrink-0">
                      <div className="text-[10px] text-slate-500 text-center mb-1 mono">D{dayIndex + 1}</div>
                      <input
                        type="number"
                        value={hours}
                        onChange={(e) =>
                          updateResourceHours(project.id, task.id, resource.personId, dayIndex, e.target.value)
                        }
                        className="w-14 px-2 py-1 border border-slate-300 rounded text-xs text-center mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        min="0"
                        step="0.5"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {task.resources.length === 0 && (
          <div className="text-center py-4 text-slate-400 text-xs bg-white rounded-lg border border-dashed border-slate-200">
            No resources assigned yet
          </div>
        )}
      </div>
    </div>
  );
}
