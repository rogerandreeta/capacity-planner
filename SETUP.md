# Setup Guide - Capacity Planner

## 🚀 Complete Setup Instructions

Follow these steps to get the Capacity Planner running on your Mac:

### Step 1: Install Dependencies

Run this command in your project directory:

```bash
npm install
```

This will install all the necessary packages including:
- React & ReactDOM
- Vite (build tool)
- Tailwind CSS (styling)
- Lucide React (icons)

### Step 2: Start the Development Server

```bash
npm run dev
```

Vite will start the development server and automatically open your browser to `http://localhost:3000`

### Step 3: Build for Production (Optional)

When you're ready to deploy:

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

---

## 📁 Project Structure

```
capacity-planner/
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── src/
│   ├── main.jsx           # Entry point
│   ├── App.jsx            # Main Capacity Planner component
│   └── index.css          # Global styles with Tailwind
└── README.md              # Documentation
```

---

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## ✅ Verification

After running `npm run dev`, you should see:

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

The app should automatically open in your browser showing the Capacity Planner interface.

---

## 🐛 Troubleshooting

### Port 3000 already in use
If you see an error about port 3000 being in use, either:
- Stop the other application using port 3000
- Or Vite will automatically use the next available port (3001, 3002, etc.)

### Dependencies installation fails
Try clearing npm cache and reinstalling:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Blank page or errors
1. Make sure you're in the correct directory
2. Check that all files are present
3. Try stopping the server (Ctrl+C) and running `npm run dev` again

### Tailwind styles not working
Make sure you ran `npm install` to install all dependencies including Tailwind CSS.

---

## 🎯 What's Different from react-run

This setup uses **Vite** instead of `react-run` because:
- ✅ More reliable and widely used
- ✅ Faster hot-reload during development
- ✅ Better build optimization
- ✅ Easier to configure and extend
- ✅ Works better with Tailwind CSS

---

## 📦 Next Steps

1. Open the app at `http://localhost:3000`
2. Go to Setup → People tab to add team members
3. Go to Setup → Projects tab to create projects and tasks
4. View the Overview page to see the capacity heatmap
5. Export to CSV when needed

Happy planning! 🎉
