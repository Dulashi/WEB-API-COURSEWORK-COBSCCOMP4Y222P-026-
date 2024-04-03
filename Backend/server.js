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

app.get('/weather', async (req, res) => {
    try {
        const weatherData = await Weather.find().sort({ timestamp: -1 });

        console.log('Weather data fetched successfully:', weatherData);
        const jsonData = JSON.stringify(weatherData);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(jsonData);
    } catch (err) {
        console.error('Error fetching weather data:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
