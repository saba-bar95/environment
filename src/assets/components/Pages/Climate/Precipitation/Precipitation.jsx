import { useParams } from "react-router-dom";
import PrecipitationChartContainer from "./PrecipitationChartContainer";
import backgroundImg from "./Background/background.jpg";
import "./Precipitation.scss";
import DeviationChartsPage from "./DeviationChartsPage.jsx";
import MinMaxChartPage from "./MinMaxChartPage.jsx";
import MultiLineChartPage from "./MultiLineChartPage.jsx";
import DonutChartPage from "./DonutChartPage.jsx";
import ExtremeYearsPage from "./ExtremeYearsPage.jsx";
import MonthlyRange2022Chart from "./MonthlyRange2022Chart.jsx";
import ScatterPlotPage from "./ScatterPlotPage.jsx";
import ExtremeTrendPage from "./ExtremeTrendPage.jsx";
import RadialChartPage from "./RadialChartPage.jsx";
import PrecipitationHeatmap from "./PrecipitationHeatmap.jsx";
import TablePage from "./TablePage.jsx";

const Precipitation = () => {
    const { language } = useParams();

    return (
        <div className="section-container">
            <div
                className="background-container"
                style={{ backgroundImage: `url(${backgroundImg})` }}
            >
                <div className="overlay"></div>
                <h1>
                    {language === "en"
                        ? "Atmospheric Precipitation"
                        : "ატმოსფერული ნალექები"}
                </h1>
                <h2>
                    {language === "en"
                        ? "Rain and snow distribution, droughts and extreme events across Georgia"
                        : "წვიმისა და თოვლის განაწილება, გვალვები და ექსტრემალური მოვლენები საქართველოს მასშტაბით"}
                </h2>
            </div>

            <div
                className="chart-wrapper"
                style={{ width: "min(1100px, 100%)", maxWidth: "1200px" }}
            >
                <PrecipitationChartContainer />
                <DeviationChartsPage />
                <MinMaxChartPage />
                <MultiLineChartPage/>
                <DonutChartPage />
                <ExtremeYearsPage/>
                <MonthlyRange2022Chart/>
                <ScatterPlotPage/>
                <ExtremeTrendPage/>
                <RadialChartPage/>
                <PrecipitationHeatmap/>
                <TablePage/>
            </div>
        </div>
    );
};

export default Precipitation;
