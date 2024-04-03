import React, { useState, useEffect } from 'react';

const WeatherComponent = () => {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
    const fetchWeatherData = async () => {
        try {
            const response = await fetch('http://localhost:3000/weather');
            if (!response.ok) {
                throw new Error('Failed to fetch weather data. Status: ' + response.status);
            }
            const responseData = await response.text();
            console.log('Response from backend:', responseData);
            const data = JSON.parse(responseData);
            console.log('Weather data received from backend:', data);
            setWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    fetchWeatherData();
}, []);

  

    console.log('Weather data in state:', weatherData);

    return (
        <div>
            <h2>Weather Information</h2>
            {weatherData && (
                <div>
                    {weatherData.map((data, index) => (
                        <div key={data._id}>
                            <p>Administrative District: {data.administrative_district}</p>
                            <p>Temperature: {data.temperature}</p>
                            <p>Humidity: {data.humidity}</p>
                            <p>Air Pressure: {data.airPressure}</p>
                            <p>Timestamp: {new Date(data.timestamp).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const App = () => {
    return (
        <div>
            <WeatherComponent />
        </div>
    );
};

export default App;
