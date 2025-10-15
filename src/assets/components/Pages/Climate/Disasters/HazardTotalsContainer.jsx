import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// --- CONFIGURATION ---
const START_YEAR = 2016;
const END_YEAR = 2023;

// --- DATA TRANSFORMATION FUNCTION ---
function transformDataForTotalsChart(apiData, apiMetadata) {
  const yearMeta = apiMetadata.data.metadata.variables.find(
    (v) => v.code === "Year"
  );
  const hazardMeta = apiMetadata.data.metadata.variables.find(
    (v) => v.code === "Hydrometeorological hazard"
  );
  const yearMap = Object.fromEntries(
    yearMeta.values.map((val, i) => [val, parseInt(yearMeta.valueTexts[i], 10)])
  );

  // 1. Filter data to the specified year range
  const filteredYearsData = apiData.data.data.filter((d) => {
    const year = yearMap[d.year];
    return year >= START_YEAR && year <= END_YEAR;
  });

  // 2. Initialize an object to hold the totals for each hazard
  const totals = {};
  hazardMeta.valueTexts.forEach((hazardName, index) => {
    totals[index] = {
      name: hazardName,
      totalEvents: 0,
      totalCasualties: 0,
    };
  });

  // 3. Loop through the filtered data to calculate sums
  filteredYearsData.forEach((yearData) => {
    // Loop through each hazard type by its index (0-5)
    for (
      let hazardIndex = 0;
      hazardIndex < hazardMeta.values.length;
      hazardIndex++
    ) {
      // Sum events (months 0-11)
      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        const eventKey = `${hazardIndex} - ${monthIndex}`;
        if (typeof yearData[eventKey] === "number") {
          totals[hazardIndex].totalEvents += yearData[eventKey];
        }
      }
      // Sum casualties (month 12)
      const casualtyKey = `${hazardIndex} - 12`;
      if (typeof yearData[casualtyKey] === "number") {
        totals[hazardIndex].totalCasualties += yearData[casualtyKey];
      }
    }
  });

  // 4. Convert the totals object into an array for the chart
  return Object.values(totals);
}

// --- THE GROUPED BAR CHART COMPONENT ---
const HazardTotalsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available to render chart.</div>;
  }

  // Find the maximum value for a dynamic Y-axis
  const maxValue = Math.max(...data.map((item) => item.totalEvents));
  const yAxisDomainMax = Math.ceil(maxValue / 50) * 50; // Round up to nearest 50

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis
          type="number"
          domain={[0, yAxisDomainMax]}
          // Set specific ticks to match the design
          ticks={[1, 51, 101, 151, 201, 251, 301]}
        />
        <Tooltip />
        <Legend
          payload={[
            { value: "სულ შემთხვევა", type: "square", color: "#3b82f6" },
            { value: "სულ გარდაცვლილი", type: "square", color: "#ef4444" },
          ]}
        />
        <Bar dataKey="totalEvents" name="სულ შემთხვევა" fill="#3b82f6" />
        <Bar dataKey="totalCasualties" name="სულ გარდაცვლილი" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// --- MAIN CONTAINER COMPONENT (fetches data) ---
const HazardTotalsContainer = () => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const DATA_URL =
    "http://192.168.1.27:3000/api/datasets/hydro-meteorological-hazards/data";
  const METADATA_URL =
    "http://192.168.1.27:3000/api/datasets/hydro-meteorological-hazards/metadata";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataResponse, metadataResponse] = await Promise.all([
          fetch(DATA_URL),
          fetch(METADATA_URL),
        ]);
        if (!dataResponse.ok || !metadataResponse.ok) {
          throw new Error("API data fetch failed");
        }
        const apiData = await dataResponse.json();
        const apiMetadata = await metadataResponse.json();

        const transformedData = transformDataForTotalsChart(
          apiData,
          apiMetadata
        );
        setChartData(transformedData);
      } catch (e) {
        setError(e.message);
        console.error("Failed to process data:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Loading chart data... ⏳
      </div>
    );
  if (error)
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "red" }}>
        Error: {error} 😟
      </div>
    );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h3 style={{ textAlign: "center" }}>
        სტიქიური მოვლენების პროფილი: ჯამური შემთხვევები და სიკვდილიანობა
        (2016-2023)
      </h3>
      <HazardTotalsChart data={chartData} />
    </div>
  );
};

export default HazardTotalsContainer;
