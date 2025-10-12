import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";

const Inventorization = () => {
  const { language } = useParams();

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundPosition: "center 65%",
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en"
            ? "National Forest Inventory"
            : "ტყის ეროვნული ინვენტარიზაცია"}
        </h1>
        <h2>
          {" "}
          {language === "en"
            ? "Statistics on forest cover and forest use trends"
            : "ტყის საფარის და ტყითსარგებლობის ტენდენციების სტატისტიკა"}{" "}
        </h2>
      </div>
    </div>
  );
};

export default Inventorization;
