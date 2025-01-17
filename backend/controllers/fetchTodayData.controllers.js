const fetchData = require('./fetchdata.controller')

const todaydata = async (req, res) => {
     
       try {
        const data = await fetchData("Sheet1");
        if (data != null){
            
            const filteredData=data.filter(item=>{
                return new Date().toLocaleDateString()==item[0];
            })
        
            return res.status(200).json({ success: true, message: filteredData });
        }
        return res.status(400).json({ success: false, message: 'No recoded data!' });
    } catch (err) {
        return res.status(400).json({ success: false, message: 'Server Not Responds!' });

    }
}

module.exports = todaydata;  