import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";

const Temperature = () => {
  const { language } = useParams();

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>{language === "en" ? "Air Temperature" : "ჰაერის ტემპერატურა"}</h1>
        <h2>
          {" "}
          {language === "en"
            ? "Annual and seasonal temperature trends compared to historical baselines"
            : "წლიური და სეზონური ტემპერატურის ტენდენციები ისტორიულ საბაზისო მაჩვენებლებთან შედარებით"}{" "}
        </h2>
      </div>
    </div>
  );
};

export default Temperature;
