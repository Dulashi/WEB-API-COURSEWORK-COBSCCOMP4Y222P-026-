const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

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


app.post('/weather', async (req, res) => {
    try {
        const { administrative_district, temperature, humidity, airPressure } = req.body;
        
        const newWeather = new Weather({
            administrative_district,
            temperature,
            humidity,
            airPressure
        });
        
        const savedWeather = await newWeather.save();
        
        res.status(201).json(savedWeather);
    } catch (err) {
        console.error('Error storing weather data:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/weather', async (req, res) => {
    try {
        const weatherData = await Weather.find().sort({ timestamp: -1 }).limit(1);
        
        console.log('Weather data fetched successfully:', weatherData);

        res.json(weatherData);
    } catch (err) {
        console.error('Error fetching weather data:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
