import { Link, useParams } from "react-router-dom";
import "./Navigation.scss";
import { useEffect, useState, useRef } from "react";
import Open from "./Svgs/Open";
import Close from "./Svgs/Close";
import sections from "./sections/sections";
import UpVector from "./Svgs/UpVector";

const Navigation = () => {
  const { language } = useParams();
  const [hoveredSectionId, setHoveredSectionId] = useState(null);
  const ulRef = useRef(null);
  const [width, setWidth] = useState(window.innerWidth);

  const handleMouseEnter = (id) => {
    setHoveredSectionId(id);
    if (ulRef.current && width < 769 && id) {
      ulRef.current.style.overflowX = "clip"; // Only clip on mobile when hovering section with links
    }
  };

  const handleMouseLeave = () => {
    setHoveredSectionId(null);
    if (ulRef.current && width < 769) {
      ulRef.current.style.overflowX = "scroll"; // Only scroll on mobile
    }
  };

  const handleLinkClick = () => {
    setHoveredSectionId(null); // Hide dropdown on link click
  };

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      // Reset overflow-x based on width
      if (ulRef.current) {
        ulRef.current.style.overflowX = newWidth < 769 ? "scroll" : "visible";
      }
    };

    window.addEventListener("resize", handleResize);
    // Set initial overflow-x based on current width
    if (ulRef.current) {
      ulRef.current.style.overflowX = width < 769 ? "scroll" : "visible";
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  return (
    <div className="navigation-container">
      <nav>
        <ul ref={ulRef}>
          {sections.map((section) => (
            <li
              key={section.id}
              className={!section.links ? "no-sub-links" : ""}
              onMouseEnter={() => handleMouseEnter(section.id)}
              onMouseLeave={handleMouseLeave}>
              <div className="nav-item-wrapper">
                {!section.links ? (
                  <Link to={`/${language}/${section.href}`} className="link">
                    {section[`name_${language}`]}
                  </Link>
                ) : (
                  <div className="nav-item-content">
                    <span className="link-span">
                      {section[`name_${language}`]}
                    </span>
                    <span
                      className={`icon-wrapper ${
                        hoveredSectionId === section.id
                          ? "close-icon"
                          : "open-icon"
                      }`}>
                      {hoveredSectionId === section.id ? <Close /> : <Open />}
                    </span>
                  </div>
                )}
                {section.links && hoveredSectionId === section.id && (
                  <div
                    className={`dropdown-container ${
                      hoveredSectionId === section.id ? "visible" : ""
                    }`}>
                    <UpVector />
                    <div className="dropdown-content">
                      {section.links.map((subLink, index) => (
                        <Link
                          to={`/${language}/${section.href}/${subLink.link}`}
                          key={index}
                          onClick={handleLinkClick}>
                          <div className="links-wrapper">
                            {subLink.svg && <subLink.svg />}
                            {subLink[`header_${language}`]}
                          </div>
                        </Link>
                      ))}
                    </div>
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
