# 📚 TimeReaper

A sleek and responsive React app to track your **daily study time**, visualize progress 📈, and manage logs with full control — all stored locally in your browser!

> ✅ **No sign-up. No ads.**

---

## ✨ Features

- 📅 Select any past date (future dates restricted)
- ⏱️ Add or subtract time in `HH:MM:SS` format
- 📥 Import and 📤 export your data as `.json`
  - Smart merging of imported logs to avoid duplicates or incorrect overwrites
- 🧮 Automatic summary of:
  - ✅ Total study time
  - ✅ Average daily time
  - ✅ Number of active days
- 📊 Real-time line chart using Recharts with proper `HH:MM:SS` formatting
- 🗑️ Delete any entry with an option to 🔄 undo within 5 seconds
- 💾 Saves data securely in `localStorage` – no account or cloud required
- 🌑 Dark Mode UI with smooth animations and interactions
- 📱 Fully responsive and mobile-friendly

---

## 🛠️ Tech Stack

- ⚛️ React (Hooks + Functional Components)
- 📦 Recharts for graphs
- 🧭 `react-datepicker` for intuitive date selection
- 🎨 TailwindCSS-style utility classes
- 🌐 Browser `localStorage` for persistent local data

---

## 🚀 Live Demo

Hosted on **Vercel**  
🔗 [Open TimeReaper App](https://time-reaper.vercel.app)

---

## 📂 Import/Export Behavior

- Export: Downloads a `.json` file with all your time logs.
- Import: Prompts to **merge or replace** existing data.
- Smart Merge:
  - Combines entries on same date
  - Prevents duplicates
  - Accurately updates your total and average time

---

## 🧠 Ideal For

- 🎓 Students preparing for competitive or board exams
- 💻 Self-learners tracking consistency
- 📊 Productivity enthusiasts who love logs and stats

---

> Made with 💻 + ☕ by **CyberLordSY**
