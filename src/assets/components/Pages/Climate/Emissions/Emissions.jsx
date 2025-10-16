import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";

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
      </div>
    </div>
  );
};

export default Emissions;
