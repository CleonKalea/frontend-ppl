import { useState, useEffect } from 'react';
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

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

function App() {
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);
  const [stockList, setStockList] = useState([]);
  useEffect(() => {
    fetchStockList();
  }, []);

  const fetchStockList = () => {
    setError(null);
    console.log(`Fetching stock name...`);
    
    fetch(`${import.meta.env.VITE_API_URL}/stocklist`)
      .then((response) => {
        console.log('Response received:', response);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Data received:', data);
        setStockList(data);
      })
      .catch((err) => {
        console.error('Error fetching stock data:', err);
        setError(err.message);
      });
  };

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
      <select
        value={ticker}
        onChange={(e) => setTicker(e.target.value)} 
        placeholder="Select stock ticker"
      >
        <option value="">Select a stock</option>
        {stockList.map((stock) => (
          <option key={stock.id_saham} value={stock.kode_saham}>
            {stock.nama_perusahaan} ({stock.kode_saham})
          </option>))}
      </select>
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
