import React, { useState } from "react";
import axios from "axios";

function MachineDataForm() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    "IDLE",
    "RUNNING",
    "SPOOL FILED",
    "SPOOL EMPTHY",
    "TAPE DETECT",
    "COPPER BROKEN",
    "OTHERS"

  ];

  // Function to format the date as dd/mm/yyyy
  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOptions((prevOptions) =>
      prevOptions.includes(value)
        ? prevOptions.filter((option) => option !== value)
        : [...prevOptions, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format start and end dates before sending them
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    // Prepare the data
    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      options: selectedOptions,
    };

    try {
      // Send POST request to the server
      const response = await axios.post("http://localhost:5000/machine-data", data);
      console.log("Response from server:", response.data.message);
       // Assuming `response.data.message` contains your data
        const newdata=(response.data.message).map(item=>{
                return [item[0],item[3],item[4]]

        })
      
      const options = [];
      const dates=[];
      const dataset = {};
      
      // Extract unique options
      newdata.forEach(item => {
        if (!options.includes(item[2])) options.push(item[2]);
        if(!dates.includes(item[0]))dates.push(item[0]);
      });
      
      // Group data by options
      options.forEach(option => {
        dataset[option] = newdata.filter(item => item[2] === option);
      })
       console.log(dataset["IDLE"]);

     } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-[120px] text-black p-5 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Machine Data Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Start Date */}
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-lg mb-2">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-lg mb-2">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Options - Displaying as Two Columns */}
        <div className="mb-4">
          <p className="text-lg mb-2">Select Options</p>
          <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={option}
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={handleOptionChange}
                  className="mr-2"
                />
                <label htmlFor={option} className="text-lg">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default MachineDataForm;
