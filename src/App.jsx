import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Navbar from "./components/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";

function App() {
  const [studyHours, setStudyHours] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [studyDuration, setStudyDuration] = useState("00:00:00");
  const [undoLog, setUndoLog] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);

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
    return new Intl.DateTimeFormat("en-GB").format(dateObj).split("/").join("-");
  };

  const isValidDuration = (value) => {
    return /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value);
  };

  const getDurationInHours = () => {
    if (!isValidDuration(studyDuration)) return 0;

    const [h, m, s] = studyDuration.split(":").map(Number);
    return h + m / 60 + s / 3600;
  };

  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    return selected > today;
  };


const handleAddTime = () => {
  if (!isValidDuration(studyDuration)) {
    alert("Please enter a valid duration in HH:MM:SS format.");
    return;
  }

  const hoursToAdd = getDurationInHours();
  if (hoursToAdd <= 0) {
    alert("Duration must be greater than 0.");
    return;
  }

  const key = formatDate(selectedDate);

  const currentHours = studyHours[key] || 0;
  if (currentHours + hoursToAdd > 24) {
    alert("Cannot log more than 24 hours in a single day.");
    return;
  }

  const updated = {
    ...studyHours,
    [key]: currentHours + hoursToAdd,
  };

  setStudyHours(updated);
  saveToLocal(updated);
  setShowConfirmation(true);

  // Reset input
  setStudyDuration("00:00:00");
  setSelectedDate(new Date());
};

