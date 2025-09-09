import { Link, useParams } from "react-router-dom";
import "./Navigation.scss";
import { useState } from "react";
import Open from "./Svgs/Open";
import Close from "./Svgs/Close";
import sections from "./sections/sections";

const Navigation = () => {
  const { language } = useParams();
  const [hoveredSectionId, setHoveredSectionId] = useState(null);

  const handleMouseEnter = (id) => {
    setHoveredSectionId(id);
  };

  const handleMouseLeave = () => {
    setHoveredSectionId(null);
  };

  return (
    <div className="navigation-container">
      <nav>
        <ul>
          {sections.map((section) => (
            <li
              key={section.id}
              className={!section.links ? "no-sub-links" : ""}
              onMouseEnter={() => handleMouseEnter(section.id)}
              onMouseLeave={handleMouseLeave}>
              <div className="nav-item-wrapper">
                {!section.links ? (
                  <Link to={`/${language}/${section.href}`}>
                    {section[`name_${language}`]}
                  </Link>
                ) : (
                  <div className="nav-item-content">
                    <span>{section[`name_${language}`]}</span>
                    {hoveredSectionId === section.id ? <Close /> : <Open />}
                  </div>
                )}
                {section.links && hoveredSectionId === section.id && (
                  <div
                    className={`dropdown-container ${
                      hoveredSectionId === section.id ? "visible" : ""
                    }`}>
                    {section.links.map((subLink, index) => (
                      <Link
                        to={`/${language}/${section.href}/${subLink.link}`}
                        key={index}>
                        <div className="links-wrapper">
                          {subLink.svg && <subLink.svg />}
                          {subLink[`header_${language}`]}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
