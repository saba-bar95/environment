import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SakstatLogoGeo from "./Svgs/SakstatLogoGeo";
import sakstatLogoEn from "/src/assets/images/sakstat-logo-en.png";
import Socials from "../Socials/Socials";
import LanguageChanger from "../LanguageChanger/LanguageChanger";
import "./Header.scss";
import Navigation from "./Navigaton/Navigation";
import Text from "./Svgs/Text";
import { useState, useEffect } from "react";
import SearchBar from "../SearchBar.jsx/SearchBar";

const Header = () => {
  const { language } = useParams();
  const [isSticky, setIsSticky] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleHeaderClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      easing: "ease-in-out",
    });
  };

  const isEnglish = language === "en";

  useEffect(() => {
    const SCROLL_THRESHOLD = 25; // Change this value to adjust sensitivity (e.g., 80, 120)
    let scrollBuffer = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        // Scrolling UP
        const scrolledUp = lastScrollY - currentScrollY;
        scrollBuffer += scrolledUp;

        if (scrollBuffer >= SCROLL_THRESHOLD) {
          setIsSticky(true);
        }
      } else {
        // Scrolling DOWN
        setIsSticky(false);
        scrollBuffer = 0; // Reset buffer when going down
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header className={isSticky ? "sticky-header" : ""}>
        <div className="header-container">
          <div className="right">
            <Link to={`/${language}`}>
              {!isEnglish ? (
                <SakstatLogoGeo />
              ) : (
                <img
                  src={sakstatLogoEn}
                  alt="sakstat-logo"
                  onClick={handleHeaderClick}
                  style={{ cursor: "pointer", maxWidth: "110px" }}
                  className="english-img"
                />
              )}
            </Link>
            {isEnglish ? <h1>Environmental Statistics Portal</h1> : <Text />}
          </div>
          <SearchBar />
          <div className="left">
            <div className="socials">
              <Socials />
              <LanguageChanger />
            </div>
          </div>
        </div>
        <Navigation />
      </header>
    </>
  );
};

export default Header;
