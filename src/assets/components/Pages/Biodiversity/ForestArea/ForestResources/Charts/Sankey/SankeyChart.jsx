import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { ResponsiveContainer, Sankey, Tooltip } from "recharts";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";
import YearDropdown from "../../../../../../YearDropdown/YearDropdown";

const SankeyChart = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [data, setData] = useState(null);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [year, setYear] = useState(null);
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [hoveredLinkIndex, setHoveredLinkIndex] = useState(null);

  const chartContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  // Translation map for Georgian names
  const translationMap = useMemo(
    () => ({
      Georgia: { ge: "საქართველო" },
      "Forest area of Abkhazia AR*": { ge: "აფხაზეთის არს ტყის ფონდი*" },
      "Forest area under the Forestry Agency of Adjara": {
        ge: "აჭარის სატყეო სააგენტოს ტყის ფონდი",
      },
      "Forest area under the Agency of Protected Areas**": {
        ge: "დაცული ტერიტორიების სააგენტოს ტყის ფონდი**",
      },
      "Forest area under the National Forestry Agency***": {
        ge: "ეროვნული სატყეო სააგენტოს ტყის ფონდი***",
      },
      Guria: { ge: "გურია" },
      Imereti: { ge: "იმერეთი" },
      Kakheti: { ge: "კახეთი" },
      "Mtskheta-Mtianeti": { ge: "მცხეთა-მთიანეთი" },
      "Racha-Lechkhumi and Kvemo Svaneti": {
        ge: "რაჭა-ლეჩხუმი და ქვემო სვანეთი",
      },
      "Samegrelo-Zemo Svaneti": { ge: "სამეგრელო-ზემო სვანეთი" },
      "Samtskhe-Javakheti": { ge: "სამცხე-ჯავახეთი" },
      "Kvemo Kartli": { ge: "ქვემო ქართლი" },
      "Shida Kartli": { ge: "შიდა ქართლი" },
    }),
    []
  );

  const colorMap = {
    // English keys
    Georgia: "#006400",
    "Forest area of Abkhazia AR*": "#d83712",
    "Forest area under the Forestry Agency of Adjara": "#32CD32",
    "Forest area under the Agency of Protected Areas**": "#41d9ff",
    "Forest area under the National Forestry Agency***": "#bedd0d",
    Guria: "#df1ac4",
    Imereti: "#c59100",
    Kakheti: "#974949ff",
    "Mtskheta-Mtianeti": "#2415ec",
    "Racha-Lechkhumi and Kvemo Svaneti": "#0db3dd",
    "Samegrelo-Zemo Svaneti": "#475f8b",
    "Samtskhe-Javakheti": "#90409b",
    "Kvemo Kartli": "#6a2dda",
    "Shida Kartli": "#bdcabe",

    // Georgian keys with same colors
    საქართველო: "#006400",
    "აფხაზეთის არ-ის ტყის ფონდი*": "#d83712",
    "აჭარის სატყეო სააგენტოს ტყის ფონდი": "#32CD32",
    "დაცული ტერიტორიების ტყის ფონდი**": "#4d8cacff",
    "ეროვნული სატყეო სააგენტოს ტყის ფონდი***": "#bedd0d",
    გურია: "#df1ac4",
    იმერეთი: "#c59100",
    კახეთი: "#974949ff",
    "მცხეთა-მთიანეთი": "#2415ec",
    "რაჭა-ლეჩხუმი და ქვემო სვანეთი": "#0db3dd",
    "სამეგრელო-ზემო სვანეთი": "#475f8b",
    "სამცხე-ჯავახეთი": "#90409b",
    "ქვემო ქართლი": "#6a2dda",
    "შიდა ქართლი": "#bdcabe",
  };

  const getFontSizeAndMargin = useCallback((w) => {
    if (w < 768) {
      // mobile
      return {
        fontsize: 8,
        margin: { right: 100, left: 50, top: 20, bottom: 20 },
      };
    } else if (w < 1200) {
      // tablet
      return {
        fontsize: 10,
        margin: { right: 140, left: 60, top: 30, bottom: 30 },
      };
    } else if (w < 1600) {
      // mid
      return {
        fontsize: 10,
        margin: { right: 240, left: 70, top: 35, bottom: 35 },
      };
    } else if (w < 1920) {
      // desktop
      return {
        fontsize: 12,
        margin: { right: 260, left: 80, top: 40, bottom: 40 },
      };
    } else {
      // ultrawide
      return {
        fontsize: 12,
        margin: { right: 280, left: 90, top: 45, bottom: 45 },
      };
    }
  }, []);

  const { fontsize, margin } = getFontSizeAndMargin(width);

  const MyCustomNode = ({ x, y, width: nodeWidth, height, payload }) => {
    const isRightNode = x > 100;
    const nodeName = language === "ge" ? payload.name_ge : payload.name_en;
    const fillColor =
      colorMap[payload.name_en] ||
      colorMap[payload.name_ge] ||
      colorMap[nodeName] ||
      "#93c5fd";

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={nodeWidth}
          height={height}
          stroke={fillColor}
          strokeWidth={3}
          fill={fillColor}
        />
        <text
          x={isRightNode ? x + nodeWidth + 10 : x - 3}
          y={y + height / 2}
          textAnchor={isRightNode ? "start" : "end"}
          fill="black"
          fontWeight="bold"
          fontSize={fontsize}>
          {nodeName}
        </text>
      </g>
    );
  };

  const CustomizedLink = (props) => {
    const { sourceX, targetX, sourceY, targetY, linkWidth, index, payload } =
      props;
    const isHovered = hoveredLinkIndex === index;
    const sourceColor =
      colorMap[payload.source.name_en] ||
      colorMap[payload.source.name_ge] ||
      "#df9494";
    const targetColor =
      colorMap[payload.target.name_en] ||
      colorMap[payload.target.name_ge] ||
      "#df9494";

    return (
      <>
        <defs>
          <linearGradient id={`gradient-${index}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={sourceColor} />
            <stop offset="100%" stopColor={targetColor} />
          </linearGradient>
        </defs>
        <path
          d={`M${sourceX},${sourceY}C${(sourceX + targetX) / 2},${sourceY} ${
            (sourceX + targetX) / 2
          },${targetY} ${targetX},${targetY}`}
          fill="none"
          stroke={`url(#gradient-${index})`}
          strokeOpacity={isHovered ? 0.8 : 0.5}
          strokeWidth={linkWidth}
          onMouseEnter={() => setHoveredLinkIndex(index)}
          onMouseLeave={() => setHoveredLinkIndex(null)}
        />
      </>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }
    const linkPayload = payload[0]?.payload?.payload;

    if (linkPayload && linkPayload.source && linkPayload.target) {
      // It's a link
      const sourceName =
        linkPayload.source[`name_${language}`] ||
        linkPayload.source.name_en ||
        linkPayload.source.name_ge;
      const targetName =
        linkPayload.target[`name_${language}`] ||
        linkPayload.target.name_en ||
        linkPayload.target.name_ge;
      const value = linkPayload.value;

      return (
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            fontFamily: "Arial, sans-serif",
          }}>
          <p style={{ fontWeight: "bold", marginBottom: "5px", color: "#444" }}>
            <span style={{ color: "#0860ee", fontSize: "12px" }}>
              {sourceName}
            </span>
            <span style={{ color: "#d30808", fontSize: "12px" }}>
              {" "}
              → {targetName}
            </span>
            <span style={{ fontSize: "13px", marginLeft: "5px" }}>
              {value.toFixed(1)}
            </span>
          </p>
        </div>
      );
    } else if (linkPayload && linkPayload.name_en) {
      // It's a node
      const nodeName =
        linkPayload[`name_${language}`] ||
        linkPayload.name_en ||
        linkPayload.name_ge;
      const value = linkPayload.value;

      return (
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            fontFamily: "Arial, sans-serif",
          }}>
          <p style={{ fontWeight: "bold", marginBottom: "5px", color: "#444" }}>
            <span style={{ color: "#0860ee", fontSize: "12px" }}>
              {nodeName}
            </span>
            <span style={{ fontSize: "13px", marginLeft: "5px" }}>
              {value ? value.toFixed(1) : ""}
            </span>
          </p>
        </div>
      );
    }

    // Fallback if neither
    return null;
  };

  const processSankeyData = useCallback(
    (yearlyData, selectedTexts) => {
      const nodes = [];
      const nodeIndex = new Map();

      const getOrCreateNodeIndex = (name_en) => {
        if (!nodeIndex.has(name_en)) {
          const idx = nodes.length;
          nodeIndex.set(name_en, idx);
          const geName = translationMap[name_en]?.ge || name_en;
          nodes.push({
            name_en,
            name_ge: geName,
            key: name_en, // Add unique key for React
          });
        }
        return nodeIndex.get(name_en);
      };

      const georgiaName = selectedTexts[0]?.name;
      if (!georgiaName) return { nodes: [], links: [] };

      const georgiaIdx = getOrCreateNodeIndex(georgiaName);

      // Define order for middle nodes to position National more centrally
      const middleNames = [
        selectedTexts[2].name, // Adjara (small)
        selectedTexts[1].name, // Abkhazia
        selectedTexts[4].name, // National (large, positioned in the middle)
        selectedTexts[3].name, // Protected
      ];

      // Add middle nodes in the desired order
      middleNames.forEach((name) => getOrCreateNodeIndex(name));

      // Add regions
      selectedTexts.slice(5).forEach((text) => getOrCreateNodeIndex(text.name));

      const links = [];
      let linkId = 0;

      // Links from Georgia to middle nodes
      middleNames.forEach((name) => {
        const value = yearlyData[name];
        if (value !== undefined && value > 0) {
          links.push({
            source: georgiaIdx,
            target: nodeIndex.get(name),
            value,
            key: `link-${linkId++}`, // Add unique key for React
          });
        }
      });

      // Links from National to regions
      const nationalName = selectedTexts[4].name;
      const nationalIdx = nodeIndex.get(nationalName);
      selectedTexts.slice(5).forEach((text) => {
        const regionName = text.name;
        const value = yearlyData[regionName];
        if (value !== undefined && value > 0) {
          links.push({
            source: nationalIdx,
            target: nodeIndex.get(regionName),
            value,
            key: `link-${linkId++}`, // Add unique key for React
          });
        }
      });

      return { nodes, links };
    },
    [translationMap]
  );

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

        const valueTexts =
          metaDataResult?.data?.metadata?.variables[0].valueTexts.map(
            (region, i) => ({ name: region, id: i })
          ) || [];

        setSelectedTexts(valueTexts);

        const yearData =
          metaDataResult?.data?.metadata?.variables[1].valueTexts.map(
            (year, i) => ({ year: year, id: i })
          ) || [];

        const availableYears = yearData.map((item) => item.year);
        setYears(availableYears);

        if (availableYears.length > 0) {
          const latestYear = Math.max(...availableYears).toString();
          setYear(+latestYear);
        }

        const rawData = dataResult.data.data || [];

        const processedData = yearData
          .map(({ year }) => {
            const dataItem = rawData.find((item) => item.year === Number(year));
            if (!dataItem) return null;
            const dataPoint = { year };
            valueTexts.forEach((text) => {
              dataPoint[text.name] = dataItem[String(text.id)];
            });
            return dataPoint;
          })
          .filter(Boolean);

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

  // Process Sankey data when year or chartData changes
  useEffect(() => {
    if (year && chartData.length > 0 && selectedTexts.length > 0) {
      const yearlyData = chartData.find((d) => d.year === year.toString());
      if (yearlyData) {
        const processed = processSankeyData(yearlyData, selectedTexts);
        setData(processed);
      } else {
        setData({ nodes: [], links: [] });
      }
    } else {
      setData(null);
    }
  }, [year, chartData, selectedTexts, processSankeyData]);

  // Loading state
  if (isLoading) {
    return (
      <div
        className="chart-wrapper"
        id={chartInfo.chartID}
        ref={chartContainerRef}>
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

  // Error state
  if (error) {
    return (
      <div
        className="chart-wrapper"
        id={chartInfo.chartID}
        ref={chartContainerRef}>
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

  // Empty state
  if (chartData.length === 0) {
    return (
      <div
        className="chart-wrapper"
        id={chartInfo.chartID}
        ref={chartContainerRef}>
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
    <div
      className="chart-wrapper"
      id={chartInfo.chartID}
      ref={chartContainerRef}
      style={width > 1200 ? chartInfo?.wrapperStyles : {}}>
      <div className="header" style={{ marginBottom: 0 }}>
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
          <YearDropdown years={years} year={year} setYear={setYear} />
          <Download
            data={chartData}
            filename={`${chartInfo[`title_${language}`]} (${year})`}
            year={year}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={460}>
        <Sankey
          data={data}
          node={<MyCustomNode />}
          nodePadding={20}
          margin={margin}
          link={<CustomizedLink />}>
          <Tooltip content={<CustomTooltip />} />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
};

export default SankeyChart;
