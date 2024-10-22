// index.js or app.js
const connectDB = require('./db'); // Import the connectDB function
const Weather = require('./models/Weather'); // Import your Weather model

// Function to summarize weather data
async function summarizeWeatherData() {
    try {
        await connectDB(); // Connect to MongoDB

        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        // Aggregate data using Mongoose
        const summary = await Weather.aggregate([
            {
                $match: {
                    date: { $gte: startOfDay, $lt: endOfDay } // Match today's records
                }
            },
            {
                $group: {
                    _id: '$city', // Group by city
                    minTemperature: { $min: '$temperature' },
                    maxTemperature: { $max: '$temperature' },
                    avgTemperature: { $avg: '$temperature' },
                    conditionCounts: { $push: { condition: '$condition', count: 1 } }, // Count conditions
                    count: { $sum: 1 } // Count total records
                }
            }
        ]);

        // Prepare the summary output
        const summaryOutput = summary.map(item => {
            // Count the occurrences of each condition
            const conditionCountMap = item.conditionCounts.reduce((acc, curr) => {
                acc[curr.condition] = (acc[curr.condition] || 0) + curr.count;
                return acc;
            }, {});

            return {
                city: item._id,
                minTemperature: item.minTemperature,
                maxTemperature: item.maxTemperature,
                avgTemperature: item.avgTemperature,
                conditionCounts: conditionCountMap,
                recordCount: item.count
            };
        });

        console.log("Daily Weather Summary:", summaryOutput);
        return summaryOutput; // Return the summary output for further processing
    } catch (error) {
        console.error("Error summarizing data:", error);
    }
}

// Call the function to generate and log the summary
summarizeWeatherData();
