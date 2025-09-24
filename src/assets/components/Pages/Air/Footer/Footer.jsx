import { useParams } from "react-router-dom";
import "./Footer.scss";
import backgroundImg from "./Background/background.jpg";
import links from "./links";
import GreenArrow from "./Svgs/GreenArrow";

const Footer = () => {
  const { language } = useParams();

  const handleButtonClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="air-footer">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
        }}>
        <div className="overlay"></div>

        <h1> {language === "en" ? "useful links" : "სასარგებლო ბმულები"} </h1>
        <div className="links-wrapper">
          {links.map((el) => (
            <div className="link" key={el.link}>
              <div
                className="img-wrapper"
                style={{ backgroundColor: el.backgroundColor }}>
                <img src={el.background} />
              </div>
              <h3>{el[`name_${language}`]}</h3>
              <button onClick={() => handleButtonClick(el.link)}>
                {language === "en" ? "Open" : "გადასვლა"} <GreenArrow />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
