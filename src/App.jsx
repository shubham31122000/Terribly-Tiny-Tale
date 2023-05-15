import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const App = () => {
  const [histogramData, setHistogramData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch('https://www.terriblytinytales.com/test.txt');
    const text = await response.text();
    const words = text.toLowerCase().match(/[a-z]+/g);
    const wordCounts = {};

    words.forEach((word) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const sortedWords = Object.keys(wordCounts).sort((a, b) => wordCounts[b] - wordCounts[a]);
    const top20Words = sortedWords.slice(0, 20);
    const histogramData = top20Words.map((word) => ({
      word,
      count: wordCounts[word],
    }));

    setHistogramData(histogramData);
    setLoading(false);
  };

  const handleExport = () => {
    const csvData = histogramData.map((data) => `${data.word},${data.count}`).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'histogram.csv';
    link.click();
  };

  const chartData = {
    labels: histogramData.map((data) => data.word),
    datasets: [
      {
        label: 'Word Count',
        data: histogramData.map((data) => data.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>
      {histogramData.length > 0 && (
        <div>
          <h2>Histogram</h2>
          <Bar data={chartData} options={{ maintainAspectRatio: true }} />
          <button onClick={handleExport}>Export</button>
        </div>
      )}
    </div>
  );
};

export default App;
