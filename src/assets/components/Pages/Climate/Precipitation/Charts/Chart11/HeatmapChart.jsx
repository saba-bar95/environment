import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";

const HeatmapChart = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define region mapping outside useEffect for reuse
  const regionMapping = useMemo(() => [
    { key: language === "ge" ? "საქართველო" : "Georgia", name: language === "ge" ? "საქართველო" : "Georgia", index: 1 },
    { key: language === "ge" ? "თბილისი" : "Tbilisi", name: language === "ge" ? "თბილისი" : "Tbilisi", index: 6 },
    { key: language === "ge" ? "სამეგრელო-ზემო სვანეთი" : "Samegrelo-Zemo Svaneti", name: language === "ge" ? "სამეგრელო-ზემო სვანეთი" : "Samegrelo-Zemo Svaneti", index: 11 },
    { key: language === "ge" ? "ქვემო ქართლი" : "Kvemo Kartli", name: language === "ge" ? "ქვემო ქართლი" : "Kvemo Kartli", index: 16 },
  ], [language]);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch data
        const [dataResult] = await Promise.all([
          commonData(chartInfo.id, chartInfo.types[0], language),
          commonData(chartInfo.id, chartInfo.types[1], language),
        ]);

        const rawData = dataResult?.data?.data || [];

        // Group data by decades
        const decades = {
          "1990-იანები": { decade: language === "ge" ? "1990-იანები" : "1990s", years: [] },
          "2000-იანები": { decade: language === "ge" ? "2000-იანები" : "2000s", years: [] },
          "2010-იანები": { decade: language === "ge" ? "2010-იანები" : "2010s", years: [] },
          "2020-იანები": { decade: language === "ge" ? "2020-იანები" : "2020s", years: [] },
        };

        // Group years by decade
        rawData.forEach(item => {
          const year = item.year;
          if (year >= 1990 && year < 2000) decades["1990-იანები"].years.push(item);
          else if (year >= 2000 && year < 2010) decades["2000-იანები"].years.push(item);
          else if (year >= 2010 && year < 2020) decades["2010-იანები"].years.push(item);
          else if (year >= 2020 && year < 2030) decades["2020-იანები"].years.push(item);
        });

        // Calculate average for each decade and region
        const heatmapData = Object.values(decades).map(decadeInfo => {
          const decadeRow = { decade: decadeInfo.decade };
          
          // Use regionMapping (from component scope) for keys
          regionMapping.forEach(region => {
            // Calculate average precipitation for this region in this decade
            const values = decadeInfo.years
              .map(item => parseFloat(item[String(region.index)]) || 0)
              .filter(val => val > 0);
            
            const average = values.length > 0 
              ? Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)
              : 0;
            
            decadeRow[region.key] = average;
          });
          
          return decadeRow;
        });

        setChartData(heatmapData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load chart data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [language, chartInfo, regionMapping]);

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

  // Helper function to get color based on value (Annual precipitation in mm)
  const getColor = (value) => {
    // Define color scale based on precipitation levels
    // Dry: <950mm, Average: 950-1100mm, Wet: >1100mm
    if (value >= 1100) return "#2d6a4f"; // Dark green - Wet
    if (value >= 950) return "#95d5b2"; // Light green - Average
    return "#f4a261"; // Orange - Dry
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
      <div style={{ width: "100%", overflowX: "auto", padding: "20px" }}>
        <div style={{ minWidth: "600px", maxWidth: "1000px", margin: "0 auto" }}>
          {/* Heatmap Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "12px", background: "#f5f5f5", fontWeight: "bold", fontSize: "14px" }}>
                  {language === "ge" ? "დეკადა" : "Decade"}
                </th>
                {regionMapping.map((region) => (
                  <th 
                    key={region.name} 
                    style={{ 
                      border: "1px solid #ddd", 
                      padding: "12px", 
                      background: "#f5f5f5", 
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "14px"
                    }}
                  >
                    {region.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.map((decadeRow) => (
                <tr key={decadeRow.decade}>
                  <td style={{ border: "1px solid #ddd", padding: "12px", fontWeight: "bold", background: "#fafafa", fontSize: "14px" }}>
                    {decadeRow.decade}
                  </td>
                  {regionMapping.map((region) => {
                    const value = decadeRow[region.key];
                    return (
                      <td
                        key={region.key}
                        style={{
                          border: "1px solid #ddd",
                          padding: "16px",
                          textAlign: "center",
                          background: getColor(value),
                          color: value >= 1100 ? "#fff" : "#000",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          fontSize: "15px"
                        }}
                        title={`${region.name} (${decadeRow.decade}): ${value}${language === "ge" ? " მმ" : " mm"}`}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Legend */}
          <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "30px", height: "20px", background: "#f4a261", border: "1px solid #ddd" }}></div>
              <span style={{ fontSize: "14px", color: "#000" }}>{language === "ge" ? "მშრალი (<950 მმ)" : "Dry (<950 mm)"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "30px", height: "20px", background: "#95d5b2", border: "1px solid #ddd" }}></div>
              <span style={{ fontSize: "14px", color: "#000" }}>{language === "ge" ? "საშუალო (950-1100 მმ)" : "Average (950-1100 mm)"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "30px", height: "20px", background: "#2d6a4f", border: "1px solid #ddd" }}></div>
              <span style={{ fontSize: "14px", color: "#000" }}>{language === "ge" ? "ნოტიო (>1100 მმ)" : "Wet (>1100 mm)"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapChart;
