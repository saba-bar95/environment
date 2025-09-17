import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";

const Reports = () => {
  const { language } = useParams();

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "auto",
          backgroundPosition: "center 30%",
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en"
            ? "Material Flow Accounts"
            : "მატერიალური ნაკადის ანგარიშები"}
        </h1>
        <h2>
          {" "}
          {language === "en"
            ? "Trends in Georgia's material resources, consumption and trade in 2014-2023"
            : "საქართველოს მატერიალური რესურსების, მოხმარებისა და ვაჭრობის ტენდენციები 2014-2023 წლებში"}{" "}
        </h2>
      </div>
    </div>
  );
};

export default Reports;
