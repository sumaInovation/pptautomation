const fetchData = require('./fetchdata.controller');

const machinedata = async (req, res) => {
    const { startDate, endDate, options } = req.body;

    try {
        const data = await fetchData("Sheet1");
        if (data != null) {
            const filteredData = data.filter(item => {
                // Convert dates to Date objects for comparison
                const recordDate = new Date(item[0]);
                const start = new Date(startDate);
                const end = new Date(endDate);

                // Normalize status by replacing underscores and making it case-insensitive
                const recordStatus = item[4].replace(/_/g, ' ').toUpperCase();
                const normalizedOptions = options.map(option => option.toUpperCase());

                const isWithinDateRange = recordDate >= start && recordDate <= end;
                const isWithinOptionRange = normalizedOptions.includes(recordStatus);

                return isWithinDateRange && isWithinOptionRange;
            });

          

            return res.status(200).json({ success: true, message: filteredData });
        }
        
        return res.status(400).json({ success: false, message: 'No recorded data!' });
    } catch (err) {
        return res.status(400).json({ success: false, message: 'Server Not Responding!' });
    }
}

module.exports = machinedata;
