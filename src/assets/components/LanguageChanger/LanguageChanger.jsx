import { useEffect, useState, useRef } from "react";
import UpVectorGray from "./Svgs/UpVectorGray";
import DownVectorGray from "./Svgs/DownVectorGray";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./LanguageChanger.scss";

const text = {
  ge: {
    language: "ქართული",
  },

  en: {
    language: "English",
  },
};

const LanguageChanger = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [language, setLanguage] = useState(params.language);
  const wrapperRef = useRef(null);
  const [width, setWidth] = useState(0);

  const handleLanguageChange = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };

  const toggleLanguage = () => {
    const newLanguage = language === "ge" ? "en" : "ge";
    setLanguage(newLanguage);
    setIsLanguageOpen(false);

    // Preserve current path and update only the language
    const currentPath = location.pathname.split("/").slice(2).join("/");
    navigate(`/${newLanguage}/${currentPath}`);
  };

  useEffect(() => {
    setLanguage(params.language);
  }, [params.language]);

  useEffect(() => {
    if (wrapperRef.current) {
      const width = wrapperRef.current.getBoundingClientRect().width;
      setWidth(width);
    }
  }, [isLanguageOpen]); // Ensures the width updates when the menu opens/closes

  return (
    <div
      className="language-changer-container"
      onClick={handleLanguageChange}
      style={{ marginRight: width }}>
      <div
        className="language-changer"
        style={{ top: isLanguageOpen ? "-50%" : "" }}>
        <div className="wrapper" ref={wrapperRef}>
          {language === "ge" ? (
            <span className="fi fi-ge"></span>
          ) : (
            <span className="fi fi-gb"></span>
          )}
          <p>{text[language].language}</p>
          {isLanguageOpen ? <DownVectorGray /> : <UpVectorGray />}
        </div>
        {isLanguageOpen && (
          <div className="language-options">
            <div className="wrapper hovered" onClick={toggleLanguage}>
              {language === "en" ? (
                <span className="fi fi-ge"></span>
              ) : (
                <span className="fi fi-gb"></span>
              )}
              <p>
                {language === "ge" ? text["en"].language : text["ge"].language}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageChanger;
