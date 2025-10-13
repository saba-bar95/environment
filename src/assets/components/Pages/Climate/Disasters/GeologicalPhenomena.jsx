// ERROR FIX: The compilation error indicates a missing package.
// Please run the following command in your terminal to install the required dependencies:
// npm install react-apexcharts apexcharts

import React, { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts"; // This import is correct once the packages are installed.

/**
 * ApexCharts visualization for "Geological Phenomena and Risk Assessment".
 * Refactored to match the modern design style provided in the image.
 *
 * Props:
 * baseUrl     - optional; defaults to your dataset root
 * metadataUrl - optional explicit endpoint (overrides baseUrl)
 * dataUrl     - optional explicit endpoint (overrides baseUrl)
 * height      - optional container height (default 420)
 */
export default function GeologicalPhenomenaChart({
                                                     baseUrl = "http://192.168.1.27:3000/api/datasets/geological-phenomena",
                                                     metadataUrl,
                                                     dataUrl,
                                                     height = 420,
                                                 }) {
    const [meta, setMeta] = useState(null);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const mdUrl = metadataUrl ?? `${baseUrl}/metadata`;
    const dtUrl = dataUrl ?? `${baseUrl}/data`;

    // --- Data Fetching ---
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const [mRes, dRes] = await Promise.all([fetch(mdUrl), fetch(dtUrl)]);
                if (!mRes.ok) throw new Error(`Metadata fetch failed (${mRes.status})`);
                if (!dRes.ok) throw new Error(`Data fetch failed (${dRes.status})`);

                const mJson = await mRes.json();
                const dJson = await dRes.json();

                if (!cancelled) {
                    setMeta(mJson?.data ?? mJson);
                    setRows(dJson?.data?.data ?? dJson?.data ?? []);
                }
            } catch (e) {
                if (!cancelled) setError(e?.message || "Unknown error");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [mdUrl, dtUrl]);

    // --- Data Transformation & Configuration for ApexCharts ---
    const labelByIndex = useMemo(() => {
        if (!meta?.metadata?.variables) return {};
        const dim =
            meta.metadata.variables.find(
                (v) => v.text?.trim?.() === "გეოლოგიური მოვლენები"
            ) || meta.metadata.variables[1];
        if (!dim?.values || !dim?.valueTexts) return {};
        const map = {};
        dim.values.forEach((val, i) => {
            map[val] = dim.valueTexts[i] ?? val;
        });
        return map;
    }, [meta]);

    const chartData = useMemo(() => {
        const sorted = [...(Array.isArray(rows) ? rows : [])].sort(
            (a, b) => (a.year ?? 0) - (b.year ?? 0)
        );

        const landslideLabel = labelByIndex["0"] || "მეწყერი"; // Landslide
        const casualtiesLabel = labelByIndex["1"] || "სულ გარდაცვლილი"; // Total Deaths
        const mudflowLabel = labelByIndex["2"] || "ღვარცოფი"; // Mudflow

        const series = [
            {
                name: landslideLabel,
                type: "area",
                data: sorted.map((r) => r?.["0"] ?? null),
            },
            {
                name: casualtiesLabel,
                type: "line",
                data: sorted.map((r) => r?.["1"] ?? null),
            },
            {
                name: mudflowLabel,
                type: "area",
                data: sorted.map((r) => r?.["2"] ?? null),
            },
        ];

        const options = {
            chart: {
                height: height,
                stacked: false,
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: true,
                    },
                },
            },
            colors: ["#008FFB", "#EB5757", "#00E396"],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
                width: [2, 3, 2], // 2px for areas, 3px for line
            },
            fill: {
                type: "solid",
                opacity: [0.4, 1, 0.4], // Semi-transparent for areas, solid for line
            },
            legend: {
                position: "top",
                horizontalAlign: "right",
                markers: {
                    width: 12,
                    height: 12,
                    strokeWidth: 0,
                    radius: 12,
                },
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: (val) => (val != null ? Math.round(val) : "N/A"),
                },
            },
            xaxis: {
                categories: sorted.map((r) => r.year),
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: true,
                    color: "#ccc",
                },
            },
            yaxis: [
                {
                    title: {
                        text: "მოვლენების რაოდენობა",
                    },
                },
                {
                    opposite: true,
                    title: {
                        text: "დაღუპულთა რაოდენობა",
                    },
                },
            ],
            grid: {
                borderColor: "#f1f1f1",
            },
        };

        return { series, options };
    }, [rows, labelByIndex, height]);

    // --- Rendering Logic ---
    const title = meta?.metadata?.title || "Geological Phenomena and Risk Assessment";
    const source = meta?.metadata?.source ?? "—";

    if (loading) return <div>იტვირთება…</div>;
    if (error) return <div style={{ color: "crimson" }}>შეცდომა: {error}</div>;

    return (
        <div style={{ width: "100%", height }} aria-label="Geological chart">
            <h3 style={{ margin: "0 0 12px", fontWeight: 600 }}>
                {title} (1995–2023)
            </h3>

            <div id="chart">
                <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="line" // The base type; individual series types override this
                    height={height}
                />
            </div>

            <small style={{ display: "block", marginTop: 8, opacity: 0.7 }}>
                წყარო: {source}
            </small>
        </div>
    );
}

