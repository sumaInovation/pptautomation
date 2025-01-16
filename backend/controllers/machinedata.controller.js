const fetchData = require('../controllers/googlesheet.controller')

const machinedata = async (req, res) => {
     const{startDate, endDate,options}=req.body;
       try {
        const data = await fetchData("Sheet1");
        if (data != null){
            
            const filteredData=data.filter(item=>{
                const isWithinDataRange=startDate<=item[0] && endDate>=item[0];
                const isWithinOptionRange=options.includes(item[4])
                return isWithinDataRange && isWithinOptionRange
            })
        
            return res.status(200).json({ success: true, message: filteredData });
        }
        return res.status(400).json({ success: false, message: 'No recoded data!' });
    } catch (err) {
        return res.status(400).json({ success: false, message: 'Server Not Responds!' });

    }
}

module.exports = machinedata;  