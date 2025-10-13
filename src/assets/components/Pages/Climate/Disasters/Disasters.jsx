import { useParams } from "react-router-dom";
import NaturalDisastersChart from "./NaturalDisastersChart";
import "./Disasters.scss";
import backgroundImg from "./Background/background.jpg";
import HydrometeorologicalHazardsChart from "./HydrometeorologicalHazardsChart.jsx";
import GeologicalPhenomenaChart from "./GeologicalPhenomena.jsx";
import HydroChartContainer from "./HydroChartContainer.jsx";
import RadarChartContainer from "./RadarChartContainer.jsx";
import HazardTotalsContainer from "./HazardTotalsContainer.jsx";
import CombinedTrendsContainer from "./CombinedTrendsContainer.jsx";
import ScatterChartContainer from "./ScatterChartContainer.jsx";
import DonutChartContainer from "./DonutChartContainer.jsx";

const Disasters = () => {
    const { language } = useParams();

    return (
        <div className="disasters-page">
            <div
                className="background-container"
                style={{ backgroundImage: `url(${backgroundImg})` }}
            >
                <div className="overlay"></div>
                <h1>
                    {language === "en"
                        ? "Natural Disasters in Georgia"
                        : "სტიქიური მოვლენები საქართველოში"}
                </h1>
                <h2>
                    {language === "en"
                        ? "Trends in geological and hydrometeorological events"
                        : "გეოლოგიური და ჰიდრომეტეოროლოგიური მოვლენების ტენდენციები"}
                </h2>
            </div>

            <div className="chart-section">
                <NaturalDisastersChart language={language} />
                <HydrometeorologicalHazardsChart language={language} />
                <GeologicalPhenomenaChart language={language} />
                <HydroChartContainer language={language} />
                <RadarChartContainer language={language} />
                <HazardTotalsContainer language={language} />
                <CombinedTrendsContainer language={language} />
                <ScatterChartContainer language={language} />
                <DonutChartContainer language={language} />
            </div>
        </div>
    );
};

export default Disasters;
