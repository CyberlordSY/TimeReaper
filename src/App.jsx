import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Navbar from "./components/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [studyHours, setStudyHours] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState("1");
  const [selectedMinute, setSelectedMinute] = useState("0");

  useEffect(() => {
    const saved = localStorage.getItem("studyHours");
    if (saved) {
      try {
        setStudyHours(JSON.parse(saved));
      } catch {
        console.error("Failed to parse localStorage data");
        setStudyHours({});
      }
    }
  }, []);

  const saveToLocal = (data) => {
    localStorage.setItem("studyHours", JSON.stringify(data));
  };

  const formatDate = (dateObj) => {
    return dateObj.toISOString().split("T")[0];
  };

  const getDurationInHours = () => {
    return parseInt(selectedHour) + parseInt(selectedMinute) / 60;
  };

  const handleAddTime = () => {
    const hoursToAdd = getDurationInHours();
    if (hoursToAdd <= 0) return;

    const key = formatDate(selectedDate);
    const updated = {
      ...studyHours,
      [key]: (studyHours[key] || 0) + hoursToAdd,
    };

    setStudyHours(updated);
    saveToLocal(updated);
  };

  const handleSubtractTime = () => {
    const hoursToSubtract = getDurationInHours();
    const key = formatDate(selectedDate);
    if (hoursToSubtract <= 0 || !studyHours[key]) return;

    const current = studyHours[key];
    const newTime = current - hoursToSubtract;

    const updated = { ...studyHours };
    if (newTime > 0) {
      updated[key] = newTime;
    } else {
      delete updated[key];
    }

    setStudyHours(updated);
    saveToLocal(updated);
  };

  const handleDeleteDate = (date) => {
    const confirmDelete = window.confirm(
      `Delete study log for ${date}? This cannot be undone.`
    );
    if (!confirmDelete) return;

    const updated = { ...studyHours };
    delete updated[date];

    setStudyHours(updated);
    saveToLocal(updated);
  };

  const data = Object.entries(studyHours)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, hours]) => ({ date, hours }));

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-5 rounded-xl shadow-lg bg-black p-5 min-h-[80vh] max-w-3xl text-white">
        {/* Input Section */}
        <div className="mb-6 bg-[#1a1a1a] p-6 rounded-xl shadow border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Update Study Time</h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Calendar Picker */}
            <div className="w-full sm:w-1/2">
              <label className="block text-sm mb-1">Select Date:</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
                className="w-full rounded-md px-4 py-2 border border-gray-600 bg-black text-white"
                calendarClassName="bg-black text-white"
              />
            </div>

            {/* Scroll Pickers for Hour and Minute */}
            <div className="w-full sm:w-1/2 flex gap-2">
              <div className="flex flex-col flex-1">
                <label className="block text-sm mb-1">Hours</label>
                <select
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                  className="rounded-md px-2 py-2 border border-gray-600 bg-black text-white h-10"
                >
                  {hourOptions.map((h) => (
                    <option key={h} value={h}>
                      {h.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col flex-1">
                <label className="block text-sm mb-1">Minutes</label>
                <select
                  value={selectedMinute}
                  onChange={(e) => setSelectedMinute(e.target.value)}
                  className="rounded-md px-2 py-2 border border-gray-600 bg-black text-white h-10"
                >
                  {minuteOptions.map((m) => (
                    <option key={m} value={m}>
                      {m.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 justify-between">
            <button
              onClick={handleAddTime}
              className="flex-1 bg-green-700 hover:bg-green-600 px-3 py-2 rounded text-sm font-semibold"
            >
              ➕ Add Time
            </button>
            <button
              onClick={handleSubtractTime}
              className="flex-1 bg-yellow-700 hover:bg-yellow-600 px-3 py-2 rounded text-sm font-semibold"
            >
              ➖ Subtract Time
            </button>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl shadow border border-gray-700 mb-6">
          <h2 className="text-xl font-bold mb-4">Study Time Chart</h2>
          {data.length === 0 ? (
            <p className="text-gray-400 text-sm text-center">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="date" stroke="#e5e5e5" />
                <YAxis stroke="#e5e5e5" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "#4b5563",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="hours" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Logs Section */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl shadow border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Logs</h2>
          {data.length === 0 ? (
            <p className="text-gray-500 text-sm">No study records found.</p>
          ) : (
            <ul className="space-y-3">
              {data.map(({ date, hours }) => (
                <li
                  key={date}
                  className="flex justify-between items-center bg-black border border-gray-600 rounded p-3"
                >
                  <span>
                    <strong>{date}</strong> - {hours.toFixed(2)} hours
                  </span>
                  <button
                    onClick={() => handleDeleteDate(date)}
                    className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded text-sm font-semibold"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
