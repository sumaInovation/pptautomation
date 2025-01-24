import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useWebSocket } from '../../context/WebSocketContext';
const RealTimeLineChart = () => {
	// State to hold the data points for the chart
	const [lineData, setLineData] = useState([]);
	const { messages } = useWebSocket();
	const { Length } = messages
	useEffect(() => {
		try{

			const{Length,start,end,reason}= messages;
			if(Length!=undefined){
               		 //console.log(current_breaking_time)  // This will update state only once on initial render
	const newTime = new Date().toLocaleTimeString(); // Get current time for X-axis
	const newValue =parseInt(Length,10);// Math.floor(Math.random() * 100); // Random value for demo
    // Add new data point
	addData(newTime, newValue);
			}
	

		}catch(e){
         console.log("Cannot real time chart updates due to:",e)
		}
   
    }, [messages]);  // Only runs when `messages` changes
	
	// Function to simulate adding new data points
	const addData = (time, value) => {

		setLineData(prevData => {
			// Add new data point
			const newData = [...prevData, { name: time, value }];

          // Keep only the last 10 data points
			if (newData.length > 10) {
				newData.shift(); // Remove the oldest point
			}

			return newData;
		});
	};

	

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Today Procution Level</h2>

			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<LineChart data={lineData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
						<XAxis dataKey={"name"} stroke='#9ca3af' />
						<YAxis stroke='#9ca3af' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Line
							type='monotone'
							dataKey='value'
							stroke='#6366F1'
							strokeWidth={3}
							dot={false}
							activeDot={{ r: 8, strokeWidth: 2 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default RealTimeLineChart;
