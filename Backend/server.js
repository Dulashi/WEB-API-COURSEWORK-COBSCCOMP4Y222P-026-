const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const weatherSchema = new mongoose.Schema({
    administrative_district: { type: String, required: true, unique: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    airPressure: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Weather = mongoose.model('Weather', weatherSchema);

const mongoPassword = process.env.MONGO_PASSWORD;
const newMongoPassword = 'MYdulashijc2002';
const mongoURI = `mongodb+srv://Dulashi:${newMongoPassword}@cluster0.9judisz.mongodb.net/weather_information`;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Atlas connected');
})
.catch(err => {
    console.error('MongoDB Atlas connection error:', err);
});


const generateWeatherData = async () => {
    try {
        const districts = ['Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kaluthara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mulllaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'];

        for (const district of districts) {
            const data = {
                temperature: Math.random() * 40,
                humidity: Math.random() * 100,
                airPressure: Math.random() * 2000 + 900,
            };
            await Weather.findOneAndUpdate({ administrative_district: district }, data, { upsert: true });
        }
        console.log('Weather data updated successfully');
    } catch (error) {
        console.error('Error updating weather data:', error);
    }
};

// Call generateWeatherData every 5 minutes
setInterval(generateWeatherData, 300000); // 300000 milliseconds = 5 minutes

app.get('/weather/district', async (req, res) => {
    try {
        const weatherData = await Weather.find();
        if (!weatherData) {
            return res.status(404).json({ message: 'Weather data not found for any district' });
        }
        console.log('Weather data fetched successfully for all districts:', weatherData);
        res.status(200).json(weatherData);
    } catch (err) {
        console.error('Error fetching weather data for all districts:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/weather/:district', async (req, res) => {
    const district = req.params.district;
    try {
        const weatherData = await Weather.findOne({ administrative_district: district }).sort({ timestamp: -1 });
        if (!weatherData) {
            return res.status(404).json({ message: 'Weather data not found for district: ' + district });
        }
        console.log('Weather data fetched successfully for district:', district, ':', weatherData);
        res.status(200).json(weatherData);
    } catch (err) {
        console.error('Error fetching weather data for district:', district, ':', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
