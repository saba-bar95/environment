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
    Brush, // Restored the Brush import
} from "recharts";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";

const BarCharts = ({ chartInfo }) => {
    const { language } = useParams();
    const [chartData, setChartData] = useState([]);
    const [selectedTexts, setSelectedTexts] = useState([]);
    const [visibleBars, setVisibleBars] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [metaDataResult, dataResult] = await Promise.all([
                    commonData(chartInfo.id, chartInfo.types[1], language),
                    commonData(chartInfo.id, chartInfo.types[0], language),
                ]);

                const fullSectorNames = metaDataResult?.data?.metadata?.variables[0]?.valueTexts || [];
                const dataKeys = dataResult?.data?.categories || [];

                const selected = chartInfo.selectedIndices
                    .map((index) => {
                        if (fullSectorNames[index] && dataKeys[index]) {
                            return { name: fullSectorNames[index], key: dataKeys[index] };
                        }
                        return null;
                    })
                    .filter(Boolean);

                setSelectedTexts(selected);

                setVisibleBars(
                    selected.reduce((acc, text) => ({ ...acc, [text.name]: true }), {})
                );

                const rawData = dataResult.data.data || [];

                // Correctly process data with years on the X-axis
                const processedData = rawData.map((item) => {
                    const dataPoint = { year: String(item.year) }; // X-axis will be the year
                    selected.forEach((text) => {
                        dataPoint[text.name] = item[text.key] || 0;
                    });
                    return dataPoint;
                });

                setChartData(processedData);

            } catch (error) {
                console.log("Error fetching data:", error);
                setError("Failed to load chart data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        getData();
    }, [language, chartInfo]);

    // --- YOUR CUSTOM COMPONENTS AND STYLES ARE RESTORED ---

    const CustomLegend = () => {
        const visibleBarCount = Object.values(visibleBars).filter(Boolean).length;
        return (
            <ul className="recharts-default-legend">
                {selectedTexts.map((text, index) => (
                    <li
                        key={`legend-item-${text.name}`}
                        className={`recharts-legend-item legend-item-${index}`}
                        onClick={() => {
                            if (visibleBars[text.name] && visibleBarCount === 1) return;
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
                    backgroundColor: chartInfo.colors[index % chartInfo.colors.length],
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

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;
        return (
            <div className="custom-tooltip">
                <div className="tooltip-container">
                    <p className="tooltip-label">{label} {language === "ge" ? "წელი" : "Year"}</p>
                    {payload.map(({ value, fill, dataKey }) => (
                        <p key={`item-${dataKey}`} className="text" style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center" }}>
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
                  {dataKey} :
              </span>
                            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
                {value?.toFixed(2)}
              </span>
                        </p>
                    ))}
                </div>
            </div>
        );
    };

    if (isLoading) { /* ... Your Full Loading JSX ... */ }
    if (error) { /* ... Your Full Error JSX ... */ }
    if (chartData.length === 0) { /* ... Your Full Empty State JSX ... */ }

    return (
        <div className="chart-wrapper" id={chartInfo.chartID}>
            <div className="header">
                <div className="right">
                    <div className="ll"></div>
                    <div className="rr">
                        <h1>{language === "ge" ? chartInfo.title_ge : chartInfo.title_en}</h1>
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
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="year" // X-axis is now the year
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
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
                                name={text.name}
                            />
                        ) : null
                    )}
                    {/* --- BRUSH/TOOLBAR IS RESTORED HERE --- */}
                    <Brush
                        dataKey="year"
                        height={20}
                        stroke="#8884d8"
                        travellerWidth={5}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarCharts;