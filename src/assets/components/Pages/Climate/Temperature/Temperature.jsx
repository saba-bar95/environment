import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";

const Temperature = () => {
  const { language } = useParams();

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{ backgroundImage: `url(${backgroundImg})` }}>
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
    </div>
  );
};

export default Temperature;
