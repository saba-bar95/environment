import { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  PolarAngleAxis,
} from "recharts";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";

const RadialBarChartComponent = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch data and metadata concurrently
        const [dataResult] = await Promise.all([
          commonData(chartInfo.id, chartInfo.types[0], language),
          commonData(chartInfo.id, chartInfo.types[1], language),
        ]);

        const rawData = dataResult?.data?.data || [];
        
        // Custom mapping for atmospheric-precipitation data indices to region names
        // Variable: ნალექის წლიური გადახრა ნალექის ისტორიული საშუალო რაოდენობიდან (%)
        // Based on API data for 2022:
        // Index 2: საქართველო = 0.93
        // Index 7: თბილისი = 0.94
        // Index 12: სამეგრელო-ზემო სვანეთი = 0.93
        // Index 17: ქვემო ქართლი = 0.92
        const regionMapping = {
          2: language === "ge" ? "საქართველო" : "Georgia",
          7: language === "ge" ? "თბილისი" : "Tbilisi",
          12: language === "ge" ? "სამეგრელო-ზემო სვანეთი" : "Samegrelo-Zemo Svaneti",
          17: language === "ge" ? "ქვემო ქართლი" : "Kvemo Kartli",
        };

        // Get 2022 year data specifically
        const data2022 = rawData.find(item => item.year === 2022);
        
        if (!data2022) {
          throw new Error("No data available for 2022");
        }

        // Process data for radial bar chart
        const processedData = chartInfo.selectedIndices.map((index, i) => {
          const value = parseFloat(data2022[String(index)]) || 0;
          // Convert to percentage (0.93 -> 93)
          const percentValue = value * 100;
          
          return {
            name: regionMapping[index],
            value: percentValue,
            fill: chartInfo.colors[i % chartInfo.colors.length],
          };
        });

        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load chart data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [language, chartInfo]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="chart-wrapper" id={chartInfo.chartID}>
        <div className="header">
          <div className="right">
            <div className="ll"></div>
            <div className="rr">
              <h1>
                {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
              </h1>
              <p>{language === "ge" ? chartInfo.unit_ge : chartInfo.unit_en}</p>
            </div>
          </div>
          <div className="left">
            <div className="download-placeholder">
              <span className="loading-spinner"></span>
              <span>{language === "ge" ? "ჩატვირთვა..." : "Loading..."}</span>
            </div>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-content">
            <div className="spinner"></div>
            <p>
              {language === "ge"
                ? "მონაცემების ჩატვირთვა..."
                : "Loading data..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="chart-wrapper" id={chartInfo.chartID}>
        <div className="header">
          <div className="right">
            <div className="ll"></div>
            <div className="rr">
              <h1>
                {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
              </h1>
              <p>{language === "ge" ? chartInfo.unit_ge : chartInfo.unit_en}</p>
            </div>
          </div>
          <div className="left">
            <button
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              {language === "ge" ? "ხელახლა ცდა" : "Retry"}
            </button>
          </div>
        </div>
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              {language === "ge" ? "ხელახლა ჩატვირთვა" : "Reload Chart"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Custom Legend Component
  const CustomLegend = ({ payload }) => {
    return (
      <ul className="recharts-default-legend" style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
        {payload.map((entry, index) => (
          <li
            key={`legend-item-${index}`}
            className="recharts-legend-item"
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <span
              className="recharts-legend-item-icon"
              style={{
                backgroundColor: entry.color,
                width: 12,
                height: 12,
                display: "inline-block",
                borderRadius: '50%',
              }}
            ></span>
            <span className="recharts-legend-item-text">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0];

    return (
      <div className="custom-tooltip">
        <div className="tooltip-container">
          <p className="tooltip-label">{data.payload.name}</p>
          <p
            className="text"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <span>
              <span
                style={{
                  backgroundColor: data.fill,
                  width: 12,
                  height: 12,
                  display: "inline-block",
                  marginRight: 8,
                  borderRadius: '50%',
                }}
                className="before-span"
              ></span>
              {language === "ge" ? "2022 წლის გადახრა" : "2022 Deviation"} :
            </span>
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {data.value?.toFixed(0)}%
            </span>
          </p>
        </div>
      </div>
    );
  };

  // Show empty state if no data
  if (chartData.length === 0) {
    return (
      <div className="chart-wrapper" id={chartInfo.chartID}>
        <div className="header">
          <div className="right">
            <div className="ll"></div>
            <div className="rr">
              <h1>
                {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
              </h1>
              <p>{language === "ge" ? chartInfo.unit_ge : chartInfo.unit_en}</p>
            </div>
          </div>
          <div className="left">
            <div className="download-placeholder">
              {language === "ge"
                ? "მონაცემები არ მოიძებნა"
                : "No data to download"}
            </div>
          </div>
        </div>
        <div className="empty-state">
          <p>
            {language === "ge" ? "მონაცემები არ მოიძებნა" : "No data available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper" id={chartInfo.chartID}>
      <div className="header">
        <div className="right">
          <div className="ll"></div>
          <div className="rr">
            <h1>
              {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
            </h1>
            <p>{language === "ge" ? chartInfo.unit_ge : chartInfo.unit_en}</p>
          </div>
        </div>
        <div className="left">
          <Download
            data={chartData}
            filename={chartInfo[`title_${language}`]}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={500}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          barSize={30}
          data={chartData}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            minAngle={15}
            label={{ 
              position: 'insideStart', 
              fill: '#fff',
              fontSize: 14,
              fontWeight: 'bold',
            }}
            background
            clockWise
            dataKey="value"
          />
          <Legend
            iconSize={10}
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            content={<CustomLegend />}
          />
          <Tooltip content={<CustomTooltip />} />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="radial-chart-center-text"
            style={{ fontSize: '16px', fontWeight: 'bold' }}
          >
            {language === "ge" ? "საშ. გადახრა" : "Avg. Deviation"}
          </text>
          <text
            x="50%"
            y="54%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="radial-chart-center-value"
            style={{ fontSize: '24px', fontWeight: 'bold' }}
          >
            {chartData.length > 0 
              ? `${(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length).toFixed(0)}.0%`
              : '0%'
            }
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadialBarChartComponent;
