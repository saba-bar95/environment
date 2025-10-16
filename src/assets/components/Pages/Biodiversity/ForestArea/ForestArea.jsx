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
        <h1>{language === "en" ? "Forest" : "საქართველოს ტყე"}</h1>
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
            const link = child[`link_${language}`];
            const content = (
              <div className="child-wrapper">
                <div className="child-background-container">
                  <div
                    className="child-background-inner"
                    style={{
                      backgroundImage: `url(${child.background})`,
                    }}></div>
                </div>
                <div
                  className="text"
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "20px",
                  }}>
                  <h1>{child.text[language].header1}</h1>

                  {child.text[language].header2 && (
                    <h2>{child.text[language].header2}</h2>
                  )}
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
              </div>
            );

            return link ? (
              <a key={i} href={link} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              <Link key={i} to={`/${language}/${child.href}`}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ForestArea;
