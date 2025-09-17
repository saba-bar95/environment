import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";

const Precipitation = () => {
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
            ? "Atmospheric Precipitation"
            : "ატმოსფერული ნალექები"}
        </h1>
        <h2>
          {" "}
          {language === "en"
            ? "Rain and snow distribution, droughts and extreme events across Georgia"
            : "წვიმისა და თოვლის განაწილება, გვალვები და ექსტრემალური მოვლენები საქართველოს მასშტაბით"}{" "}
        </h2>
      </div>
    </div>
  );
};

export default Precipitation;
