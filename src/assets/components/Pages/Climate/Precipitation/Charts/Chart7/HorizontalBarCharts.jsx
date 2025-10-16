import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";

const HorizontalBarCharts = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [visibleBars, setVisibleBars] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // Fetch and process data
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true); // Set loading to true when starting fetch
      setError(null); // Reset error state

      try {
        const dataResult = await commonData(chartInfo.id, chartInfo.types[0], language);

        // Define the regions and their min/max monthly precipitation indices
        const regions = [
          {
            name: language === "ge" ? "საქართველო" : "Georgia",
            minIndex: 4, // GEO - MIN_MONTHLY
            maxIndex: 3  // GEO - MAX_MONTHLY
          },
          {
            name: language === "ge" ? "თბილისი" : "Tbilisi", 
            minIndex: 9, // TBILISI - MIN_MONTHLY
            maxIndex: 8  // TBILISI - MAX_MONTHLY
          },
          {
            name: language === "ge" ? "სამეგრელო-ზემო სვანეთი" : "Samegrelo-Zemo Svaneti",
            minIndex: 14, // SAMEGRELO - MIN_MONTHLY
            maxIndex: 13  // SAMEGRELO - MAX_MONTHLY
          },
          {
            name: language === "ge" ? "ქვემო ქართლი" : "Kvemo Kartli",
            minIndex: 19, // KVEMO_KARTLI - MIN_MONTHLY
            maxIndex: 18  // KVEMO_KARTLI - MAX_MONTHLY
          }
        ];

        const rawData = dataResult?.data?.data || [];

        // Get data for 2022
        const data2022 = rawData.find((item) => item.year === 2022);

        if (!data2022) {
          setChartData([]);
          return;
        }

        // Create data structure with regions on Y-axis and min/max as data series
        const processedData = regions.map((region) => {
          const regionData = {
            region: region.name,
          };
          
          const minValue = data2022[String(region.minIndex)];
          const maxValue = data2022[String(region.maxIndex)];
          
          // Add min and max monthly precipitation for 2022
          regionData[language === "ge" ? "მინიმალური (2022)" : "Minimum (2022)"] = minValue;
          regionData[language === "ge" ? "მაქსიმალური (2022)" : "Maximum (2022)"] = maxValue;
          
          return regionData;
        });

        setChartData(processedData);
        
        // Update visible bars to show both min and max by default
        const dataKeys = [
          language === "ge" ? "მინიმალური (2022)" : "Minimum (2022)",
          language === "ge" ? "მაქსიმალური (2022)" : "Maximum (2022)"
        ];
        
        const visibleBarsState = dataKeys.reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        
        setVisibleBars(visibleBarsState);

        // Update selectedTexts to represent min and max instead of regions
        const selectedTextsData = dataKeys.map(key => ({ name: key, id: key }));
        setSelectedTexts(selectedTextsData);
      } catch (error) {
        console.log("Error fetching data:", error);
        setError("Failed to load chart data. Please try again.");
      } finally {
        setIsLoading(false); // Set loading to false when done
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
              onClick={() => window.location.reload()}>
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
              onClick={() => window.location.reload()}>
              {language === "ge" ? "ხელახლა ჩატვირთვა" : "Reload Chart"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Custom Legend Component
  const CustomLegend = () => {
    const visibleBarCount = Object.values(visibleBars).filter(Boolean).length;

    return (
      <ul className="recharts-default-legend">
        {selectedTexts.map((text, index) => (
          <li
            key={`legend-item-${text.name}`}
            className={`recharts-legend-item legend-item-${index}`}
            onClick={() => {
              // Prevent toggling if this is the last visible bar
              if (visibleBars[text.name] && visibleBarCount === 1) {
                return;
              }
              setVisibleBars((prev) => ({
                ...prev,
                [text.name]: !prev[text.name],
              }));
            }}
            style={{
              cursor: "pointer",
              opacity: visibleBars[text.name] ? 1 : 0.5,
            }}>
            <span
              className="recharts-legend-item-icon"
              style={{
                backgroundColor:
                  chartInfo.colors[index % chartInfo.colors.length],
                flexShrink: 0,
                width: 12,
                height: 12,
                display: "inline-block",
                marginRight: 8,
              }}></span>
            <span className="recharts-legend-item-text">{text.name}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="custom-tooltip">
        <div className="tooltip-container">
          <p className="tooltip-label">
            {label}
          </p>
          {payload.map(({ value, fill, dataKey }) => {
            return (
              <p key={`item-${dataKey}`} className="text">
                <span
                  style={{
                    backgroundColor: fill,
                    flexShrink: 0,
                    width: 12,
                    height: 12,
                    display: "inline-block",
                    marginRight: 8,
                  }}
                  className="before-span"></span>
                {dataKey} :
                <span style={{ fontWeight: 900, marginLeft: "5px" }}>
                  {value?.toFixed(0)} {language === "ge" ? "მმ" : "mm"}
                </span>
              </p>
            );
          })}
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
            unit={chartInfo[`unit_${language}`]}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={460}>
        <BarChart 
          data={chartData}
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
          barCategoryGap="20%"
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis 
            type="category"
            dataKey="region" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ marginBottom: -20 }}
            content={<CustomLegend />}
            verticalAlign="bottom"
            align="center"
          />
          {selectedTexts.map((text, index) =>
            visibleBars[text.name] ? (
              <Bar
                key={`bar-${text.name}`}
                dataKey={text.name}
                fill={chartInfo.colors[index % chartInfo.colors.length]}
                stroke={chartInfo.colors[index % chartInfo.colors.length]}
                name={text.name}
                radius={[0, 2, 2, 0]}
              />
            ) : null
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HorizontalBarCharts;
