import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
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

const AreaCharts = ({ chartInfo }) => {
    const { language } = useParams();
    const [chartData, setChartData] = useState([]);
    const [selectedTexts, setSelectedTexts] = useState([]);
    const [visibleLines, setVisibleLines] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch metadata (for names) and data (for values)
                const [metaDataResult, dataResult] = await Promise.all([
                    commonData(chartInfo.id, chartInfo.types[1], language), // metadata URL
                    commonData(chartInfo.id, chartInfo.types[0], language), // data URL
                ]);

                // --- MODIFICATION START ---

                // Get the full names of the sectors from the metadata
                const fullSectorNames = metaDataResult?.data?.metadata?.variables[0]?.valueTexts || [];
                // Get the short keys used in the data objects (e.g., "CO2", "AGGREGATED_EMISSIONS")
                const dataKeys = dataResult?.data?.categories || [];

                // Select the desired data series based on the indices from the parent component
                const selected = chartInfo.selectedIndices
                    .map((index) => {
                        if (fullSectorNames[index] && dataKeys[index]) {
                            return {
                                name: fullSectorNames[index], // Full name for the legend
                                key: dataKeys[index],        // Short key for data access
                            };
                        }
                        return null;
                    })
                    .filter(Boolean);

                setSelectedTexts(selected);

                // Initialize all areas as visible
                setVisibleLines(
                    selected.reduce((acc, text) => {
                        acc[text.name] = true;
                        return acc;
                    }, {})
                );

                const rawData = dataResult.data.data || [];

                // Process data for the chart
                const processedData = rawData.map((item) => {
                    const dataPoint = { year: String(item.year) };
                    selected.forEach((text) => {
                        // Use the full name as the key for the chart, but get the value with the short key
                        dataPoint[text.name] = item[text.key];
                    });
                    return dataPoint;
                });

                // --- MODIFICATION END ---

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

    // --- The rest of the component (rendering logic) remains the same ---

    // Custom Legend Component
    const CustomLegend = () => {
        const visibleLineCount = Object.values(visibleLines).filter(Boolean).length;

        return (
            <ul className="recharts-default-legend" style={chartInfo?.styles}>
                {selectedTexts.map((text, index) => (
                    <li
                        key={`legend-item-${text.name}`}
                        className={`recharts-legend-item legend-item-${index}`}
                        onClick={() => {
                            if (visibleLines[text.name] && visibleLineCount === 1) return;
                            setVisibleLines((prev) => ({
                                ...prev,
                                [text.name]: !prev[text.name],
                            }));
                        }}
                        style={{
                            cursor: "pointer",
                            opacity: visibleLines[text.name] ? 1 : 0.5,
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
                        {label} {language === "en" ? "Year" : "წელი"}
                    </p>
                    {payload.map(({ value, fill, dataKey }) => {
                        const text = selectedTexts.find((t) => t.name === dataKey);
                        return (
                            <p
                                key={`item-${dataKey}`}
                                className="text"
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "10px",
                                    alignItems: "center",
                                }}>
                <span>
                  <span
                      style={{
                          backgroundColor: fill,
                          width: 12,
                          height: 12,
                          display: "inline-block",
                          marginRight: 8,
                      }}
                      className="before-span"></span>
                    {text?.name} :
                </span>
                                <span style={{ fontWeight: 900, marginLeft: "5px" }}>
                  {value?.toFixed(2)}
                </span>
                            </p>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (isLoading) return <div>Loading Chart...</div>; // Simplified for brevity
    if (error) return <div>Error loading chart.</div>;

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
            <ResponsiveContainer width="100%" height={460}>
                <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 15 }} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ marginBottom: -20 }}
                        content={<CustomLegend />}
                        verticalAlign="bottom"
                        align="center"
                    />
                    {selectedTexts.map((text, index) =>
                        visibleLines[text.name] ? (
                            <Area
                                key={`area-${text.name}`}
                                type="monotone"
                                dataKey={text.name}
                                stackId="1"
                                fill={chartInfo.colors[index % chartInfo.colors.length]}
                                stroke={chartInfo.colors[index % chartInfo.colors.length]}
                                name={text.name}
                                strokeWidth={2}
                            />
                        ) : null
                    )}
                    <Brush
                        dataKey="year"
                        height={20}
                        stroke="#8884d8"
                        travellerWidth={5}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AreaCharts;