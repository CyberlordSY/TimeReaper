# 📚 TimeReaper

A sleek and responsive React app to track your **daily study time**, visualize progress 📈, and manage logs with full control — all stored locally in your browser!

## ✨ Features

- 📅 Select any past date (future dates are restricted)
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
- 🌑 Dark Mode UI with modern animations and interactions
- 📱 Fully responsive and mobile-friendly

## 🛠️ Tech Stack

- ⚛️ React (Hooks + Components)
- 📦 Recharts
- 🧭 `react-datepicker` for date selection
- 🎨 TailwindCSS-inspired utility classes
- 🌐 `localStorage` for persistent local data

## 🚀 Try it Live

Hosted on **Vercel**: [🔗 Click here to open the app](https://your-vercel-link.vercel.app)

## 📂 Export/Import Behavior

- Export creates a `.json` file with your current time logs.
- Import prompts to **merge or replace** existing data.
- Merged data auto-detects duplicates and sums hours for the same day.
- Re-importing data will not duplicate entries.

## 🧠 Ideal For

- Students preparing for exams 📖
- Self-learners tracking daily progress 🧑‍💻
- Productivity nerds who love graphs and logs 📊

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

> Made with 💻 + ☕ by **CyberLordSY**
