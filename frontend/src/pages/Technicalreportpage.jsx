import React, { useRef } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const InvoiceReport = () => {
  const reportRef = useRef(); // Ref for capturing the report content

  // Data for Pie Chart
  const pieData = {
    labels: ['Product A', 'Product B', 'Product C'],
    datasets: [
      {
        data: [30, 45, 25],
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
      },
    ],
  };

  // Data for Line Chart
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Revenue',
        data: [1000, 1500, 1200, 2000, 1800],
        borderColor: '#4caf50',
        backgroundColor: '#a5d6a7',
        tension: 0.4,
      },
    ],
  };

  // Table data
  const tableData = [
    { item: '01/05/2025', quantity: 15, price: '5'},
    { item: '01/06/2025', quantity: 30, price: '$20'},
    { item: '01/07/2025', quantity: 20, price: '$15'},
  ];

  // Function to download the report as a PDF
  const downloadPDF = async () => {
    const element = reportRef.current; // Reference to the report content
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save('invoice_report.pdf');
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div
        ref={reportRef}
        className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto text-black"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Production Analysis
        </h1>

        {/* Line and Pie Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="w-full">
            <h2 className="text-lg font-semibold text-center mb-4">Prodcution over Time</h2>
            <Line data={lineData} options={{ responsive: false, maintainAspectRatio: false }} />
          </div>
          <div className="w-full">
            <h2 className="text-lg font-semibold text-center mb-4">Product Distribution</h2>
            <Pie data={pieData} options={{ responsive: false, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Summary Table */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-center mb-4">Summary Table</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Runtime</th>
                <th className="border border-gray-300 px-4 py-2">Downtime</th>
             
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{row.item}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.price}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download Button */}
      <div className="text-center mt-6">
        <button
          onClick={downloadPDF}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceReport;
