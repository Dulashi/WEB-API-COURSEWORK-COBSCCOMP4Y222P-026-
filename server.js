const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');


const app = express();
const port = 3000;  // the application is not running in this port anymore , because it is deployed in Cyclic

app.use(bodyParser.json());
app.use(cors());


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Weather:
 *       type: object
 *       properties:
 *         administrative_district:
 *           type: string
 *         temperature:
 *           type: number
 *         humidity:
 *           type: number
 *         airPressure:
 *           type: number
 *         timestamp:
 *           type: string
 *           format: date-time
 */


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
                temperature: (Math.random() * 40).toFixed(2),
                humidity: (Math.random() * 100).toFixed(2),
                airPressure: (Math.random() * 2000 + 900).toFixed(2),
            };
            await Weather.findOneAndUpdate({ administrative_district: district }, data, { upsert: true });
        }
        console.log('Weather data updated successfully');
    } catch (error) {
        console.error('Error updating weather data:', error);
    }
};

// Call generateWeatherData every 5 minutes and it was 300000 milliseconds = 5 minutes before but now it set for only one due to below mentioned reason
setInterval(generateWeatherData, 86400000);  // One API call will be there bacause of the demostration purposes and limited credit in Cyclic 

/**
 * @swagger
 * /weather/district:
 *   get:
 *     summary: Get weather data for all districts
 *     responses:
 *       '200':
 *         description: A list of weather data for all districts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Weather'
 *       '404':
 *         description: Weather data not found for any district
 *       '500':
 *         description: Internal server error
 */


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


/**
 * @swagger
 * /weather/{district}:
 *   get:
 *     summary: Get weather data for a specific district
 *     parameters:
 *       - in: path
 *         name: district
 *         required: true
 *         description: Name of the district
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Weather data for the specified district
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Weather'
 *       '404':
 *         description: Weather data not found for the specified district
 *       '500':
 *         description: Internal server error
 */


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
    console.log(`Server running at http://localhost:${port}`); // the application is not running in this port anymore , because it is deployed in Cyclic
});


