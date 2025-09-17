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
          backgroundPosition: "center 50%",
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en"
            ? "Other Environmental Topics"
            : "სხვა გარემოსდაცვითი თემები"}
        </h1>
      </div>
    </div>
  );
};

export default Waste;
