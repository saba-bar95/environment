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
  const hideTimeoutRef = useRef(null); // Ref to store timeout

  const handleMouseEnter = (id) => {
    clearTimeout(hideTimeoutRef.current); // Cancel any pending hide
    setHoveredSectionId(id);
    if (ulRef.current && width < 769 && id) {
      ulRef.current.style.overflowX = "clip";
    }
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredSectionId(null);
      if (ulRef.current && width < 769) {
        ulRef.current.style.overflowX = "scroll";
      }
    }, 1000); // Delay for 1 second
  };

  const handleLinkClick = () => {
    clearTimeout(hideTimeoutRef.current); // Cancel hide if link is clicked
    setHoveredSectionId(null);
  };

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      if (ulRef.current) {
        ulRef.current.style.overflowX = newWidth < 769 ? "scroll" : "visible";
      }
    };

    window.addEventListener("resize", handleResize);
    if (ulRef.current) {
      ulRef.current.style.overflowX = width < 769 ? "scroll" : "visible";
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(hideTimeoutRef.current); // Clean up timeout
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
