# Capacity Planner

A React-based capacity planner application for forecasting project resources and managing team allocation across a 52-week horizon.

## 📋 Overview

This application helps you plan and visualize your team's capacity across multiple projects. It features:

- **People Management**: Configure team members and their weekly hour capacity
- **Project Planning**: Create projects with multiple tasks/streams
- **Resource Allocation**: Assign people to tasks with day-by-day hour tracking
- **Capacity Heatmap**: Visual overview of team capacity across 52 weeks
- **Over-capacity Detection**: Automatic highlighting when allocation exceeds capacity (>38 hours/week)
- **CSV Export**: Export capacity data for further analysis

## 🚀 Quick Start with react-run

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install react-run globally** (if not already installed):
   ```bash
   npm install -g react-run
   ```

2. **Navigate to the project directory**:
   ```bash
   cd capacity-planner
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the application**:
   ```bash
   npm start
   ```
   
   Or run directly:
   ```bash
   react-run capacity-planner.jsx
   ```

The application will open in your default browser at `http://localhost:3000`

## 📁 Project Structure

```
capacity-planner/
├── capacity-planner.jsx    # Main React application component
├── package.json           # Project dependencies and scripts
├── index.html            # HTML boilerplate (alternative to react-run)
└── README.md             # This file
```

## 🎯 Features

### Setup Page

**People Tab:**
- Add/edit/remove team members
- Configure name and weekly hour capacity
- Default capacity: 38 hours/week

**Projects Tab:**
- Create and manage projects
- Set project start and end dates
- Add tasks/streams to projects
- Configure task-level details:
  - Task name
  - Start and end dates
  - Resource allocation
  - Day-by-day hour input (horizontal scrollable table)

### Overview Page

**Capacity Heatmap:**
- 52-week view with horizontal scrolling
- Color-coded capacity visualization:
  - 🟢 Green: Low utilization (0-50%)
  - 🟡 Yellow/Orange: Medium utilization (50-90%)
  - 🟠 Orange: High utilization (90-100%)
  - 🔴 Red: Over capacity (>100%)
- Month grouping headers
- Weekly hour totals per person

**Export:**
- Download capacity data as CSV
- Includes all people and their weekly allocations

## 💾 Data Storage

The MVP version stores all data locally in React state (no database). This means:

- ✅ No backend required
- ✅ Instant startup
- ✅ Complete privacy
- ⚠️ Data resets on page reload
- ⚠️ No persistence between sessions

### Future Enhancements

The application is architected to easily scale with:
- Backend API integration
- Database persistence (PostgreSQL, MongoDB, etc.)
- User authentication
- Team collaboration features
- Real-time updates

## 🎨 Design

The application features a refined, professional design:

- **Typography**: Outfit (UI) + Space Mono (data)
- **Color Scheme**: Indigo/Purple gradient with slate accents
- **UI Pattern**: Glass-morphism cards with blur effects
- **Responsive**: Optimized for desktop viewing with horizontal scrolling

## 📊 Usage Guide

### Step 1: Configure People

1. Go to Setup → People tab
2. Click "Add Person"
3. Enter name and weekly hour capacity
4. Repeat for all team members

### Step 2: Create Projects

1. Go to Setup → Projects tab
2. Click "Add Project"
3. Enter project name, start date, and end date
4. Click "Add Task" to create tasks within the project

### Step 3: Allocate Resources

1. Within each task, click "Add Resource"
2. Select a team member
3. Enter hours per day in the horizontal day inputs
4. The system calculates total hours automatically

### Step 4: View Capacity

1. Navigate to the Overview page
2. Scroll horizontally to view all 52 weeks
3. Red cells indicate over-capacity (>38h/week)
4. Export to CSV for external analysis

## 🛠️ Customization

### Change Weekly Capacity Threshold

Edit the heatmap color logic in the `getColor` function:

```javascript
if (hours > maxHours) return 'bg-red-500';  // Change threshold here
```

### Modify Planning Horizon

Change the number of weeks in the `generateWeeks` call:

```javascript
const weeks = useMemo(() => generateWeeks(new Date(), 52), []); // Change 52 to desired weeks
```

### Adjust Color Scheme

Modify the Tailwind classes throughout the component or update the CSS variables.

## 📦 Dependencies

- **React 18**: UI framework
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first CSS framework (via CDN in browser version)

## 🐛 Troubleshooting

**Application doesn't start:**
- Ensure Node.js is installed: `node --version`
- Ensure react-run is installed: `npm list -g react-run`
- Try reinstalling: `npm install -g react-run`

**Icons not showing:**
- Check internet connection (lucide-react loads from CDN in react-run)

**Data lost on refresh:**
- Expected behavior in MVP (no persistence)
- Future versions will include backend storage

## 📄 License

MIT License - Feel free to use and modify for your projects.

## 🤝 Contributing

This is an MVP/prototype. Future enhancements could include:

- [ ] Database integration
- [ ] User authentication
- [ ] Multi-user collaboration
- [ ] Import from CSV/Excel
- [ ] Gantt chart view
- [ ] Resource conflict detection
- [ ] Mobile responsive design
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Undo/redo functionality

## 📞 Support

For issues or questions, please refer to the react-run documentation:
https://github.com/FormidableLabs/react-run

---

**Built with React** • **Designed for efficiency** • **Ready to scale**
