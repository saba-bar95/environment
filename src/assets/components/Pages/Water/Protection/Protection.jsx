import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";

const Protection = () => {
  const { language } = useParams();

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundPosition: "center 45%",
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en"
            ? "Trends in Water Abstraction from Natural Sources in Georgia (2017-2023)"
            : "ბუნებრივი ობიექტებიდან წყლის აღების ტრენდები საქათველოში (2017-2023)"}
        </h1>
      </div>
    </div>
  );
};

export default Protection;
