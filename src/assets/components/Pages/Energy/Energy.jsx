import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";

const Energy = () => {
  const { language } = useParams();

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundPosition: "center 77%",
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en"
            ? "Environmental Performance of Georgian Pnergy Sector"
            : "საქართველოს ენერგეტიკის გარემოსდაცვითი მაჩვენებლები"}
        </h1>
      </div>
    </div>
  );
};

export default Energy;
