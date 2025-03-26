const moment = require('moment'); // You can install moment using npm install moment
const fetchData = require('./fetchdata.controller')
const ThisMonthProduction=async(req ,res)=>{
    try{
     const data=await fetchData("Sheet1");
    
    if(data==null)return res.status(401).json({success:false,message:"No Recorded Data"});
    // Get the current date and month
const currentMonth = moment().format('MM'); // Current month in MM format
const currentYear = moment().format('YYYY'); // Current year in YYYY format
         
       // Calculate the sum of the current month's values
const sumCurrentMonth = data.reduce((sum, item) => {
    // Check if the date is in the current month and year
    const [month, day, year] = item[0].split('/');
    const paddedMonth = month.padStart(2, '0'); // e.g., "1" becomes "01"
    console.log(month,currentMonth)
    if (paddedMonth === currentMonth && year === currentYear && item[4]=="RUNNING")  {
      return sum + parseInt(item[5],10);
    }
    return sum;
  }, 0);
    return res.status(200).json({success:true,message:sumCurrentMonth})


    }catch(error){
     return res.status(401).json({success:false,message:"cannot fetch data"})

    }
 


}
module.exports=ThisMonthProduction;