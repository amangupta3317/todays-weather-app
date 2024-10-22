
import React, { useEffect, useState } from 'react';
import { fetchWeatherSummary } from '../services/weatherService';
import WeatherCard from './WeatherCard';
import Charts from './Charts';
import Spinner from './Spinner';
import AlertNotification from './AlertNotification';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertDismissed, setAlertDismissed] = useState(false); // Track alert dismissal
  const [alertCities, setAlertCities] = useState([]); // Track cities with alerts

  useEffect(() => {
    const getWeather = async () => {
      const data = await fetchWeatherSummary();
      setWeatherData(data);
      setFilteredData(data);
      setLoading(false);

      // Identify cities with high temperatures
      const highTempCities = data.filter((weather) => weather.temperature > 35);
      setAlertCities(highTempCities.map(city => city.city)); // Set alert cities

      // Default alert message
      if (highTempCities.length === 0) {
        setAlertMessage(`No High temperature alerts`);
      }
    };

    getWeather();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = weatherData.filter((weather) =>
      weather.city.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  };

  // Function to show alert messages for all cities
  const showAlertAgain = () => {
    const highTempCities = weatherData.filter((weather) => weather.temperature > 35);
    
    if (highTempCities.length > 0) {
      const alertMessages = highTempCities.map(city => `${city.city} is ${city.temperature}°C`).join(', ');
      setAlertMessage(`High temperature alert: ${alertMessages}`);
      setAlertDismissed(false); // Reset alert dismissed state
      setAlertCities(highTempCities.map(city => city.city)); // Reset alert cities
    }
    else{
      setAlertMessage(`No High temperature alerts`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-teal-400">Today's Weather</h1>
        <input
          type="text"
          placeholder="Search by city..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mt-6 p-3 bg-gray-700 text-white border border-gray-500 rounded-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mx-auto focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </header>

      <div className="mb-6">
        <AlertNotification
          alertMessage={alertMessage}
          onDismiss={() => {
            setAlertMessage('');
            setAlertDismissed(true); // Set alert as dismissed
            setAlertCities([]); // Clear alert cities when dismissed
          }}
        />
      </div>

      {/* Show the button outside the card grid */}
      {alertDismissed && (
        <div className="text-center mb-4">
          <button
            onClick={showAlertAgain}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors transform hover:scale-105 focus:outline-none"
          >
            Show Alerts Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center mt-20">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredData.map((weather, index) => (
            <div key={index} className="transition-transform transform hover:scale-105">
              <WeatherCard
                weather={weather}
                isAlertActive={alertCities.includes(weather.city)} // Check if the city is in alertCities
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-teal-400">Temperature Trends</h2>
        <Charts data={{
          labels: weatherData.map(weather => weather.city),
          values: weatherData.map(weather => weather.temperature),
        }} />
      </div>
    </div>
  );
};

export default WeatherDashboard;
