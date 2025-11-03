import { Link, useParams } from "react-router-dom"; // Remove useNavigate if not needed as fallback
import "./Navigation.scss";
import { useEffect, useState, useRef } from "react";
import Open from "./Svgs/Open";
import Close from "./Svgs/Close";
import sections from "./sections/sections";
import UpVector from "./Svgs/UpVector";
import Burger from "./Svgs/Burger";
import "./MobileNav.scss";

const Navigation = () => {
  const { language } = useParams();
  const [hoveredSectionId, setHoveredSectionId] = useState(null);
  const ulRef = useRef(null);
  const [width, setWidth] = useState(window.innerWidth);
  const hideTimeoutRef = useRef(null); // Ref to store timeout
  const [isopen, setIsopen] = useState(false);
  const mobileMenuRef = useRef(null); // Ref for outside click detection
  const [expandedSectionId, setExpandedSectionId] = useState(null); // Track expanded mobile section

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
    }, 500); // Delay for 500ms
  };

  const handleLinkClick = () => {
    clearTimeout(hideTimeoutRef.current); // Cancel hide if link is clicked
    setHoveredSectionId(null);
  };

  const handleBurgerClick = () => {
    setIsopen((prev) => {
      const willOpen = !prev;
      return willOpen;
    });
  };

  // Toggle sub-menu for mobile
  const toggleMobileSubMenu = (id, event) => {
    event.stopPropagation(); // Prevent bubbling to parent clicks
    setExpandedSectionId((prev) => (prev === id ? null : id));
  };

  // Effect for window resize and initial setup
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
  }, [width, isopen]);

  return (
    <div className="navigation-container">
      <nav>
        {width > 768 && (
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
                        {hoveredSectionId === section.id ? (
                          <Close color="#ffffff" />
                        ) : (
                          <Open color="#ffffff" />
                        )}
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
        )}

        {width < 769 && (
          <div className="mobile-un">
            <div className="mobile-un-container" onClick={handleBurgerClick}>
              <Burger />
              {isopen && (
                <div className="mobile-dropdown-content" ref={mobileMenuRef}>
                  <ul className="mobile-menu-list">
                    {sections.map((section) => {
                      const isExpanded = expandedSectionId === section.id;

                      return (
                        <li key={section.id} className="mobile-section-item">
                          {!section.links ? (
                            <Link
                              to={`/${language}/${section.href}`}
                              className="mobile-link">
                              {section[`name_${language}`]}
                            </Link>
                          ) : (
                            <div
                              className="mobile-section-header"
                              onClick={(e) => {
                                if (!e.target.closest(".mobile-toggle")) {
                                  toggleMobileSubMenu(section.id, e);
                                }
                              }}>
                              <span className="mobile-link">
                                {section[`name_${language}`]}
                              </span>
                              <button
                                className={`mobile-toggle icon-wrapper ${
                                  isExpanded ? "close-icon" : "open-icon"
                                }`}
                                onClick={(e) =>
                                  toggleMobileSubMenu(section.id, e)
                                }
                                type="button">
                                {isExpanded ? (
                                  <Close color="#333333" />
                                ) : (
                                  <Open color="#333333" />
                                )}
                              </button>
                            </div>
                          )}

                          {section.links && isExpanded && (
                            <ul className="mobile-sub-links">
                              {section.links.map((subLink, index) => (
                                <li key={subLink.link || index}>
                                  <Link
                                    to={`/${language}/${section.href}/${subLink.link}`}
                                    className="mobile-sub-link">
                                    <div className="sub-link-wrapper">
                                      {subLink.svg && <subLink.svg />}
                                      {subLink[`header_${language}`]}
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navigation;
