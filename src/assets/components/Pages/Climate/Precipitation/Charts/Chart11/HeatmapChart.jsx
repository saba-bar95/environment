import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";
import Svg from "./Svg";
import "./HeatmapChart.scss";

/** Determines cell color based on precipitation value. */
function getBucketColor(v) {
  if (!v || v === 0) return "#ffffff"; // No data - white
  if (v < 950) return "#fecaca"; // Dry (მშრალი) - light red
  if (v <= 1100) return "#93c5fd"; // Average (საშუალო) - light blue
  return "#2563eb"; // Wet (ნოტიო) - blue
}

const PrecipitationHeatmapChart = ({ chartInfo, columnWidth = 140 }) => {
  const { language } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawMeta, setRawMeta] = useState(null);
  const [rawData, setRawData] = useState(null);

  // Fetch and process data
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [dataResult, metaDataResult] = await Promise.all([
          commonData(chartInfo.id, chartInfo.types[0], language),
          commonData(chartInfo.id, chartInfo.types[1], language),
        ]);

        setRawMeta(metaDataResult);
        setRawData(dataResult);
      } catch (error) {
        console.log("Error fetching data:", error);
        setError("Failed to load chart data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [language, chartInfo]);

  // Process data
  const { decades, years, matrix } = useMemo(() => {
    if (!rawMeta || !rawData) return { decades: [], years: [], matrix: [] };

    // Use the precipitation variable index from chartInfo.selectedIndices
    const precipitationIndex = chartInfo.selectedIndices?.[0];

    if (precipitationIndex === undefined) {
      console.log("No selectedIndices found in chartInfo");
      return { decades: [], years: [], matrix: [] };
    }

    const records = rawData?.data?.data || [];
    
    console.log("=== Heatmap Debug Info ===");
    console.log("Total records:", records.length);
    console.log("Sample record:", records[0]);
    console.log("Precipitation index:", precipitationIndex);

    // Group years into decades
    const decadeGroups = {
      "1990-იანები": [],
      "2000-იანები": [],
      "2010-იანები": [],
      "2020-იანები": []
    };

    // Process each record and group by decade
    records.forEach((record) => {
      
      // Get the actual year value from the record
      const yearValue = parseInt(record?.year);
      if (!yearValue || isNaN(yearValue)) return;
      
      // Get precipitation value
      const precipValue = Number(record?.[precipitationIndex] ?? 0);
      if (!Number.isFinite(precipValue) || precipValue <= 0) return;
      
      // Group by decade
      if (yearValue >= 1990 && yearValue < 2000) {
        decadeGroups["1990-იანები"].push({ year: yearValue, value: precipValue });
      } else if (yearValue >= 2000 && yearValue < 2010) {
        decadeGroups["2000-იანები"].push({ year: yearValue, value: precipValue });
      } else if (yearValue >= 2010 && yearValue < 2020) {
        decadeGroups["2010-იანები"].push({ year: yearValue, value: precipValue });
      } else if (yearValue >= 2020 && yearValue < 2030) {
        decadeGroups["2020-იანები"].push({ year: yearValue, value: precipValue });
      }
    });

    // Find max years in any decade to create uniform grid
    const maxYearsPerDecade = Math.max(
      ...Object.values(decadeGroups).map(g => g.length),
      10 // At least 10 columns
    );

    // Create matrix: rows = decades, columns = years (0-9 in each decade)
    const decades = Object.keys(decadeGroups);
    const mat = decades.map((decadeLabel) => {
      const decadeYears = decadeGroups[decadeLabel];
      // Sort by year
      decadeYears.sort((a, b) => a.year - b.year);
      
      const row = [];
      for (let i = 0; i < maxYearsPerDecade; i++) {
        if (i < decadeYears.length) {
          row.push(decadeYears[i].value);
        } else {
          row.push(null); // Empty cell for missing years
        }
      }
      
      return row;
    });

    // Create year labels (0-9 for each position in decade)
    const yearLabels = Array.from({ length: maxYearsPerDecade }, (_, i) => i.toString());

    console.log("Decade groups:", decadeGroups);
    console.log("Matrix:", mat);
    console.log("Decades:", decades);
    console.log("Year labels:", yearLabels);

    return { decades, years: yearLabels, matrix: mat };
  }, [rawMeta, rawData, chartInfo.selectedIndices]);

  const hasData = years.length > 0 && decades.length > 0 && matrix.length > 0;

  // Prepare data for download (convert matrix to flat array format)
  const downloadData = useMemo(() => {
    if (!hasData) return [];
    
    const data = [];
    decades.forEach((decadeLabel, rowIdx) => {
      years.forEach((yearInDecade, colIdx) => {
        const value = matrix[rowIdx][colIdx];
        if (value !== null) {
          data.push({
            [language === "ge" ? "დეკადა" : "Decade"]: decadeLabel,
            [language === "ge" ? "წელი დეკადაში" : "Year in Decade"]: yearInDecade,
            [language === "ge" ? "წლიური ნალექი (მმ)" : "Annual Precipitation (mm)"]: value
          });
        }
      });
    });
    return data;
  }, [hasData, decades, years, matrix, language]);

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

  // Show empty state if no data
  if (!hasData) {
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
    <div className="chart-wrapper" id={chartInfo.chartID} style={chartInfo?.wrapperStyles}>
      <div className="header" data-html2canvas-ignore="true">
        <div className="right">
          <div className="ll"></div>
          <div className="rr">
            <h1
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
              }}>
              <Svg />
              {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
            </h1>
            <p>{language === "ge" ? chartInfo.unit_ge : chartInfo.unit_en}</p>
          </div>
        </div>
        <div className="left">
          <Download
            data={downloadData}
            filename={language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
          />
        </div>
      </div>

      <div className="heatmap-container">
        <div className="legend-row">
          <span>
            <i className="swatch" style={{ background: "#fecaca" }} />
            {language === "ge" ? " მშრალი (<950მმ)" : " Dry (<950mm)"}
          </span>
          <span>
            <i className="swatch" style={{ background: "#93c5fd" }} />
            {language === "ge" ? " საშუალო" : " Average"}
          </span>
          <span>
            <i className="swatch" style={{ background: "#2563eb" }} />
            {language === "ge" ? " ნოტიო (>1100მმ)" : " Wet (>1100mm)"}
          </span>
        </div>

        <div className="grid-wrapper">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `180px repeat(${years.length}, ${columnWidth}px)`,
            }}
          >
            {decades.map((decadeLabel, r) => (
              <div key={`row-${r}`} className="grid-row">
                <div className="row-header">{decadeLabel}</div>
                {matrix[r].map((v, c) => (
                  <div
                    key={`cell-${r}-${c}`}
                    className="cell"
                    style={{ background: getBucketColor(v) }}
                    title={v !== null ? `${v.toFixed(2)} mm` : language === "ge" ? "მონაცემები არ არის" : "No data"}
                  >
                    {v !== null ? v.toFixed(2) : ""}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div
            className="col-footer-row"
            style={{
              gridTemplateColumns: `180px repeat(${years.length}, ${columnWidth}px)`,
            }}
          >
            <div />
            {years.map((y, i) => (
              <div key={`footer-${i}`} className="col-footer">
                {y}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrecipitationHeatmapChart;
