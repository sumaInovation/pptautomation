import React, { useEffect, useState } from "react";
import { useDataContext } from "../context/useTableContext";
import { useNavigate } from "react-router-dom";
import ReportGenerator from "../pages/Technicalreportpage";
const Analysispage = () => {
  const [Keys, setKeys] = useState();
  const [Tablevalue, setTablevalue] = useState();
  const navigate = useNavigate();
  const { data } = useDataContext();
  useEffect(() => {
    analysis();

    // Check if the user is visiting the page for the first time or refreshing
    const isRefreshed = localStorage.getItem("hasRefreshed");

    if (isRefreshed) {
      // Redirect to another page if the page is refreshed
      //navigate('/report'); // change '/home' to the page you want to redirect to
    } else {
      // Set flag in localStorage indicating that the page has been refreshed
      localStorage.setItem("hasRefreshed", "true");
    }

    // Optional: Remove the flag when the component is unmounted (e.g., on page unload)
    return () => {
      localStorage.removeItem("hasRefreshed");
    };
  }, [navigate]);
  const analysis = async () => {
    const options = [];
    const dates = [];
    const dataset = {};
    let tabledata = {};
    // different dates & options
    data.forEach((item) => {
      if (!options.includes(item[2])) options.push(item[2]);
      if (!dates.includes(item[0])) dates.push(item[0]);
    });

    // Group data by options
    options.forEach((option) => {
      dataset[option] = data.filter((item) => item[2] === option);
    });
    options.forEach((j) => {
      dates.forEach((i) => {
        const sum = dataset[j].reduce((acc, prev) => {
          if (!acc[i]) acc[i] = 0;
          //if (prev[0] == i) acc[i] += parseInt(prev[1], 10);
          if (prev[0] == i) acc[i] += parseFloat(prev[1]);
          return acc;
        }, {});
        if (!tabledata[j]) tabledata[j] = [];
        tabledata[j].push(sum);
      });
    });

    setKeys(Object.keys(tabledata));
    setTablevalue(tabledata);
    console.log(tabledata);
  };

  if (!Tablevalue)
    return <h1 className="mt-[80px] text-white">No Table Data</h1>;

  return (
    <div className="container mx-auto p-4 mt-[80px]">
      <ReportGenerator />
      <h2 className="mb-4 text-2xl font-semibold text-center">Data Tables</h2>
      <div className="grid gap-4 lg:grid-cols-4">
        {Object.keys(Tablevalue).map((category) => {
          // Calculate the total value for the current category
          const totalValue = Tablevalue[category].reduce((sum, entry) => {
            const value = Object.values(entry)[0]; // Extract value
            return sum + value;
          }, 0);

          return (
            <div key={category} className="mb-6">
              <h3 className="mb-2 text-xl font-medium text-center">
                {category}
              </h3>

              {/* Make the table scrollable on smaller screens */}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse table-auto">
                  <thead>
                    <tr className="bg-gray-600">
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Duration.toFixed(2)(Min)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Tablevalue[category].map((entry, index) => {
                      const date = Object.keys(entry)[0]; // Extract the date
                      const value = entry[date]; // Extract the value
                      return (
                        <tr key={index}>
                          <td className="p-2 border">{date}</td>
                          <td className="p-2 border">{value}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* Total row at the bottom */}
                  <tfoot>
                    <tr className="font-semibold bg-gray-700">
                      <td className="p-2 text-right border">Total</td>
                      <td className="p-2 border">{totalValue}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Analysispage;
