import { Download } from 'lucide-react';
import CapacityHeatmap from './CapacityHeatmap';
import GanttChart from './GanttChart';

export default function Overview({ people, weeks, allocations, projects, onExportCSV }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Team Capacity Overview</h2>
          <p className="text-sm text-slate-500 mt-1">
            52-week capacity heatmap • Red indicates over-capacity (&gt;38 hours/week)
          </p>
        </div>
        <button
          onClick={onExportCSV}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <CapacityHeatmap people={people} weeks={weeks} allocations={allocations} />

      <GanttChart projects={projects} weeks={weeks} />
    </div>
  );
}
