import { useParams } from "react-router-dom";
import Svg1 from "./Svgs/Svg1";
import Svg2 from "./Svgs/Svg2";
import Svg3 from "./Svgs/Svg3";
import "./Header.scss";

const Header = () => {
  const { language } = useParams();

  const info = [
    {
      title_ge: "დაცული ტერიტორიების წილი",
      title_en: "Share of protected areas",
      number: "13.3%",
      backgroundColor: "#006370",
      svg: Svg1, // Reference the component directly, don't call it
    },
    {
      title_ge: "დაცული ტერიტორიების რაოდენობა",
      title_en: "Number of protected areas",
      number: 100,
      backgroundColor: "#417B5D",
      svg: Svg2,
    },
    {
      title_ge: "დაცული ტერიტორიების ფართობი",
      title_en: "Area of ​​protected areas",
      number: 912884,
      backgroundColor: "#494E70",
      unit_ge: "ჰა",
      unit_en: "ha",
      svg: Svg3,
    },
  ];

  return (
    <div className="header-container">
      <div className="protected-header">
        {info.map((el, i) => {
          const SVGComponent = el.svg; // Store the SVG component
          return (
            <div
              key={i} // Consider using a more unique key if possible
              className="info-wrapper"
              style={{ backgroundColor: el.backgroundColor }}>
              <div className="top">
                <SVGComponent
                  className="svg-icon"
                  text={language === "en" ? "m²" : "მ²"} // Pass language-specific text
                  language={language} // Pass language prop
                />{" "}
                {/* Render the SVG component */}
                <h1>{el[`title_${language}`]}</h1>{" "}
              </div>
              <div className="bottom">
                <h2>
                  {typeof el.number === "number"
                    ? el.number.toLocaleString("ka-GE").replace(/,/g, " ")
                    : el.number}
                </h2>

                <p>{el[`unit_${language}`] || ""}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
