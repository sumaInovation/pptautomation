
import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { useDataContext } from "../context/useTableContext";
const DynamicReport = () => {
  const { data } = useDataContext();
  const svgRefLineChart = useRef(null);
  const svgRefPieChart = useRef(null);
  const lineData = [];
  const pieData=[];
  const tableData=[];
  data.forEach((item) => {
    if (!lineData.some((i) => i.date == item[0]))
        lineData.push({ date: item[0], value: 0 });
    if(!pieData.some(j=>j.label==item[2]))
      pieData.push({label:item[2],value:0});
    if(!tableData.some(k=>k.date==item[0]))
      tableData.push({date:item[0],runtime:0,downtime:0})
    // Find and update an element
    const elementToUpdate = lineData.find((i) => i.date === item[0]);

    if (elementToUpdate) {
      if(item[2]==="RUNNING")elementToUpdate.value+=parseInt(item[1],10);
    }
    // Find and update an element
    const elementToUpdate1 = pieData.find((i) => i.label === item[2]);

    if (elementToUpdate1) {
      elementToUpdate1.value+=parseInt(item[1],10);
    }
     // Find and update an element
     const elementToUpdate2 = tableData.find((k) => k.date === item[0]);

     if (elementToUpdate2) {
      if(item[2]==="RUNNING"){
        elementToUpdate2.runtime+=parseInt(item[1],10);
      }else{
        elementToUpdate2.downtime+=parseInt(item[1],10);
      }
      
     }
  });
 
 useEffect(() => {
    // Line Chart SVG Rendering
    const svgElementLine = svgRefLineChart.current;
    const lineChartWidth = 500;
    const lineChartHeight = 300;
    const padding = 50; // Padding for labels and axes
    const maxLineValue = Math.max(...lineData.map((d) => d.value));
    const scaleX = (lineChartWidth - 2 * padding) / (lineData.length - 1);
    const scaleY = (lineChartHeight - 2 * padding) / maxLineValue;

    // Calculate the path for the line chart
    const linePath = lineData
      .map((point, index) => {
        const x = padding + index * scaleX;
        const y = lineChartHeight - padding - point.value * scaleY;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    // Generate horizontal gridlines and labels for the y-axis
    const yAxisLabels = Array.from({ length: 6 }, (_, i) => {
      const value = (maxLineValue / 5) * i;
      const y = lineChartHeight - padding - value * scaleY; // Correct y-positioning based on scale
      return `
        <line x1="${padding}" x2="${lineChartWidth - padding}" y1="${y}" y2="${y}" stroke="#e0e0e0" />
        <text x="${padding - 5}" y="${y}" fill="#000" font-size="12" text-anchor="end" dominant-baseline="middle">${Math.floor(value)}</text>
      `;
    }).join("");

    // Generate vertical gridlines and labels for the x-axis
    const xAxisLabels = lineData
      .map((point, index) => {
        const x = padding + index * scaleX;
        return `
          <line x1="${x}" x2="${x}" y1="${padding}" y2="${
          lineChartHeight - padding
        }" stroke="#e0e0e0" />
          <text x="${x}" y="${
          lineChartHeight - padding + 20
        }" fill="#000" font-size="12" text-anchor="middle">${point.date}</text>
        `;
      })
      .join("");

    // Render the SVG
    svgElementLine.innerHTML = `
     <svg width="${lineChartWidth + padding * 2}" height="${lineChartHeight}" xmlns="http://www.w3.org/2000/svg">
    <!-- Draw gridlines -->
    ${yAxisLabels}
    ${xAxisLabels}

    <!-- Draw x-axis -->
    <line x1="${padding}" x2="${lineChartWidth - padding}" y1="${lineChartHeight - padding}" y2="${lineChartHeight - padding}" stroke="black" stroke-width="1" />
    <text x="${lineChartWidth / 2}" y="${lineChartHeight}" fill="#000" font-size="14" text-anchor="middle">Duration</text>

    <!-- Draw y-axis -->
    <line x1="${padding}" x2="${padding}" y1="${padding}" y2="${lineChartHeight - padding}" stroke="black" stroke-width="1" />
    <text x="${padding - 20}" y="${lineChartHeight / 2}" fill="#000" font-size="14" text-anchor="middle" transform="rotate(-90, ${padding - 40}, ${lineChartHeight / 2})">Length(M)</text>

    <!-- Draw line chart -->
    <path d="${linePath}" stroke="blue" fill="none" stroke-width="2"/>
</svg>

    `;

    // Pie Chart SVG Rendering
    const svgElementPie = svgRefPieChart.current;
    const pieChartWidth = 300;
    const pieChartHeight = 300;
    const radius = pieChartWidth / 2;
    const pieTotal = pieData.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0; // Initialize startAngle here
    const pieSlices = pieData.map((slice, index) => {
      const sliceAngle = (slice.value / pieTotal) * 360;
      const endAngle = startAngle + sliceAngle;
      const x1 = radius + radius * Math.cos((Math.PI * startAngle) / 180);
      const y1 = radius + radius * Math.sin((Math.PI * startAngle) / 180);
      const x2 = radius + radius * Math.cos((Math.PI * endAngle) / 180);
      const y2 = radius + radius * Math.sin((Math.PI * endAngle) / 180);
      const largeArcFlag = sliceAngle > 180 ? 1 : 0;

      const pathData = `M${radius},${radius} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;

      // Calculate label position
      const midAngle = startAngle + sliceAngle / 2;
      const labelX =
        radius + (radius / 1.5) * Math.cos((Math.PI * midAngle) / 180);
      const labelY =
        radius + (radius / 1.5) * Math.sin((Math.PI * midAngle) / 180);

      // Format percentage
      const percentage = ((slice.value / pieTotal) * 100).toFixed(1) + "%";

      startAngle = endAngle;

    
        return `
          <path d="${pathData}" fill="hsl(${index * 60}, 70%, 50%)" />
          <text x="${labelX}" y="${labelY}" fill="#000" font-size="09" text-anchor="middle" dominant-baseline="middle">
            ${slice.label} (${percentage})
          </text>
        `;
      
      
    });

    // Render the SVG
    svgElementPie.innerHTML = `
        <svg width="${pieChartWidth}" height="${pieChartHeight}" viewBox="0 0 ${pieChartWidth} ${pieChartHeight}">
          ${pieSlices.join("")}
        </svg>
      `;
  }, [lineData, pieData]);

  const generatePDF = () => {
    const content = document.createElement("div");
    content.innerHTML = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;">
        <!-- Report Title -->
        <header style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 28px; margin: 0; color: #2c3e50;">Analysis Report</h1>
          <p style="font-size: 14px; color: #7f8c8d;">Generated on ${new Date().toLocaleDateString()}</p>
        </header>
        
        <!-- Line Chart Section -->
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 22px; color: #34495e; text-align: center; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px;">Chart 01: Production(M) over Time</h2>
          <div style="display: flex; justify-content: center; align-items: center; margin-top: 10px;">
            ${svgRefLineChart.current.outerHTML}
          </div>
        </section>
        
        <!-- Pie Chart Section -->
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 22px; color: #34495e; text-align: center; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px;">Chart 02: Runtime Vs Downtime</h2>
          <div style="display: flex; justify-content: center; align-items: center; margin-top: 100px;">
            ${svgRefPieChart.current.outerHTML}
          </div>
        </section>
        
        <!-- Table Section -->
        <section style="page-break-before: always; margin-bottom: 40px;">
          <h2 style="font-size: 22px; color: #34495e; text-align: center; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px;">Production Summary</h2>
          <table
            style="
              width: 100%;
              margin: 20px auto;
              border-collapse: collapse;
              text-align: center;
              background-color: #ffffff;
            "
          >
            <thead style="background-color: #2c3e50; color: white;">
              <tr>
                <th style="padding: 12px; border: 1px solid #ddd;">Date</th>
                <th style="padding: 12px; border: 1px solid #ddd;">Runtime</th>
                 <th style="padding: 12px; border: 1px solid #ddd;">Downtime</th>
              </tr>
            </thead>
            <tbody>
              ${tableData
                .map(
                  (row, index) => `
                    <tr style="background-color: ${
                      index % 2 === 0 ? "#f2f2f2" : "#ffffff"
                    };">
                      <td style="padding: 12px; border: 1px solid #ddd;">${
                        row.date
                      }</td>
                      <td style="padding: 12px; border: 1px solid #ddd;">${
                        row.runtime
                      }</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">${
                        row.downtime
                      }</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </section>
        
        <!-- Footer Section -->
        <footer style="margin-top: 50px; font-size: 14px; text-align: center; color: #7f8c8d;">
          <p><strong>PPT Inovation Dept.</strong></p>
          <p>Contact: sumaautomationlk@gmail.com | Phone: +94 762183549</p>
          <p>© 2025 Dynamic Solutions Inc. All rights reserved.</p>
        </footer>
      </div>
    `;

    html2pdf()
      .from(content)
      .set({
        margin: 10,
        filename: "dynamic-report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  return (
    <>
    <div className="p-4 mt-[80px] text-black">
      <div className="flex flex-col md:flex-row justify-between mt-[-2000px]">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Line Chart</h2>
          <div ref={svgRefLineChart}></div>
        </div>
        <div>
        
          <h2 className="mb-2 text-lg font-semibold">Pie Chart</h2>
          <div ref={svgRefPieChart}></div>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="mb-2 text-lg font-semibold">Data Table</h2>
        <table className="w-full border border-collapse border-gray-400 table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-400">Date</th>
              <th className="px-4 py-2 border border-gray-400">Value</th>
            </tr>
          </thead>
          <tbody>
            {lineData.map((row, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border border-gray-400">{row.date}</td>
                <td className="px-4 py-2 border border-gray-400">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     
    </div>
    <div className="relative w-full p-4">
      {/* Button in the right corner */}
      <button className="absolute top-0 right-0 px-4 py-2 m-2 text-white bg-blue-500 rounded"
      onClick={generatePDF}>
        Print Report
      </button>
    </div>
    </>
  );
};

export default DynamicReport;

