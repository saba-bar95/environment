import { useEffect, useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Legend,
} from "recharts";

// --- Constants remain the same ---
const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://192.168.1.27:3000/api/datasets";
const DATASET_SLUG = "geological-phenomena";
const DATA_URL = `${API_BASE}/${DATASET_SLUG}/data`;

// --- The Main Chart Component ---
function NaturalDisastersChart({ language = "en" }) {
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            setStatus("loading");
            setError(null);
            try {
                // We only need the data URL for this chart
                const response = await fetch(DATA_URL, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`${response.status} ${response.statusText}`);
                }
                const json = await response.json();
                const dataRows = json?.data?.data;

                if (!Array.isArray(dataRows)) {
                    throw new Error("Data rows are missing or not in the expected format.");
                }

                // --- CORE LOGIC: Simplified Data Transformation ---
                // We map over the raw data to create a new array in the format our chart needs.
                const processedData = dataRows.map(row => {
                    // Safely get the casualty numbers for landslides (key "1") and mudflows (key "3").
                    // The '?? 0' ensures that if a value is missing, we treat it as zero.
                    const landslideCasualties = Number(row["1"] ?? 0);
                    const mudflowCasualties = Number(row["3"] ?? 0);

                    // Return a new, clean object for each year.
                    return {
                        year: row.year,
                        casualties: landslideCasualties + mudflowCasualties,
                    };
                });

                // Set the transformed data into state
                setChartData(processedData);
                setStatus("done");

            } catch (e) {
                // AbortError is expected on cleanup, don't treat it as a real error
                if (e.name !== 'AbortError') {
                    setError(e);
                    setStatus("error");
                }
            }
        }

        load();

        // Cleanup function to abort fetch on component unmount
        return () => {
            controller.abort();
        };
    }, []); // Empty dependency array means this effect runs once on mount

    // --- Memoization to calculate max Y-axis value ---
    const maxValue = useMemo(
        // We now check for 'casualties' instead of 'value'
        () => chartData.reduce((max, row) => Math.max(max, row.casualties), 0),
        [chartData]
    );
    const yMax = useMemo(
        () => Math.max(5, Math.ceil((maxValue || 0) / 5) * 5),
        [maxValue]
    );

    // --- Loading and Error States (Unchanged) ---
    if (status === "loading") {
        return (
            <div className="chart-wrapper">
                <div className="chart-status">
                    {language === "en" ? "Loading..." : "იტვირთება..."}
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="chart-wrapper">
                <div className="chart-error">
                    {language === "en" ? "Error: " : "შეცდომა: "}
                    {String(error?.message || "Unknown error")}
                </div>
            </div>
        );
    }

    // --- Labels and Annotations (Unchanged) ---
    const title =
        language === "en"
            ? "Human Casualties from Landslides and Mudflows"
            : "ადამიანთა მსხვერპლი მეწყერისა და ღვარცოფისგან";
    const yLabel =
        language === "en" ? "Number of casualties" : "მსხვერპლთა რაოდენობა";
    const anno2015 =
        language === "en"
            ? "Flood in the Vere valley"
            : "წყალდიდობა ვერეს ხეობაში";
    const anno2023 =
        language === "en" ? "Shovi tragedy" : "შოვის ტრაგედია";

    const has2015 = chartData.some(r => r.year === 2015);
    const has2023 = chartData.some(r => r.year === 2023);

    return (
        <div className="chart-wrapper">
            <h3 className="chart-title">{title}</h3>
            <ResponsiveContainer width="100%" height={460}>
                <BarChart data={chartData} margin={{ top: 40, right: 30, left: 10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" angle={-45} textAnchor="end" height={60} />
                    <YAxis
                        domain={[0, yMax]}
                        label={{
                            value: yLabel,
                            angle: -90,
                            position: "insideLeft",
                            offset: 10,
                        }}
                        allowDecimals={false}
                    />
                    <Tooltip
                        formatter={(value) => [value, language === "en" ? "Casualties" : "მსხვერპლი"]}
                        labelFormatter={(label) => `Year: ${label}`}
                    />
                    <Legend verticalAlign="top" />
                    {/* --- KEY CHANGE: Updated the Bar component's props --- */}
                    <Bar
                        dataKey="casualties"
                        name={language === "en" ? "Total casualties" : "სულ მსხვერპლი"}
                        fill="#ff6b6b"
                    />
                    {/* --- Reference Lines for significant events (Unchanged) --- */}
                    {has2015 && (
                        <ReferenceLine
                            x={2015}
                            stroke="#777"
                            strokeDasharray="3 3"
                            label={{ value: anno2015, position: "top", fill: "#555" }}
                        />
                    )}
                    {has2023 && (
                        <ReferenceLine
                            x={2023}
                            stroke="#777"
                            strokeDasharray="3 3"
                            label={{ value: anno2023, position: "top", fill: "#555" }}
                        />
                    )}
                </BarChart>
            </ResponsiveContainer>
            <div className="chart-footnote">
                {language === "en"
                    ? "Source: National Statistics Office of Georgia"
                    : "წყარო: საქართველოს სტატისტიკის ეროვნული სამსახური"}
            </div>
        </div>
    );
}

export default NaturalDisastersChart;