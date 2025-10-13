// file: 'src/assets/components/Pages/Climate/Temperature/Temperature.jsx'
import React from "react";
import { useParams } from "react-router-dom";
import bg from "./Background/background.jpg";

import AnnualTemperatureChart from "./AnnualTemperatureChart.jsx";
import TemperatureAnomalyBarChart from "./TemperatureAnomalyBarChart.jsx";
import TemperatureMinimalTechChart from "./TemperatureMinimalTechChart.jsx";
import TemperatureMultiIndexLineChart from "./TemperatureMultiIndexLineChart.jsx";
import TemperatureRadarComparisonChart from "./TemperatureRadarComparisonChart.jsx";
import TemperatureTechnicalSchematic from "./TemperatureTechnicalSchematic.jsx";

import ChartCard from "./ChartCard.jsx";

const Temperature = () => {
    const { language } = useParams();

    return (
        <div className="temperature">
            <div
                className="background-container"
                style={{ backgroundImage: `url(${bg})`, backgroundPosition: "center 40%" }}
            >
                <div className="overlay" />
                <h1>
                    {language === "en" ? "Temperature Dashboard" : "ტემპერატურის დაფა"}
                </h1>
                <h2>
                    {language === "en"
                        ? "Climate temperature visualizations"
                        : "კლიმატის ტემპერატურის ვიზუალიზაციები"}
                </h2>
            </div>

            <div className="charts-grid">
                <ChartCard fileBase="annual-temperature">
                    <AnnualTemperatureChart />
                </ChartCard>

                <ChartCard fileBase="temperature-anomaly">
                    <TemperatureAnomalyBarChart />
                </ChartCard>

                <ChartCard fileBase="temperature-minimal-tech">
                    <TemperatureMinimalTechChart />
                </ChartCard>

                <ChartCard fileBase="temperature-multi-index">
                    <TemperatureMultiIndexLineChart />
                </ChartCard>

                <ChartCard fileBase="temperature-radar">
                    <TemperatureRadarComparisonChart />
                </ChartCard>

                <ChartCard fileBase="temperature-tech-schematic">
                    <TemperatureTechnicalSchematic />
                </ChartCard>
            </div>
        </div>
    );
};

export default Temperature;