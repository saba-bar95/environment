import { useParams } from "react-router-dom";
import { useState } from "react";
import Sections from "./Sections/Sections";
import "./Section.scss";
import LongArrow from "./Svgs/LongArrow";
import ShortArrow from "./Svgs/ShortArrow";
import { Link } from "react-router-dom";

const Section = () => {
  const { language } = useParams();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="section">
      {Sections.map((section, i) => (
        <Link to={`/${language}/${section.href}`} key={i}>
          <div
            className="section-wrapper"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}>
            <div className="left">
              <h1>{section.text[language].header1}</h1>
              <p>{section.text[language].header2}</p>
              <p className="arrow-wrapper">
                {language === "en" ? "Show" : "ნახვა"}
                <span
                  className={`arrow ${hoveredIndex === i ? "long" : "short"}`}>
                  {hoveredIndex === i ? <LongArrow /> : <ShortArrow />}
                </span>
              </p>
            </div>
            <div
              className="right"
              style={{ backgroundImage: `url(${section.background})` }}></div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Section;
