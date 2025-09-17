import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";

const SupplyAndLosses = () => {
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
            ? "Water Supply, Losses and Household Water Consumption"
            : "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება"}
        </h1>
      </div>
    </div>
  );
};

export default SupplyAndLosses;
