import { useState } from 'react';
import { Users, FolderKanban } from 'lucide-react';
import PeopleList from './PeopleList';
import ProjectAccordion from './ProjectAccordion';

const TABS = [
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'people', label: 'People', icon: Users },
];

export default function Setup({
  people,
  projects,
  addPerson,
  updatePerson,
  removePerson,
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
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="glass rounded-xl p-1 inline-flex gap-1" id="test">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === id
                ? 'bg-white shadow-md text-indigo-600'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'people' && (
        <PeopleList
          people={people}
          addPerson={addPerson}
          updatePerson={updatePerson}
          removePerson={removePerson}
        />
      )}

      {activeTab === 'projects' && (
        <ProjectAccordion
          projects={projects}
          people={people}
          addProject={addProject}
          updateProject={updateProject}
          removeProject={removeProject}
          addTask={addTask}
          updateTask={updateTask}
          removeTask={removeTask}
          addResourceToTask={addResourceToTask}
          removeResourceFromTask={removeResourceFromTask}
          updateResourceHours={updateResourceHours}
        />
      )}
    </div>
  );
}
