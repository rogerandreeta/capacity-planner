import { Users, Plus, Trash2 } from 'lucide-react';

export default function PeopleList({ people, addPerson, updatePerson, removePerson }) {
  return (
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
        {people.map(person => (
          <div
            key={person.id}
            className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 flex items-center gap-4"
          >
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
  );
}
