import React, { useState, useEffect, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
} from "recharts";

// --- CONFIGURATION OBJECT (JS only) ---
// Long API hazard names -> short legend label + specific colors (to match screenshot)
const hazardDisplayConfig = {
    "წყალდიდობა-წყალმოვარდნა, დატბორვა": {
        label: "წყალდიდობა/წყალმოვარდნა",
        color: "#2166B0", // blue (bottom)
    },
    "ქარიშხალი, შკვალი": { label: "ქარიშხალი/შკვალი", color: "#7D4F9F" }, // purple
    "სეტყვა": { label: "სეტყვა", color: "#4CAF50" }, // green
    "დიდთოვლობა": { label: "დიდთოვლობა", color: "#B0BEC5" }, // grey
    "ზვავი": { label: "ზვავი", color: "#F44336" }, // red
    "შტორმი": { label: "შტორმი", color: "#E97920" }, // orange
};

// Preferred stacking & legend order to mirror the screenshot
const preferredOrder = [
    "წყალდიდობა-წყალმოვარდნა, დატბორვა",
    "ქარიშხალი, შკვალი",
    "სეტყვა",
    "დიდთოვლობა",
    "ზვავი",
    "შტორმი",
];

// --- DATA TRANSFORMATION FUNCTION ---
function transformDataForChart(apiData, apiMetadata) {
    const yearMeta = apiMetadata.data.metadata.variables.find((v) => v.code === "Year");
    const hazardMeta = apiMetadata.data.metadata.variables.find(
        (v) => v.code === "Hydrometeorological hazard"
    );
    const monthMeta = apiMetadata.data.metadata.variables.find((v) => v.code === "Month");

    const yearMap = Object.fromEntries(
        yearMeta.values.map((val, i) => [val, yearMeta.valueTexts[i]])
    );
    const hazardMap = Object.fromEntries(
        hazardMeta.values.map((val, i) => [val, hazardMeta.valueTexts[i]])
    );

    const transformed = apiData.data.data.map((yearData) => {
        const yearlyTotals = {
            year: yearMap[yearData.year],
        };

        for (const hazardId in hazardMap) {
            const hazardName = hazardMap[hazardId];
            let annualSum = 0;

            // Sum monthly values; skip the last meta value if it's an aggregate
            for (let monthId = 0; monthId < monthMeta.values.length - 1; monthId++) {
                const key = `${hazardId} - ${monthId}`;
                const val = yearData[key];
                if (typeof val === "number" && Number.isFinite(val)) {
                    annualSum += val;
                }
            }

            // Only keep hazards we have in the display config to match the screenshot
            if (hazardDisplayConfig[hazardName]) {
                yearlyTotals[hazardName] = annualSum;
            }
        }

        return yearlyTotals;
    });

    // Filter to 2016–2023 inclusive
    const filteredData = transformed.filter((item) => {
        const yr = parseInt(item.year, 10);
        return yr >= 2016 && yr <= 2023;
    });

    // Ensure columns exist even when a year has 0 for a hazard
    const ensured = filteredData.map((row) => {
        const copy = { ...row };
        Object.keys(hazardDisplayConfig).forEach((h) => {
            if (typeof copy[h] !== "number") copy[h] = 0;
        });
        return copy;
    });

    return { chartData: ensured };
}

// --- CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-300 rounded-md p-3 shadow-sm">
                <p className="font-semibold m-0 mb-1">{label}</p>
                {payload.map((entry, idx) => (
                    <p key={idx} className="m-0 text-sm" style={{ color: entry.color }}>
                        {(hazardDisplayConfig[entry.name]?.label || entry.name) + ": "}
                        {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// --- CUSTOM LABELS INSIDE SEGMENTS ---
const renderSegmentLabel = (props) => {
    const { x, y, width, height, value } = props;
    if (!value || value === 0) return null;

    const cx = x + width / 2;

    // If the segment is very thin, draw the label just ABOVE the segment
    // so it always shows (like in your reference image).
    if (height < 16) {
        return (
            <text
                x={cx}
                y={y - 4}
                textAnchor="middle"
                dominantBaseline="alphabetic"
                fontSize={12}
                fill="#333333"
                fontWeight={600}
                style={{ pointerEvents: "none" }}
            >
                {value}
            </text>
        );
    }

    // Otherwise, center the label inside the segment in white
    const cy = y + height / 2;
    return (
        <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fill="#FFFFFF"
            fontWeight={600}
            style={{ pointerEvents: "none" }}
        >
            {value}
        </text>
    );
};

// --- CHART ---
const HydroHazardChart = ({ data }) => {
    const hazardOrder = useMemo(() => {
        // Use preferred order but only include hazards present in config
        return preferredOrder.filter((h) => hazardDisplayConfig[h]);
    }, []);

    return (
        <div className="w-full">
            <div className="flex flex-col gap-2 mb-2">
                <h2 className="text-2xl font-bold">
                    წელიწადში ჰიდრომეტეოროლოგიური მოვლენები ტიპების მიხედვით (2016–2023)
                </h2>
                {/* Legend duplicates the screenshot order and labels */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    {hazardOrder.map((h) => (
                        <div key={h} className="inline-flex items-center gap-2">
              <span
                  className="inline-block w-3 h-3"
                  style={{ backgroundColor: hazardDisplayConfig[h].color }}
              />
                            <span>{hazardDisplayConfig[h].label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" tickLine={false} axisLine={{ stroke: "#cccccc" }} />
                        <YAxis axisLine={false} tickLine={false} ticks={[0, 50, 100, 150, 200]} domain={[0, 200]} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(200,200,200,0.08)" }} />
                        {/* Keep a hidden Legend so colors show in tooltip with names; visual legend is custom above */}
                        <Legend verticalAlign="top" height={0} />

                        {hazardOrder.map((hazardKey) => (
                            <Bar key={hazardKey} dataKey={hazardKey} name={hazardKey} stackId="a" fill={hazardDisplayConfig[hazardKey].color} barSize={36}>
                                <LabelList dataKey={hazardKey} content={renderSegmentLabel} />
                            </Bar>
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// --- DATA FETCH CONTAINER ---
const HydroChartContainer = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const DATA_URL = "http://192.168.1.27:3000/api/datasets/hydro-meteorological-hazards/data";
    const METADATA_URL = "http://192.168.1.27:3000/api/datasets/hydro-meteorological-hazards/metadata";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dataResponse, metadataResponse] = await Promise.all([
                    fetch(DATA_URL),
                    fetch(METADATA_URL),
                ]);
                if (!dataResponse.ok || !metadataResponse.ok) {
                    throw new Error("API call failed");
                }
                const apiData = await dataResponse.json();
                const apiMetadata = await metadataResponse.json();
                const { chartData } = transformDataForChart(apiData, apiMetadata);
                setChartData(chartData);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <div>Loading Chart... ⏳</div>;
    if (error) return <div>Error: {error} 😟</div>;
    if (!chartData || chartData.length === 0) return <div>No data to display.</div>;

    return (
        <div className="p-5">
            <HydroHazardChart data={chartData} />
        </div>
    );
};

export default HydroChartContainer;
