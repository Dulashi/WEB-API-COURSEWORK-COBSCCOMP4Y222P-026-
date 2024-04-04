import React, { useState, useEffect } from 'react';
import './Weather_app.css';

const WeatherComponent = () => {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await fetch('http://localhost:3000/weather/district');
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data. Status: ' + response.status);
                }
                const responseData = await response.json(); 
                console.log('Weather data received from backend:', responseData); 
                setWeatherData(responseData); 
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchWeatherData();
    }, []);

    console.log('Weather data in state:', weatherData); 

    const handleDistrictClick = async (district) => {
        try {
            const response = await fetch(`http://localhost:3000/weather/${district}`);
            if (!response.ok) {
                throw new Error('Failed to fetch weather data for district: ' + district);
            }
            const responseData = await response.json();
            console.log('Weather data for district', district, ':', responseData);
            alert(`Weather data for ${district}: Temperature - ${responseData.temperature}, Humidity - ${responseData.humidity}, Air Pressure - ${responseData.airPressure}`);
        } catch (error) {
            console.error('Error fetching weather data for district:', district, ':', error);
        }
    };

    // Manually setting positions for each district though the districts names are taken from the backend
    const districtPositions = {
        "Ampara": { x: 1034, y: 750 },
        "Anuradhapura": { x: 800, y: 500 },
        "Badulla": { x: 550, y: 720},
        "Batticaloa": { x: 200, y: 200 },
        "Colombo": { x: 350, y: 770 },
        "Galle": { x: 400, y: 879 },
        "Gampaha": { x: 360, y: 720 },
        "Hambantota": { x: 600, y: 865},
        "Jaffna": { x: 200, y: 200 },
        "Kaluthara": { x: 390, y: 815 },
        "Kandy": { x: 500, y: 680 },
        "Kegalle": { x: 425, y: 700 },
        "Kilinochchi": { x: 200, y: 200 },
        "Kurunegala": { x: 200, y: 200 },
        "Mannar": { x: 200, y: 200 },
        "Matale": { x: 200, y: 200 },
        "Matara": { x: 459, y: 900 },
        "Monaragala": { x: 620, y: 790},
        "Mulllaitivu": { x: 200, y: 200 },
        "Nuwara Eliya": { x: 496, y: 750 },
        "Polonnaruwa": { x: 200, y: 200 },
        "Puttalam": { x: 200, y: 200 },
        "Ratnapura": { x: 460, y: 800 },
        "Trincomalee": { x: 200, y: 200 },
        "Vavuniya": { x: 200, y: 200 },   
    };

    return (
        <div className="weather-container">
            <h2>Weather Information</h2>
            {weatherData && (
                <div className="map-container">
                    <img className="weather-image" src="/srilankanmap.jpg" alt="Sri Lankan Map" />
                    {weatherData.map((data, index) => (
                        data.administrative_district && (
                            <div
                                key={data._id}
                                className="district-marker"
                                data-district={data.administrative_district}
                                style={{ left: districtPositions[data.administrative_district]?.x || 0, top: districtPositions[data.administrative_district]?.y || 0 }}
                                onClick={() => handleDistrictClick(data.administrative_district)}
                            >
                                {data.administrative_district}
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default WeatherComponent;
