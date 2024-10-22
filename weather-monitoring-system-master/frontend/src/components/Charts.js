import React, { useState } from 'react';
import { Bar, Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register scales and elements
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadarController, RadialLinearScale, Title, Tooltip, Legend);
const Charts = ({ data }) => {
  const [chartType, setChartType] = useState('bar'); // State to toggle between chart types

  // Ensure that the data object and its properties exist
  const labels = data?.labels || [];
  const values = data?.values || [];
  const minTemps = data?.minTemps?.length ? data.minTemps : Array(labels.length).fill(5); // Default to 5 if no data
  const maxTemps = data?.maxTemps?.length ? data.maxTemps : Array(labels.length).fill(54); // Default to 54 if no data

  // Prepare chart data for Bar and Line charts
  const chartData = {
    labels: labels.length ? labels : ['No Data'], // Default label if none provided
    datasets: [
      {
        label: 'Average (°C)',
        data: values.length ? values : [0], // Default value if no data
        backgroundColor: chartType === 'bar' || chartType === 'line'
          ? 'rgba(72, 211, 176, 0.7)' // Soft teal for bar/line chart
          : 'rgba(72, 211, 176, 0.7)', // Same color for radar chart
        borderColor: 'rgba(72, 211, 176, 1)',
        borderWidth: 2,
        fill: true, // For line and radar chart
      },
      {
        label: 'Min (°C)',
        data: minTemps,
        backgroundColor: chartType === 'bar' || chartType === 'line'
          ? 'rgba(255, 99, 132, 0.7)' // Pink for bar/line chart
          : 'rgba(255, 99, 132, 0.7)', // Same color for radar chart
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: true, // For line and radar chart
      },
      {
        label: 'Max (°C)',
        data: maxTemps,
        backgroundColor: chartType === 'bar' || chartType === 'line'
          ? 'rgba(54, 162, 235, 0.7)' // Blue for bar/line chart
          : 'rgba(54, 162, 235, 0.7)', // Same color for radar chart
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: true, // For line and radar chart
      },
    ],
  };

  // Prepare chart data for Radar chart (group multiple cities along temperature metrics)
  const radarChartData = {
    labels: ['Average Temperature', 'Min Temperature', 'Max Temperature'],
    datasets: labels.map((city, index) => ({
      label: city,
      data: [values[index], minTemps[index], maxTemps[index]],
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`, // Random color for each city
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
      borderWidth: 2,
      fill: true,
    })),
  };

  // Chart options with white axis lines and a dark theme
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.9)', // Light text for legend
        },
      },
      title: {
        display: true,
        text: 'Temperature Trends',
        color: 'rgba(255, 255, 255, 0.9)', // Light title text
        font: {
          size: 20,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for tooltips
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // White x-axis grid lines (30% opacity)
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)', // Light tick color
        },
        title: {
          display: true,
          text: 'Cities',
          color: 'rgba(255, 255, 255, 0.9)', // Light label text
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // White y-axis grid lines (30% opacity)
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)', // Light tick color
        },
        title: {
          display: true,
          text: 'Temperature (°C)',
          color: 'rgba(255, 255, 255, 0.9)', // Light label text
        },
        beginAtZero: true,
      },
    },
  };

  // Radar chart options (different scales structure)
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.9)', // Light text for legend
        },
      },
      title: {
        display: true,
        text: 'City Weather Comparison',
        color: 'rgba(255, 255, 255, 0.9)', // Light title text
        font: {
          size: 20,
          weight: 'bold',
        },
      },
    },
    scales: {
      r: {
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // White radar chart grid lines (30% opacity)
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)', // Light point label color
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)', // Light tick color
          beginAtZero: true,
        },
      },
    },
  };

  // Switch between different chart components based on the selected chartType
  const renderChart = () => {
    if (chartType === 'bar') {
      return <Bar data={chartData} options={options} />;
    } else if (chartType === 'line') {
      return <Line data={chartData} options={options} />;
    } else if (chartType === 'radar') {
      return <Radar data={radarChartData} options={radarOptions} />;
    }
    return null;
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setChartType(chartType === 'bar' ? 'line' : chartType === 'line' ? 'radar' : 'bar')} // Toggle between bar, line, and radar charts
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Toggle to {chartType === 'bar' ? 'Line' : chartType === 'line' ? 'Radar' : 'Bar'} Chart
        </button>
      </div>
      <div style={{ position: 'relative', height: '40vh', width: '100%' }}>
        {renderChart()}
      </div>
    </div>
  );
};

export default Charts;
