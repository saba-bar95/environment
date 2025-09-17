import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";

const Transport = () => {
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
            ? "Transport Statistics"
            : "ტრანსპორტის სტატისტიკა"}
        </h1>
        <h2>
          {" "}
          {language === "en"
            ? "Monitoring of Georgia's passenger and freight transport trends, fleet development and energy efficiency"
            : "საქართველოს სამგზავრო და სატვირთო ტრანსპორტის ტენდენციების, ავტოპარკის განვითარებისა და ენერგოეფექტურობის მონიტორინგი"}{" "}
        </h2>
      </div>
    </div>
  );
};

export default Transport;
