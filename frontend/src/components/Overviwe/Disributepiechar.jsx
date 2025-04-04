import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useWebSocket } from "../../context/WebSocketContext";
import { useEffect, useState } from "react";
import axios from "axios";

// Color for Pie Chart sections
const COLORS = ["#00FF53", "#FF0000", "#EC4899", "#00FF43", "#0000FF", "#9FE2BF"];

const Disributepiechar = () => {
	const { messages } = useWebSocket();
	const [userData, setUerData] = useState([
		{ name: 'RUNNING', value: 0 },
		{ name: 'IDLE', value: 0 },
		{ name: 'SPOOL FILED', value: 0 },
		{ name: 'SPOOL EMPTHY', value: 0 },
		{ name: 'COPPER BROKEN', value: 0 },
		{ name: 'OTHERS', value: 0 },
		{ name: 'TAPE DETECT', value: 0 },
	]);

	// Filter out data with value 0
	const filteredData = userData.filter(item => item.value > 0);

	// Function to update the value of 'COPPER BROKEN'
	const updateNewValue = (newValue, itemName) => {
		setUerData((prevData) =>
			prevData.map((item) =>
				item.name === itemName ? { ...item, value: newValue } : item
			)
		);
	};

	useEffect(() => {
		const intervalId = setInterval(async () => {
			try {
				const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/today-data" : "/today-data";
				const response = await axios.get(API_URL);
                 
				// Processing incoming data from Google Sheet
				const reason = [];
				(response.data.message).map(item => {
					if (!reason.includes(item[4])) reason.push(item[4]);
				});

				reason.forEach((element, index, array) => {
					updateNewValue(
						(response.data.message).reduce((total, item) => {
							return total + (item[4] === element ? parseInt(item[3], 10) : 0);
						}, 0),
						element
					);
				});

			} catch (err) {
				console.error(err);
			}
		}, 5000);

		// Cleanup the interval when the component unmounts
		return () => clearInterval(intervalId);
	}, []);

	// Determine font size based on screen width for responsiveness
	const getFontSize = () => {
		const width = window.innerWidth;
		if (width < 600) {
			return 10;  // Smaller font for mobile devices
		} else if (width < 1024) {
			return 12;  // Medium font for tablets
		} else {
			return 14;  // Larger font for desktops
		}
	};

	// Set responsive chart settings
	const responsiveFontSize = getFontSize();

	return (
		<motion.div
			className='p-6 bg-gray-800 bg-opacity-50 border border-gray-700 shadow-lg backdrop-blur-md rounded-xl'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='mb-4 text-lg font-medium text-gray-100'>Today Runtime Vs Downtime</h2>
			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<PieChart>
						<Pie
							data={filteredData}
							cx={"50%"}
							cy={"50%"}
							labelLine={false}
							outerRadius={130}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => {
								return (
									<span style={{ fontSize: responsiveFontSize }}>
										{name} {(percent * 100).toFixed(0)}%
									</span>
								);
							}}
						>
							{userData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default Disributepiechar;
