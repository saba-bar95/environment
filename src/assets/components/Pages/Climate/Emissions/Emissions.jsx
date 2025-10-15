// file: 'src/assets/components/Pages/Climate/Emissions/Emissions.jsx'
import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import GasEmissionsCard from "./GasEmissionsPage.jsx";
import RangeChartPage from "./RangeChartPage.jsx";
import SectorDonutPage from "./SectorDonutPage.jsx";
import IntensityChartPage from "./IntensityChartPage.jsx";
import StackedChartPage from "./StackedChartPage.jsx";
import EnergyChartPage from "./EnergyChartPage.jsx";
import LulucfChartPage from "./LulucfChartPage.jsx";
import GdpScatterPage from "./GdpScatterPage.jsx";
import HfcScatterPage from "./HfcScatterPage.jsx";
import IndexChartPage from "./IndexChartPage.jsx";
import PercentageChartPage from "./PercentageChartPage.jsx";

const Emissions = () => {
  const { language } = useParams();

  return (
    <div className="section-container emissions">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundPosition: "center 40%",
        }}>
        <div className="overlay"></div>
        <h1>
          {language === "en"
            ? "Greenhouse Gas Emissions in Georgia"
            : "სათბურის აირების გაფრქვევები საქართველოში"}
        </h1>
        <h2>
          {language === "en"
            ? "Interactive dashboard of emissions for the period from 2000 to 2017"
            : "გაფრქვევების ინტერაქტიული პანელი 2000-დან 2017 წლამდე პერიოდისთვის"}
        </h2>
      </div>

      <div className="charts-section">
        <div className="charts-grid">
          <GasEmissionsCard />
          <RangeChartPage />
          <SectorDonutPage />
          <IntensityChartPage />
          <StackedChartPage />
          <EnergyChartPage />
          <LulucfChartPage />
          <GdpScatterPage />
          <HfcScatterPage />
          <IndexChartPage />
          <PercentageChartPage />
        </div>
      </div>
    </div>
  );
};

export default Emissions;
