import { useState, useRef, useEffect } from "react";
import "./YearDropdown.scss";
import Calendar from "./Svgs/Calendar";
import DownArrow from "./Svgs/DownArrow";
import UpArrow from "./Svgs/UpArrow";
import GreenArrow from "./Svgs/GreenArrow";
import Frame from "./Svgs/Frame";

const YearDropdown = ({ years, year, setYear }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null); // Create a ref for the dropdown
  const [selectedYear, setSelectedYear] = useState(year); // Track the selected year

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    if (open) {
      const selectedElement =
        dropdownRef.current.querySelector(`.wrapper.selected`);
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "center", // Align the selected element in the center of the dropdown
        });
      }
    }
  }, [open, selectedYear]);

  return (
    <div className="years-container">
      <div
        className="heading"
        onClick={() => {
          handleToggle();
        }}>
        <Calendar />
        <h3>{year}</h3>

        {!open && <DownArrow />}
        {open && <UpArrow />}
      </div>

      {open && (
        <div className="dropdown-content" ref={dropdownRef}>
          {years && years.length > 0 && years
            .slice()
            .reverse()
            .map(
              (
                year,
                i // Reverse the years array
              ) => (
                <div
                  className={`wrapper ${
                    selectedYear === +year ? "selected" : ""
                  }`} // Add selected class
                  key={i}
                  onClick={() => {
                    setYear(+year);
                    setSelectedYear(+year); // Set the selected year
                    setOpen(false);
                  }}>
                  {selectedYear === +year ? <GreenArrow /> : <Frame />}
                  <p>{year}</p>
                </div>
              )
            )}
        </div>
      )}
    </div>
  );
};

export default YearDropdown;
