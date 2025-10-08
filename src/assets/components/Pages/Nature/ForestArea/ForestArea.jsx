import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import Charts from "../../../../../Charts";
import Chart1 from "./Charts/Chart1/Chart1";



const ForestArea = () => {
  const { language } = useParams();

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>{language === "en" ? "Forest Area" : "ტყის ფართობი"}</h1>
        <h2>
          {" "}
          {language === "en"
            ? "Statistics on forest cover and forest use trends"
            : "ტყის საფარის და ტყითსარგებლობის ტენდენციების სტატისტიკა"}{" "}
        </h2>
      </div>
      <div className="charts-section">
        <div className="chart-container">
          <Chart1 chartInfo={Charts.nature[0].forestarea[0]} />
        </div>
      </div>
    </div>
  );
};

export default ForestArea;
