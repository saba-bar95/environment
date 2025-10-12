import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";

const Timber = () => {
  const { language } = useParams();

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundPosition: "center 60%",
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en"
            ? "Import and Export of Unprocessed Timber"
            : "დაუმუშავებელი მერქნის იმპორტი და ექსპორტი"}
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

export default Timber;
