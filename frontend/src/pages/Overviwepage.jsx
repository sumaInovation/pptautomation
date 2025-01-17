import React, { useEffect, useState } from 'react'
import { BarChart2, ShoppingBag, Fuel, Target } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from '../components/common/StatCard'
import RealTimeLineChart from '../components/Overviwe/RealTimeLineChart'
import Disributepiechar from '../components/Overviwe/Disributepiechar'
import { useWebSocket } from '../context/WebSocketContext';


const Overviwepage = () => {
	const[IsMachineRun,setIsMachineRun]=useState(false);
	const [todatproduction, setTodayproduction] = useState(0);
	const { messages } = useWebSocket();
	const[length,setLength]=useState(0)
	const[previousState,setPreviousState]=useState('IDLE');
   
	useEffect(() => {
		
	
		try{
			const{Length,start,end,reason,state}=messages;
			if(Length!=undefined){
                  setLength(Length)
			}
			if(state!=undefined)setIsMachineRun(state)
		}catch(e){
			console.log("Error:",e)
		}

        


	}, [messages])
	return (
		
		<div className='flex-1 overflow-y-auto  p-4 z-0 mt-[75px] '>
		
			<main className=' mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Machine State' icon={Fuel} value={IsMachineRun==true?"Running":"Stop"} color={IsMachineRun==true?"#3f8f29":"#de1a24"} />
					<StatCard name='Today Production' icon={Target} value={length} color='#8B5CF6' />
					<StatCard name='This Month Production' icon={ShoppingBag} value='5672M' color='#EC4899' />
					<StatCard name='Efficency of Machine' icon={BarChart2} value='62.2%' color='#10B981' />
				</motion.div>

				{/* CHARTS */}


				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<RealTimeLineChart />
					<Disributepiechar />
					

					

				</div>

			</main>
		</div>
	)
}

export default Overviwepage
