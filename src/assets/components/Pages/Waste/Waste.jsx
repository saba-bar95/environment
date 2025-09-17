import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";

const Waste = () => {
  const { language } = useParams();

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundPosition: "center 29%",
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en" ? "Municipal Waste" : "მუნიციპალური ნარჩენები"}
        </h1>
        <h2>
          {" "}
          {language === "en"
            ? "Waste Management Trends in Georgia"
            : "საქართველოში ნარჩენების მართვის ტენდენციები"}{" "}
        </h2>
      </div>
    </div>
  );
};

export default Waste;
