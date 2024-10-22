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
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [alertCities, setAlertCities] = useState([]);

  useEffect(() => {
    const getWeather = async () => {
      const data = await fetchWeatherSummary();
      setWeatherData(data);
      setFilteredData(data);
      setLoading(false);

      const highTempCities = data.filter((weather) => weather.temperature > 35);
      setAlertCities(highTempCities.map(city => city.city));

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

  const showAlertAgain = () => {
    const highTempCities = weatherData.filter((weather) => weather.temperature > 35);
    
    if (highTempCities.length > 0) {
      const alertMessages = highTempCities.map(city => `${city.city} is ${city.temperature}°C`).join(', ');
      setAlertMessage(`High temperature alert: ${alertMessages}`);
      setAlertDismissed(false);
      setAlertCities(highTempCities.map(city => city.city));
    } else {
      setAlertMessage(`No High temperature alerts`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600">Weather Dashboard</h1>
        <input
          type="text"
          placeholder="Search by city..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mt-4 p-3 bg-white text-gray-800 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 w-full max-w-md mx-auto"
        />
      </header>

      <div className="mb-6">
        <AlertNotification
          alertMessage={alertMessage}
          onDismiss={() => {
            setAlertMessage('');
            setAlertDismissed(true);
            setAlertCities([]);
          }}
        />
      </div>

      {alertDismissed && (
        <div className="text-center mb-4">
          <button
            onClick={showAlertAgain}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 transform hover:scale-105 focus:outline-none"
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
        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((weather, index) => (
              <div key={index} className="transition-transform transform hover:scale-105">
                <WeatherCard
                  weather={weather}
                  isAlertActive={alertCities.includes(weather.city)}
                />
              </div>
            ))}
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Temperature Trends</h2>
            <Charts data={{
              labels: weatherData.map(weather => weather.city),
              values: weatherData.map(weather => weather.temperature),
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
