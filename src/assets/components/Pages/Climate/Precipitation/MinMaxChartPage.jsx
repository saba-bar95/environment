import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/data';

// --- DATA TRANSFORMATION FUNCTION ---
// This function prepares the data to show a range between min and max.
function transformDataForMinMaxChart(apiData) {
  const chartData = apiData.data.data.map(item => {
    const minPrecipitation = item["GEO - MIN_MONTHLY"] || 0;
    const maxPrecipitation = item["GEO - MAX_MONTHLY"] || 0;

    return {
      year: item.year.toString(),
      // Recharts can accept an array for a dataKey to draw a range
      min_max_range: [minPrecipitation, maxPrecipitation],
    };
  });

  // Filter for the years shown in the screenshot
  return chartData.filter(d => parseInt(d.year, 10) >= 1990);
}


// --- THE RANGE AREA CHART COMPONENT ---
const MinMaxPrecipitationChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data to display.</div>;
  }

  // Custom tooltip to show Min and Max values clearly
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
          <p style={{ margin: 0 }}>{`Year: ${label}`}</p>
          <p style={{ margin: '5px 0 0 0', color: '#8884d8' }}>
            {`Min: ${payload[0].value[0]} mm`}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#8884d8' }}>
            {`Max: ${payload[0].value[1]} mm`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis unit=" mm" domain={[0, 'dataMax + 20']} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="min_max_range"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};


// --- MAIN PAGE COMPONENT ---
const MinMaxChartPage = () => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataResponse = await fetch(DATA_URL);
        if (!dataResponse.ok) throw new Error('API data fetch failed');
        const apiData = await dataResponse.json();

        const transformedData = transformDataForMinMaxChart(apiData);
        setChartData(transformedData);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.5rem' }}>
        3. თვიური ნალექების დიაპაზონი
      </h1>
      <h2 style={{ fontSize: '1rem', textAlign: 'center', fontWeight: 'normal', color: '#555', marginBottom: '30px' }}>
        მინ. და მაქს. თვიური ნალექი (მმ)
      </h2>

      {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
      {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

      {chartData && (
        <MinMaxPrecipitationChart data={chartData} />
      )}
    </div>
  );
};

export default MinMaxChartPage;
