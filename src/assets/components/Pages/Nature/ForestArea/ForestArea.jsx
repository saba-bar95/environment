import { useParams, Link } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import Arrow from "./Svg/Arrow";
import Children from "./Children/Children";

const ForestArea = () => {
  const { language } = useParams();

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>{language === "en" ? "Forest Area" : "ტყის ფართობი"}</h1>
        <h2>
          {" "}
          {language === "en"
            ? "Statistics on forest cover and forest use trends"
            : "ტყის საფარის და ტყითსარგებლობის ტენდენციების სტატისტიკა"}{" "}
        </h2>
      </div>

      <div className="children-container">
        <div className="wrapper">
          {Children.map((child, i) => {
            return (
              <Link key={i} to={`/${language}/${child.href}`}>
                <div className="child-wrapper">
                  <div className="child-background-container">
                    <div
                      className="child-background-inner"
                      style={{
                        backgroundImage: `url(${child.background})`,
                      }}></div>
                  </div>

                  <h1>{child.text[language].header1}</h1>
                  <h2>{child.text[language].header2}</h2>
                  <div>
                    <p>
                      {language === "en" ? "View in detail" : "დეტალურად ნახვა"}{" "}
                      <span>
                        {" "}
                        <Arrow />{" "}
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ForestArea;
