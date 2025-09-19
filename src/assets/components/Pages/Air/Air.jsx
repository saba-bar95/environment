import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import Chart1 from "./Charts/Chart1/Chart1";
import Chart2 from "./Charts/Chart2/Chart2";
import Chart3 from "./Charts/Chart3/Chart3";

const Air = () => {
  const { language } = useParams();

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en"
            ? "Air Quality and Emissions"
            : "ჰაერის ხარისხი და გაფრქვევები"}
        </h1>
        <h2>
          {" "}
          {language === "en"
            ? "Latest trends in air pollution, emissions and urban air quality in Georgia"
            : "ჰაერის დაბინძურების, გაფრქვევებისა და ქალაქებში ჰაერის ხარისხის უახლესი ტენდენციები საქართველოში"}{" "}
        </h2>
      </div>
      <div className="charts-section">
        <div className="chart-container">
          <Chart1 />
          <Chart2 />
          <Chart3 />
        </div>
      </div>
    </div>
  );
};

export default Air;
