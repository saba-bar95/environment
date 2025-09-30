import { useState } from "react";
import "./Slider.scss";
import { useParams } from "react-router-dom";
import Slides from "./Slides/Slides";
import Left from "./Svgs/Left";
import Right from "./Svgs/Right";
import Rise from "./Svgs/Rise";
import Arrow from "./Svgs/Arrow";
import AnimatedNumber from "./AnimatedNumber";
import { Link } from "react-router-dom";

const Slider = () => {
  const { language } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(Slides[0]);
  const [slideDirection, setSlideDirection] = useState(""); // Track slide direction

  const nextSlide = () => {
    setSlideDirection("right"); // Set direction for next slide
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % Slides.length;
      setCurrentSlide(Slides[newIndex]);
      return newIndex;
    });
  };

  const prevSlide = () => {
    setSlideDirection("left"); // Set direction for previous slide
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? Slides.length - 1 : prevIndex - 1;
      setCurrentSlide(Slides[newIndex]);
      return newIndex;
    });
  };

  const handleDotClick = (index) => {
    // Determine direction based on whether index is higher or lower
    setSlideDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
    setCurrentSlide(Slides[index]);
  };

  const slideContents = Slides.map((slide, index) => (
    <div
      className={`slide-content ${
        currentIndex === index ? "active" : ""
      } slide-${slideDirection}`}
      key={index}>
      <h2>{slide.text[language].header}</h2>
      <div className="stats">
        <div
          className="left"
          style={{ backgroundImage: `url(${slide.background2})` }}></div>
        <div className="right">
          <div className="top">
            <span className="number-1">
              <AnimatedNumber
                targetValue={slide.text[language].number1}
                duration={1000}
              />
              {slide.text[language].unit2 && slide.text[language].unit2}
            </span>
            <span className="unit">{slide.text[language].unit1}</span>
          </div>
          <div className="bot">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Rise />
              <span className="number">{slide.text[language].number2}</span>
            </div>
            <span className="para">{slide.text[language].para}</span>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="slider">
      <div
        className={`slider-container ${
          currentIndex === 3 ? "third-slide" : ""
        }`}
        style={{ "--background-image": `url(${currentSlide.background1})` }}>
        <div className="dark-layer" />
        <div className="content-container" key={currentIndex}>
          {slideContents}
        </div>
        <div className="bot-side">
          <div className="right">
            <div className="slide">
              <Link to={`/${language}/${currentSlide.href}`}>
                <button>
                  {language === "en" ? "Learn more" : "გაიგე მეტი"}
                  <Arrow />
                </button>
              </Link>
            </div>
          </div>
          <div className="left">
            <div className="dots">
              {Slides.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${currentIndex === index ? "active" : ""}`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
            <div className="navigation">
              <button
                onClick={prevSlide}
                className={currentIndex === 0 ? "disabled" : ""}
                disabled={currentIndex === 0}>
                <Left />
              </button>
              <button
                onClick={nextSlide}
                className={currentIndex === Slides.length - 1 ? "disabled" : ""}
                disabled={currentIndex === Slides.length - 1}>
                <Right />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
