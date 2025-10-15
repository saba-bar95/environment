import "../../../../../../Download/Download.scss";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import downloadPNG from "../../../../../../Download/downloadPNG";
import downloadJPG from "../../../../../../Download/downloadJPG";
import downloadExcel from "./downloadExcel";
import downloadPDF from "./downloadPDF";
import Dots from "../../../../../../Download/Svgs/Dots";
import Excel from "../../../../../../Download/Svgs/Excel";
import PDF from "../../../../../../Download/Svgs/PDF";
import JPG from "../../../../../../Download/Svgs/JPG";
import PNG from "../../../../../../Download/Svgs/PNG";

const Download = ({ data, filename, year }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null); // Create a ref for the dropdown
  const { language } = useParams();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".svg-container")) {
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selected = open ? "selected" : "";

  return (
    <div className="download-container">
      <div
        className={`svg-container ${selected}`} // Apply the selected class conditionally
        onClick={(event) => {
          event.stopPropagation();
          handleToggle();
        }}>
        <Dots />
      </div>
      {open && (
        <div className="dropdown-content" ref={dropdownRef}>
          <div className="upper">
            <div
              className="wrapper"
              onClick={() => {
                downloadExcel(data, filename, year, language);
                setOpen(false); // Close dropdown
              }}>
              <Excel />
              <p>Excel</p>
            </div>
            <div
              className="wrapper"
              onClick={() => {
                downloadPDF(data, filename, year, language);
                setOpen(false); // Close dropdown
              }}>
              <PDF />
              <p>PDF</p>
            </div>
          </div>
          <div className="divider"></div>
          <div className="lower">
            <div
              className="wrapper"
              onClick={(e) => {
                downloadJPG(e);
                setOpen(false); // Close dropdown
              }}>
              <JPG />
              <p>JPG</p>
            </div>
            <div
              className="wrapper"
              onClick={(e) => {
                downloadPNG(e);
                setOpen(false); // Close dropdown
              }}>
              <PNG />
              <p>PNG</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Download;
