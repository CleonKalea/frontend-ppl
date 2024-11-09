import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import './App.css';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

function App() {
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  const fetchStockData = () => {
    setError(null);
    console.log(`Fetching stock data for: ${ticker}`);
    
    fetch(`${import.meta.env.VITE_API_URL}/stock/${ticker}`)
      .then((response) => {
        console.log('Response received:', response);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Data received:', data);
        setStockData(data);
      })
      .catch((err) => {
        console.error('Error fetching stock data:', err);
        setError(err.message);
      });
  };

  // Prepare data for chart
  const chartData = {
    labels: stockData ? Object.keys(stockData.Close) : [],
    datasets: [
      {
        label: 'Close Price',
        data: stockData ? Object.values(stockData.Close) : [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="StockData">
      <h1>Stock Information PPL</h1>
      <input
        type="text"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="Enter stock ticker (TSLA, AAPL)"
      />
      <button onClick={fetchStockData}>Get Stock Data</button>  

      {stockData && (
        <div>
          <h2>Data for {ticker.toUpperCase()}</h2>
          <Line data={chartData} style={{ height: '500px', width: '100%' }}/>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
