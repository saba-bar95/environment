import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";

const Emissions = () => {
  const { language } = useParams();

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundPosition: "center 40%",
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en"
            ? "Greenhouse Gas Emissions in Georgia"
            : "სათბურის აირების გაფრქვევები საქართველოში"}
        </h1>
        <h2>
          {" "}
          {language === "en"
            ? "Interactive dashboard of emissions for the period from 2000 to 2017"
            : "გაფრქვევების ინტერაქტიული პანელი 2000-დან 2017 წლამდე პერიოდისთვის"}{" "}
        </h2>
      </div>
    </div>
  );
};

export default Emissions;
