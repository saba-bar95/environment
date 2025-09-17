import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";

const Majors = () => {
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
            ? "Main Rivers and Lakes of Georgia"
            : "საქართველოს მთავარი მდინარეები და ტბები"}
        </h1>
        <h2>
          {" "}
          {language === "en"
            ? "Interactive visualization of Georgia's water resources"
            : "ინტერაქტიული ვიზუალიზაცია საქართველოს წყლის რესურსების შესახებ"}{" "}
        </h2>
      </div>
    </div>
  );
};

export default Majors;
