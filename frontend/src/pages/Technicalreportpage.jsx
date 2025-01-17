import React, { useState } from "react";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { format, parseISO } from "date-fns";
import { groupBy } from "lodash";

const machineData = [
  { date: "2025-01-16", running: 5, downtime: 3, reason: "Maintenance" },
  { date: "2025-01-17", running: 8, downtime: 0, reason: "None" },
  { date: "2025-01-18", running: 7, downtime: 1, reason: "Power Failure" },
  { date: "2025-01-19", running: 4, downtime: 2, reason: "Overheating" },
];

const COLORS = ["#0088FE", "#FF8042", "#FFBB28", "#00C49F"];

const AnalysisReport = () => {
  const [timePeriod, setTimePeriod] = useState("daily"); // Options: "daily", "weekly", "monthly"

  // Group data based on the selected time period
  const groupedData = (() => {
    if (timePeriod === "weekly") {
      return groupBy(machineData, (d) => format(parseISO(d.date), "yyyy-'W'ww")); // Weekly grouping
    } else if (timePeriod === "monthly") {
      return groupBy(machineData, (d) => format(parseISO(d.date), "yyyy-MM")); // Monthly grouping
    } else {
      return groupBy(machineData, (d) => d.date); // Daily grouping
    }
  })();

  // Process data for charts and table
  const processedData = Object.entries(groupedData).map(([key, values]) => {
    const runningTotal = values.reduce((sum, item) => sum + item.running, 0);
    const downtimeTotal = values.reduce((sum, item) => sum + item.downtime, 0);

    return {
      time: key,
      running: runningTotal,
      downtime: downtimeTotal,
    };
  });

  return (
    <div className="p-4 space-y-8 mt-[80px]">
      {/* Time Period Selection */}
      <div className="flex space-x-4">
        {["daily", "weekly", "monthly"].map((period) => (
          <button
            key={period}
            className={`px-4 py-2 rounded ${timePeriod === period ? "bg-blue-500 text-white" : "bg-gray-500"}`}
            onClick={() => setTimePeriod(period)}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Charts Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Running vs Downtime</h2>
          <LineChart width={400} height={300} data={processedData}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="running" stroke="#8884d8" />
            <Line type="monotone" dataKey="downtime" stroke="#82ca9d" />
          </LineChart>
        </div>

        {/* Pie Chart */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Downtime Reasons</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={processedData.map((item) => ({
                name: item.reason,
                value: item.downtime,
              }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {processedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>

        {/* Bar Chart */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Daily Running vs Downtime</h2>
          <BarChart width={400} height={300} data={processedData}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="running" fill="#8884d8" />
            <Bar dataKey="downtime" fill="#82ca9d" />
          </BarChart>
        </div>

        {/* Summary */}
        {/* Table at the Bottom */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 mt-8">
          <thead className="bg-gray-500">
            <tr>
              <th className="border px-4 py-2">Time</th>
              <th className="border px-4 py-2">Running Time</th>
              <th className="border px-4 py-2">Downtime</th>
            </tr>
          </thead>
          <tbody>
            {processedData.map((row, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{row.time}</td>
                <td className="border px-4 py-2">{row.running}</td>
                <td className="border px-4 py-2">{row.downtime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
          

        
      </div>
      <div className="bg-gray-500 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <p>
            Total Running Time:{" "}
            <span className="font-semibold">
              {processedData.reduce((sum, item) => sum + item.running, 0)} hours
            </span>
          </p>
          <p>
            Total Downtime:{" "}
            <span className="font-semibold">
              {processedData.reduce((sum, item) => sum + item.downtime, 0)} hours
            </span>
          </p>
        </div>
      
    </div>
  );
};

export default AnalysisReport;
/*


*/