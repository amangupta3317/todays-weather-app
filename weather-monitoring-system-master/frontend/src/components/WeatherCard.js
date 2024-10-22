import React, { useState } from 'react';

// Function to get the weather icon URL based on condition
const getWeatherIcon = (condition) => {
  switch (condition) {
    case 'Clear':
      return 'https://openweathermap.org/img/wn/01d.png';
    case 'Clouds':
      return 'https://openweathermap.org/img/wn/02d.png';
    case 'Rain':
      return 'https://openweathermap.org/img/wn/10d.png';
    case 'Snow':
      return 'https://openweathermap.org/img/wn/13d.png';
    case 'Thunderstorm':
      return 'https://openweathermap.org/img/wn/11d.png';
    default:
      return 'https://openweathermap.org/img/wn/50d.png'; // Default icon for unclear weather
  }
};

const WeatherCard = ({ weather, isAlertActive }) => {
  const [isCelsius, setIsCelsius] = useState(true); // State to toggle between Celsius and Fahrenheit

  // Function to toggle the temperature unit
  const toggleTemperature = () => {
    setIsCelsius(!isCelsius);
  };

  // Function to convert Celsius to Fahrenheit
  const toFahrenheit = (celsius) => (celsius * 9 / 5) + 32;

  return (
    <div 
      className={`rounded-lg shadow-lg transition-transform transform hover:scale-105 p-4 ${isAlertActive ? 'bg-yellow-300 text-black' : 'bg-gray-300 text-gray-800'} flex flex-col justify-between`}
    >
      <h3 className="text-xl font-semibold mb-2 text-center">{weather.city}</h3>
      <img 
        src={getWeatherIcon(weather.condition)} 
        alt={weather.condition} 
        className="w-16 h-16 mb-2 mx-auto" 
      />
      <div className="flex flex-col items-center">
        <p className={`text-lg mb-1 ${isAlertActive ? 'text-black' : 'text-teal-600'}`}>
          Temperature: {isCelsius ? `${weather.temperature}°C` : `${toFahrenheit(weather.temperature).toFixed(1)}°F`}
        </p>
        <p className={`text-lg mb-1 ${isAlertActive ? 'text-black' : 'text-green-600'}`}>
          Feels Like: {isCelsius ? `${weather.feels_like}°C` : `${toFahrenheit(weather.feels_like).toFixed(1)}°F`}
        </p>
        <p className={`text-lg mb-3 ${isAlertActive ? 'text-black' : 'text-gray-700'}`}>
          Condition: {weather.condition}
        </p>
      </div>
      {weather.alerts && weather.alerts.length > 0 && (
        <div className="mt-2 bg-yellow-400 text-black p-2 rounded text-center">
          <strong>Alerts:</strong> {weather.alerts.join(', ')}
        </div>
      )}
      <button 
        onClick={toggleTemperature} 
        className="mt-4 w-full py-2 bg-teal-600 hover:bg-teal-700 transition-colors text-white font-semibold rounded-lg"
      >
        Toggle to {isCelsius ? 'Fahrenheit' : 'Celsius'}
      </button>
    </div>
  );
};

export default WeatherCard;
