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
    const [selectedText, setSelectedText] = useState(null);
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
                const index = chartInfo.selectedIndices[0];

                let selected = null;
                if (fullSectorNames[index] && dataKeys[index]) {
                    selected = { name: fullSectorNames[index], key: dataKeys[index] };
                    setSelectedText(selected);
                } else {
                    throw new Error("Invalid index for data series.");
                }

                const rawData = dataResult.data.data || [];

                const processedData = rawData.map((item) => {
                    return {
                        year: String(item.year),
                        [selected.name]: item[selected.key] || 0,
                    };
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

    const CustomLegend = () => {
        if (!selectedText) return null;
        return (
            <ul className="recharts-default-legend">
                <li className="recharts-legend-item legend-item-0">
                    <span
                        className="recharts-legend-item-icon"
                        style={{
                            backgroundColor: chartInfo.colors[0],
                            flexShrink: 0,
                            width: 12,
                            height: 12,
                            display: "inline-block",
                            marginRight: 8,
                        }}></span>
                    <span className="recharts-legend-item-text">{selectedText.name}</span>
                </li>
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

    if (isLoading) {
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
                </div>
                <div className="loading-state">
                    <p>Loading chart data...</p>
                </div>
            </div>
        );
    }

    if (error) {
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
                </div>
                <div className="error-state">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (chartData.length === 0) {
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
                </div>
                <div className="empty-state">
                    <p>No data available</p>
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
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    barCategoryGap="20%"
                    barGap={4}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                        type="category"
                        dataKey="year"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ marginBottom: -20 }}
                        content={<CustomLegend />}
                        verticalAlign="bottom"
                        align="center"
                    />
                    {selectedText && (
                        <Bar
                            dataKey={selectedText.name}
                            fill={chartInfo.colors[0]}
                            name={selectedText.name}
                            radius={[0, 2, 2, 0]}
                        />
                    )}
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

export default HorizontalBarCharts;