function formatToHHMMSS(decimalHours) {
  const totalSeconds = Math.floor(decimalHours * 3600);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

const handleSubtractTime = () => {
  if (!isValidDuration(studyDuration)) {
    alert("Please enter a valid duration in HH:MM:SS format.");
    return;
  }

  const hoursToSubtract = getDurationInHours();
  if (hoursToSubtract <= 0) {
    alert("Duration must be greater than 0.");
    return;
  }

  const key = formatDate(selectedDate);
  const currentHours = studyHours[key] || 0;

  const newTime = currentHours - hoursToSubtract;
  const updated = { ...studyHours };

  if (newTime > 0) {
    updated[key] = newTime;
  } else {
    delete updated[key];
    alert("Time subtracted completely. Entry deleted.");
  }

  setStudyHours(updated);
  saveToLocal(updated);
  setShowConfirmation(true);

  // Reset input
  setStudyDuration("00:00:00");
  setSelectedDate(new Date());
};


  const handleUndoDelete = () => {
    if (!undoLog) return;
    const restored = { ...studyHours, [undoLog.date]: undoLog.hours };
    setStudyHours(restored);
    saveToLocal(restored);
    setUndoLog(null);
    clearTimeout(undoTimer);
  };

  const handleDeleteDate = (date) => {
    const deletedEntry = { date, hours: studyHours[date] };
    const updated = { ...studyHours };
    delete updated[date];

    setStudyHours(updated);
    saveToLocal(updated);
    setUndoLog(deletedEntry);

    if (undoTimer) {
  clearTimeout(undoTimer);
}
const timer = setTimeout(() => {
  setUndoLog(null);
  setUndoTimer(null); // ✅ Also reset the timer ref
}, 5000);
setUndoTimer(timer);

  };

  const data = Object.entries(studyHours)
    .sort(([a], [b]) => {
      const [d1, m1, y1] = a.split("-").map(Number);
      const [d2, m2, y2] = b.split("-").map(Number);
      return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
    })
    .map(([date, hours]) => ({ date, hours }));

  const totalHours = Object.values(studyHours).reduce((a, b) => a + b, 0);
  const totalDays = Object.keys(studyHours).length;
  const avgHours = totalDays === 0 ? 0 : totalHours / totalDays;

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-5 px-4 sm:px-6 rounded-xl shadow-lg bg-black p-5 min-h-[80vh] max-w-3xl text-white scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">

        {/* Input Section */}
        <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-md border border-gray-700 mb-8 transition-all overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 tracking-wide">Update Study Time</h2>

          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            {/* Date Picker */}
            <div className="w-full sm:w-1/2">
              <label htmlFor="date-input" className="block text-sm mb-1">Select Date:</label>
              <DatePicker
                id="date-input"
                selected={selectedDate}
                onChange={(date) => date && setSelectedDate(date)}
                dateFormat="dd-MM-yyyy"
                className="focus:outline focus:ring-2 focus:ring-blue-500 flex-1 bg-neutral-800 hover:bg-neutral-700 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out hover:scale-[1.02] cursor-pointer"
                calendarClassName="dark-datepicker"
                popperPlacement="bottom-start"
                 minDate={new Date(new Date().setDate(new Date().getDate() - 31))}
  maxDate={new Date()}
              />

            </div>

            {/* Duration Input */}
            <div className="w-full sm:w-1/2">
              <label htmlFor="duration-input" className="block text-sm mb-1 text-gray-300">
                Study Duration (HH:MM:SS):
              </label>
              <input
                type="text"
                id="duration-input"
                value={studyDuration}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^[0-9:]*$/.test(val)) {
                    setStudyDuration(val);
                  }
                }}
                placeholder="e.g. 02:30:15"
                className="focus:outline focus:ring-2 focus:ring-blue-500 flex-1 bg-neutral-800 hover:bg-neutral-700 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out hover:scale-[1.02] cursor-pointer"

              />
              {!isValidDuration(studyDuration) && (
                <p className="mt-1 text-xs text-red-500">
                  Invalid time. Use HH:MM:SS (00–23:59:59)
                </p>
              )}
              
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddTime}
              className="focus:outline focus:ring-2 focus:ring-blue-500 flex-1 bg-[#3b3b3b] hover:bg-[#505050] px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out hover:scale-[1.02] cursor-pointer"
            >
              ➕ Add Time
            </button>
            <button
              onClick={handleSubtractTime}
              className="focus:outline focus:ring-2 focus:ring-blue-500 flex-1 bg-[#3b3b3b] hover:bg-[#505050] px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out hover:scale-[1.02] cursor-pointer"
            >
              ➖ Subtract Time
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-center text-white">
          <div className="bg-[#1a1a1a] p-4 rounded-xl shadow-md">
            <div className="text-lg font-semibold">📅 Days Studied</div>
            <div className="text-2xl mt-1">{totalDays}</div>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-xl shadow-md">
            <div className="text-lg font-semibold">⏳ Total Hours</div>
            <div className="text-2xl mt-1">{totalHours.toFixed(2)}</div>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-xl shadow-md">
            <div className="text-lg font-semibold">📈 Avg. per Day</div>
            <div className="text-2xl mt-1">{avgHours.toFixed(2)}</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-md border border-gray-700 mb-8 transition-all overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 tracking-wide">Study Time Chart</h2>
          {data.length === 0 ? (
            <p className="text-gray-400 text-sm text-center">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis
                  dataKey="date"
                  stroke="#e5e5e5"
                  tickFormatter={(tick) => {
                    const [day, month, year] = tick.split("-");
                    return `${day}-${month}-${year}`;
                  }}
                />
                <YAxis stroke="#e5e5e5" />
                <Tooltip
                formatter={(value) => formatToHHMMSS(value)} 
      labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "#4b5563",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="hours" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Logs Section */}
        <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-md border border-gray-700 mb-8 transition-all overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 tracking-wide">Recent Days</h2>
          {data.length === 0 ? (
            <p className="text-gray-500 text-sm">No study records found.</p>
          ) : (
            <ul className="space-y-3 text-sm break-words max-h-[300px] overflow-y-auto w-full sm:max-w-2xl mx-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {data.slice(-7).map(({ date, hours }) => (
                <li
                  key={date}
                  className="flex flex-col sm:flex-row justify-between sm:items-center bg-black border border-gray-700 rounded-lg p-4 transition-all hover:bg-[#111] space-y-2 sm:space-y-0"
                >
                  <span>
                    <strong>{(() => {
                      const [d, m, y] = date.split("-");
                      return `${d}-${m}-${y}`;
                    })()}</strong> - {formatToHHMMSS(hours)} hours
                  </span>
                  <button
                    onClick={() => handleDeleteDate(date)}
                    className="focus:outline focus:ring-2 focus:ring-blue-500 bg-[#4a0000] hover:bg-[#5c0000] px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out hover:scale-[1.02] cursor-pointer"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Confirmation Toast */}
        {showConfirmation && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out z-50">
            ✅ Study time updated successfully!
          </div>
        )}

        {/* Undo Delete Toast */}
        {undoLog && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-3 rounded shadow-lg z-50 flex items-center gap-4 animate-fade-in-out2">
            <span>Log for <strong>{undoLog.date}</strong> deleted.</span>
            <button
              onClick={handleUndoDelete}
              className="focus:outline focus:ring-2 focus:ring-blue-500 text-blue-400 underline hover:text-blue-300 text-sm cursor-pointer"
            >
              Undo
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
