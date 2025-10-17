import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { ResponsiveContainer, Sankey, Tooltip } from "recharts";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";
import YearDropdown from "../../../../../../YearDropdown/YearDropdown";

const SankeyChart2 = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [data, setData] = useState({ nodes: [], links: [] });
  const [downloadData, setDownloadData] = useState([]);
  const [forestTypes, setForestTypes] = useState([]);
  const [purposes, setPurposes] = useState([]);
  const [year, setYear] = useState(null);
  const [years, setYears] = useState([]);
  const [allYearsRaw, setAllYearsRaw] = useState([]);
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

  const nodeTranslation = useMemo(
    () => ({
      Total: { ge: "სულ", en: "Total" },
      ფოთლოვანი: { ge: "ფოთლოვანი", en: "Deciduous" },
      წიწვოვანი: { ge: "წიწვოვანი", en: "Coniferous" },
      "მოვლითი ჭრა": { ge: "მოვლითი ჭრა", en: "Routine cutting" },
      "სააგენტოების მიერ განხორციელებული სპეციალური ჭრა": {
        ge: "სააგენტოების მიერ განხორციელებული სპეციალური ჭრა",
        en: "Special cutting implemented by agencies",
      },
      "სოციალური ჭრა": { ge: "სოციალური ჭრა", en: "Social cutting" },
    }),
    []
  );

  const colorMap = useMemo(
    () => ({
      Total: "#333333",
      სულ: "#333333",
      Deciduous: "#228B22",
      Coniferous: "#8B4513",
      "Routine cutting": "#FF6347",
      "Special cutting implemented by agencies": "#FFD700",
      "Social cutting": "#9370DB",
      ფოთლოვანი: "#228B22",
      წიწვოვანი: "#8B4513",
      "მოვლითი ჭრა": "#FF6347",
      "სააგენტოების მიერ განხორციელებული სპეციალური ჭრა": "#FFD700",
      "სოციალური ჭრა": "#9370DB",
    }),
    []
  );

  const getFontSizeAndMargin = useCallback((w) => {
    if (w < 768) {
      // mobile
      return {
        fontsize: 8,
        margin: { right: 100, left: 20, top: 15, bottom: 15 },
      };
    } else if (w < 1200) {
      // tablet
      return {
        fontsize: 10,
        margin: { right: 100, left: 20, top: 15, bottom: 15 },
      };
    } else if (w < 1600) {
      // mid
      return {
        fontsize: 10,
        margin: { right: 120, left: 25, top: 20, bottom: 20 },
      };
    } else if (w < 1920) {
      // desktop
      return {
        fontsize: 12,
        margin: { right: 140, left: 30, top: 25, bottom: 25 },
      };
    } else {
      // ultrawide
      return {
        fontsize: 13,
        margin: { right: 160, left: 35, top: 30, bottom: 30 },
      };
    }
  }, []);

  const { fontsize, margin } = getFontSizeAndMargin(width);

  const MyCustomNode = ({ x, y, width: nodeWidth, height, payload }) => {
    const isRightNode = x > 100;
    const nodeName = language === "ge" ? payload.name_ge : payload.name_en;
    const fillColor =
      colorMap[payload.name_en] || colorMap[payload.name_ge] || "#93c5fd";

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
      colorMap[payload.source_name_en] ||
      colorMap[payload.source_name_ge] ||
      "#df9494";
    const targetColor =
      colorMap[payload.target_name_en] ||
      colorMap[payload.target_name_ge] ||
      "#df9494";
    const minLinkWidth = 2;
    const effectiveLinkWidth = Math.max(linkWidth, minLinkWidth);

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
          strokeWidth={effectiveLinkWidth}
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
    (yearlyRaw, forestTypes, purposes) => {
      const nodes = [];
      const nodeIndex = new Map();

      const getOrCreateNodeIndex = (name) => {
        if (!nodeIndex.has(name)) {
          const idx = nodes.length;
          nodeIndex.set(name, idx);
          const trans = nodeTranslation[name] || { ge: name, en: name };
          nodes.push({
            name_en: trans.en,
            name_ge: trans.ge,
            key: name,
          });
        }
        return nodeIndex.get(name);
      };

      // Add total node first
      const totalIdx = getOrCreateNodeIndex("Total");

      // Add left nodes: forest types in order
      forestTypes.forEach((ft) => getOrCreateNodeIndex(ft.name));

      // Add middle nodes: purposes in order
      purposes.forEach((p) => getOrCreateNodeIndex(p.name));

      const links = [];
      let linkId = 0;

      // Create links from total to forest types
      forestTypes.forEach((ft) => {
        const ftIdx = ft.id;
        let ftSum = 0;
        purposes.forEach((p) => {
          const pIdx = p.id;
          const dataKey = String(pIdx * 2 + ftIdx);
          const value = yearlyRaw[dataKey] || 0;
          ftSum += value;
        });
        if (ftSum > 0) {
          const targetIdx = nodeIndex.get(ft.name);
          links.push({
            source: totalIdx,
            target: targetIdx,
            value: ftSum,
            key: `link-${linkId++}`,
            source_name_en: nodes[totalIdx].name_en,
            source_name_ge: nodes[totalIdx].name_ge,
            target_name_en: nodes[targetIdx].name_en,
            target_name_ge: nodes[targetIdx].name_ge,
          });
        }
      });

      // Create links from forest types to purposes
      forestTypes.forEach((ft) => {
        const ftIdx = ft.id;
        purposes.forEach((p) => {
          const pIdx = p.id;
          const dataKey = String(pIdx * 2 + ftIdx);
          const value = yearlyRaw[dataKey] || 0;
          if (value > 0) {
            const sourceIdx = nodeIndex.get(ft.name);
            const targetIdx = nodeIndex.get(p.name);
            links.push({
              source: sourceIdx,
              target: targetIdx,
              value,
              key: `link-${linkId++}`,
              source_name_en: nodes[sourceIdx].name_en,
              source_name_ge: nodes[sourceIdx].name_ge,
              target_name_en: nodes[targetIdx].name_en,
              target_name_ge: nodes[targetIdx].name_ge,
            });
          }
        });
      });

      // Compute node values (outgoing sum for left, incoming for right)
      nodes.forEach((node, idx) => {
        const outSum = links
          .filter((l) => l.source === idx)
          .reduce((sum, l) => sum + l.value, 0);
        const inSum = links
          .filter((l) => l.target === idx)
          .reduce((sum, l) => sum + l.value, 0);
        node.value = outSum || inSum;
      });

      return { nodes, links };
    },
    [nodeTranslation]
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

        const purposes =
          metaDataResult?.data?.metadata?.variables[0].valueTexts.map(
            (p, i) => ({ name: p, id: i })
          ) || [];
        setPurposes(purposes);

        const yearData =
          metaDataResult?.data?.metadata?.variables[1].valueTexts.map(
            (year, i) => ({ year: year, id: i })
          ) || [];

        const yearNums = yearData.map((item) => Number(item.year));
        setYears(yearNums);

        let initialYear = null;
        if (yearNums.length > 0) {
          initialYear = Math.max(...yearNums);
          setYear(initialYear);
        }

        const rawData = dataResult.data.data || [];

        // Process raw data per year for Sankey
        const allYearsRawProc = yearData
          .map(({ year }) => {
            const dataItem = rawData.find((item) => item.year === Number(year));
            if (!dataItem) return null;
            return { year: Number(year), raw: dataItem };
          })
          .filter(Boolean);
        setAllYearsRaw(allYearsRawProc);

        const forestTypesNames =
          metaDataResult?.data?.metadata?.variables[2].valueTexts || [];

        // Process totals for chartData (for download)
        const processedData = allYearsRawProc.map(({ year, raw }) => {
          const leafy = (raw["0"] || 0) + (raw["2"] || 0) + (raw["4"] || 0);
          const conif = (raw["1"] || 0) + (raw["3"] || 0) + (raw["5"] || 0);
          const dataPoint = { year };
          if (forestTypesNames[0]) {
            dataPoint[forestTypesNames[0]] = leafy;
          }
          if (forestTypesNames[1]) {
            dataPoint[forestTypesNames[1]] = conif;
          }
          return dataPoint;
        });

        setChartData(processedData);

        const forestTypes =
          metaDataResult?.data?.metadata?.variables[2].valueTexts.map(
            (ft, i) => ({ name: ft, id: i })
          ) || [];
        setForestTypes(forestTypes);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load chart data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [language, chartInfo]);

  // Process Sankey data when year or dependencies change
  useEffect(() => {
    if (
      year &&
      allYearsRaw.length > 0 &&
      forestTypes.length > 0 &&
      purposes.length > 0
    ) {
      const yearlyRaw = allYearsRaw.find((d) => d.year === year)?.raw;
      if (yearlyRaw) {
        const processed = processSankeyData(yearlyRaw, forestTypes, purposes);
        setData(processed);

        // Compute structured download data
        const structured = { year: year.toString() };
        let total = 0;

        // Add forest types
        forestTypes.forEach((ft) => {
          let ftSum = 0;
          purposes.forEach((p) => {
            const pIdx = p.id;
            const ftIdx = ft.id;
            const dataKey = String(pIdx * 2 + ftIdx);
            const val = yearlyRaw[dataKey] || 0;
            ftSum += val;
          });
          structured[ft.name] = ftSum;
          total += ftSum;
        });

        // Add purposes
        purposes.forEach((p) => {
          let pSum = 0;
          forestTypes.forEach((ft) => {
            const pIdx = p.id;
            const ftIdx = ft.id;
            const dataKey = String(pIdx * 2 + ftIdx);
            const val = yearlyRaw[dataKey] || 0;
            pSum += val;
          });
          structured[p.name] = pSum;
          total += pSum;
        });

        structured.Total = total;
        setDownloadData([structured]);
      } else {
        setData({ nodes: [], links: [] });
        setDownloadData([]);
      }
    } else {
      setData({ nodes: [], links: [] });
      setDownloadData([]);
    }
  }, [year, allYearsRaw, forestTypes, purposes, processSankeyData]);

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
            data={downloadData}
            filename={`${chartInfo[`title_${language}`]} (${year})`}
            year={year}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
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

export default SankeyChart2;
