import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";
import Svg from "./Svg";
import "./HeatmapChart.scss";

/** Finds a specific variable (e.g., Year, Month) from the metadata array. */
function findVariable(vars = [], candidates = []) {
  const norm = (s) => (s || "").toString().toLowerCase();
  for (const v of vars) {
    const hay = `${norm(v.code)} ${norm(v.text)}`;
    if (candidates.some((c) => hay.includes(norm(c)))) return v;
  }
  return vars[0] || null;
}

/** Determines cell color based on value. */
function getBucketColor(v) {
  if (v === 0) return "#e7eef7";
  if (v <= 10) return "#ffe08a";
  if (v <= 20) return "#f7a85b";
  return "#ef6b6b";
}

const HydroHazardsHeatmap = ({ chartInfo, columnWidth = 140 }) => {
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
  const { years, months, matrix } = useMemo(() => {
    if (!rawMeta || !rawData) return { years: [], months: [], matrix: [] };

    const metaVars = rawMeta?.data?.metadata?.variables || [];
    const yearVar = findVariable(metaVars, ["year", "წელი"]);
    const monthVar = findVariable(metaVars, ["month", "თვე"]);

    const years = yearVar?.valueTexts || [];
    const allMonths = monthVar?.valueTexts || [];

    // Filter out "ადამიანთა მსხვერპლი" (human casualties) from months
    const monthsWithIndices = allMonths
      .map((label, index) => ({ label, originalIndex: index }))
      .filter(({ label }) => {
        const normalized = (label || "").toString().toLowerCase();
        return (
          !normalized.includes("მსხვერპ") && !normalized.includes("casual")
        );
      });

    const months = monthsWithIndices.map((m) => m.label);

    // Use the hazard index from chartInfo.selectedIndices
    const hazardIndex = chartInfo.selectedIndices?.[0];

    if (hazardIndex === undefined) {
      console.log("No selectedIndices found in chartInfo");
      return { years: [], months: [], matrix: [] };
    }

    const records = rawData?.data?.data || [];

    // Create matrix: rows = months (filtered), columns = years
    const mat = monthsWithIndices.map(({ originalIndex: monthIdx }) =>
      years.map((yearLabel) => {
        // The year field in records contains the index (0, 1, 2...),
        // while years array contains the labels (2013, 2014, 2015...)
        const yearRecord = records.find((r) => r?.year === +yearLabel);
        if (!yearRecord) {
          return 0;
        }

        // Get value for this specific hazard and month combination
        // Format: "hazardIndex - monthIndex" (e.g., "6 - 0", "6 - 1", etc.)
        const key = `${hazardIndex} - ${monthIdx}`;
        const val = Number(yearRecord[key] ?? 0);

        return Number.isFinite(val) ? val : 0;
      })
    );

    return { years, months, matrix: mat };
  }, [rawMeta, rawData, chartInfo.selectedIndices]);

  const hasData = years.length > 0 && months.length > 0 && matrix.length > 0;

  // Prepare data for download (convert matrix to flat array format)
  const downloadData = useMemo(() => {
    if (!hasData) return [];

    const data = [];
    months.forEach((monthLabel, rowIdx) => {
      years.forEach((yearLabel, colIdx) => {
        data.push({
          [language === "ge" ? "თვე" : "Month"]: monthLabel,
          [language === "ge" ? "წელი" : "Year"]: yearLabel,
          [language === "ge" ? "მოვლენების რაოდენობა" : "Number of Events"]:
            matrix[rowIdx][colIdx],
        });
      });
    });
    // console.log(data);
    return data;
  }, [hasData, months, years, matrix, language]);

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
    <div className="chart-wrapper" id={chartInfo.chartID}>
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
            filename={
              language === "ge" ? chartInfo.title_ge : chartInfo.title_en
            }
          />
        </div>
      </div>

      <div className="heatmap-container">
        <div className="legend-row">
          <span>
            <i className="swatch" style={{ background: "#e7eef7" }} /> 0
          </span>
          <span>
            <i className="swatch" style={{ background: "#ffe08a" }} /> 1–10
          </span>
          <span>
            <i className="swatch" style={{ background: "#f7a85b" }} /> 11–20
          </span>
          <span>
            <i className="swatch" style={{ background: "#ef6b6b" }} /> 21+
          </span>
        </div>

        <div className="grid-wrapper">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `180px repeat(${years.length}, ${columnWidth}px)`,
            }}>
            {months.map((mLabel, r) => (
              <div key={`row-${r}`} className="grid-row">
                <div className="row-header">{mLabel}</div>
                {matrix[r].map((v, c) => (
                  <div
                    key={`cell-${r}-${c}`}
                    className="cell"
                    style={{ background: getBucketColor(v) }}>
                    {v}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div
            className="col-footer-row"
            style={{
              gridTemplateColumns: `180px repeat(${years.length}, ${columnWidth}px)`,
            }}>
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

export default HydroHazardsHeatmap;
