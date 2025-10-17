import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
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

const LineCharts3 = ({ chartInfo }) => {
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

            const specificChartInfo = {
                ...chartInfo,
                selectedIndices: [10, 11] // <-- HARDCODED FOR THIS CHART
            };

            try {
                const [metaDataResult, dataResult] = await Promise.all([
                    commonData(specificChartInfo.id, specificChartInfo.types[1], language),
                    commonData(specificChartInfo.id, specificChartInfo.types[0], language),
                ]);

                const fullSectorNames = metaDataResult?.data?.metadata?.variables[0]?.valueTexts || [];
                const dataKeys = dataResult?.data?.categories || [];

                const selected = specificChartInfo.selectedIndices
                    .map((index) => {
                        if (fullSectorNames[index] && dataKeys[index]) {
                            return { name: fullSectorNames[index], key: dataKeys[index] };
                        }
                        return null;
                    })
                    .filter(Boolean);

                setSelectedTexts(selected);
                setVisibleLines(
                    selected.reduce((acc, text) => ({...acc, [text.name]: true}), {})
                );

                const rawData = dataResult.data.data || [];
                const processedData = rawData.map((item) => {
                    const dataPoint = { year: String(item.year) };
                    selected.forEach((text) => {
                        dataPoint[text.name] = item[text.key];
                    });
                    return dataPoint;
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

    // --- Custom Legend and Tooltip are now included --- ✅

    const CustomLegend = () => {
        const visibleLineCount = Object.values(visibleLines).filter(Boolean).length;
        return (
            <ul className="recharts-default-legend">
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
                        style={{ cursor: "pointer", opacity: visibleLines[text.name] ? 1 : 0.5 }}>
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
                    <p className="tooltip-label">
                        {label} {language === "en" ? "Year" : "წელი"}
                    </p>
                    {payload.map(({ value, stroke, dataKey }) => {
                        const text = selectedTexts.find((t) => t.name === dataKey);
                        return (
                            <p
                                key={`item-${dataKey}`}
                                className="text"
                                style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center" }}>
                                <span>
                                    <span
                                        style={{ backgroundColor: stroke, width: 12, height: 12, display: "inline-block", marginRight: 8 }}
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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div
            className="chart-wrapper"
            id={chartInfo.chartID}
            style={chartInfo?.wrapperStyles}>
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
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 15 }} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} />
                    {/* These now correctly call your custom components */}
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ marginBottom: -20 }}
                        content={<CustomLegend />}
                        verticalAlign="bottom"
                        align="center"
                    />
                    {selectedTexts.map((text, index) =>
                        visibleLines[text.name] ? (
                            <Line
                                key={`line-${text.name}`}
                                type="monotone"
                                dataKey={text.name}
                                stroke={chartInfo.colors[index % chartInfo.colors.length]}
                                name={text.name}
                                strokeWidth={3}
                                dot={{
                                    r: 3,
                                    fill: chartInfo.colors[index % chartInfo.colors.length],
                                }}
                            />
                        ) : null
                    )}
                    <Brush
                        dataKey="year"
                        height={20}
                        stroke="#8884d8"
                        travellerWidth={5}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineCharts3;