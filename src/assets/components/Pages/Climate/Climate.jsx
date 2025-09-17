import { useParams, Link } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import Children from "./Children/Children";
import Arrow from "./Svg/Arrow";

const Climate = () => {
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
            ? "Water and Biodiversity"
            : "წყლის რესურსები და გამოყენება"}
        </h1>
        <h2>
          {" "}
          {language === "en"
            ? "Georgia's water supply, household water consumption, wastewater treatment and water losses"
            : "საქართველოს წყალმომარაგება, შინამეურნეობების მიერ წყლის მოხმარება, ჩამდინარე წყლების გაწმენდა და წყლის დანაკარგები"}{" "}
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

export default Climate;
