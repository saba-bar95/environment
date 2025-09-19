import "./Download.scss";
import { useState, useRef, useEffect } from "react";
import downloadPNG from "./downloadPNG";
import downloadJPG from "./downloadJPG";
import downloadExcel from "./downloadExcel";
import downloadPDF from "./downloadPDF";
import { useParams } from "react-router-dom";

const Download = ({
  isTreeMap,
  data,
  filename,
  unit,
  year,
  isMonth,
  resource,
  isFilter,
  isSankey,
  isConditioning,
  isFiltered,
  twoFixed,
}) => {
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
        <svg
          width="36"
          height="32"
          viewBox="0 0 36 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <rect
            x="0.5"
            y="0.5"
            width="35"
            height="31"
            rx="11.5"
            stroke="#E0E0E0"
          />
          <ellipse
            cx="10.9565"
            cy="16"
            rx="2"
            ry="1.95652"
            transform="rotate(-90 10.9565 16)"
            fill="#878787"
          />
          <ellipse
            cx="17.9995"
            cy="16"
            rx="2"
            ry="1.95652"
            transform="rotate(-90 17.9995 16)"
            fill="#878787"
          />
          <ellipse
            cx="25.0434"
            cy="16"
            rx="2"
            ry="1.95652"
            transform="rotate(-90 25.0434 16)"
            fill="#878787"
          />
        </svg>
      </div>
      {open && (
        <div className="dropdown-content" ref={dropdownRef}>
          <div className="upper">
            <div
              className="wrapper"
              onClick={() => {
                downloadExcel(
                  data,
                  filename,
                  language,
                  unit,
                  year,
                  isMonth,
                  resource,
                  isFilter,
                  isTreeMap,
                  isSankey,
                  isConditioning,
                  isFiltered,
                  twoFixed
                );
              }}>
              <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.83301 3.71509H16.0003V7.443H9.83301V3.71509Z"
                  fill="#21A365"
                />
                <path
                  d="M9.83301 7.44312H16.0003V11.171H9.83301V7.44312Z"
                  fill="#107C41"
                />
                <path
                  d="M3.67773 3.71509H9.83254V7.443H3.67773V3.71509Z"
                  fill="#107C41"
                />
                <path
                  d="M9.83273 11.171V7.44312H3.69043V11.171V11.7089V14.1609C3.69043 14.5612 4.01568 14.8864 4.416 14.8864H15.262C15.6623 14.8864 15.9875 14.5612 15.9875 14.1609V11.171H9.83273Z"
                  fill="#185B37"
                />
                <path
                  d="M15.2621 0H9.82031V3.72791H16.0001V0.725567C15.9876 0.325254 15.6624 0 15.2621 0Z"
                  fill="#33C481"
                />
                <path
                  d="M9.83291 0H4.42869C4.02838 0 3.70312 0.325254 3.70312 0.725567V3.7154H9.84542V0H9.83291Z"
                  fill="#21A365"
                />
                <path
                  d="M7.43081 11.509H0.800626C0.362783 11.509 0 11.1463 0 10.7084V4.17831C0 3.74047 0.362783 3.37769 0.800626 3.37769H7.43081C7.86865 3.37769 8.23143 3.74047 8.23143 4.17831V10.7084C8.23143 11.1463 7.88116 11.509 7.43081 11.509Z"
                  fill="#17864C"
                />
                <path
                  d="M5.05372 9.74492L4.56584 8.85672C4.36568 8.50645 4.24059 8.26876 4.10298 8.00606H4.09047C3.97788 8.26876 3.86529 8.50645 3.67765 8.85672L3.23981 9.74492H2.28906L3.64012 7.48065L2.32659 5.25391H3.28984L3.77773 6.17963C3.92784 6.45484 4.04043 6.68002 4.15302 6.93022H4.17804C4.30314 6.655 4.3907 6.45484 4.54082 6.17963L5.0287 5.25391H5.97945L4.6409 7.44312L6.02948 9.74492H5.05372Z"
                  fill="white"
                />
                <path
                  opacity="0.2"
                  d="M8.33109 4.10327V4.17833V10.7084C8.33109 11.1463 7.9683 11.5091 7.53046 11.5091H3.79004V12.2221H8.19348C8.63132 12.2221 8.9941 11.8593 8.9941 11.4215V4.89139C9.00661 4.49107 8.70638 4.15331 8.33109 4.10327Z"
                  fill="black"
                />
              </svg>
              <p>Excel</p>
            </div>
            <div
              className="wrapper"
              onClick={() => {
                downloadPDF(
                  data,
                  filename,
                  language,
                  unit,
                  year,
                  isMonth,
                  resource,
                  isFilter,
                  isTreeMap,
                  isSankey,
                  isConditioning,
                  isFiltered,
                  twoFixed
                );
              }}>
              <svg
                width="16"
                height="18"
                viewBox="0 0 16 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.0743 0H10.8773L15.9998 5.12344V14.962C15.9998 16.1567 15.0225 17.1349 13.8269 17.1349H5.07433C3.87964 17.1349 2.90234 16.1567 2.90234 14.962V2.17296C2.90234 0.978263 3.87964 0 5.0743 0Z"
                  fill="#E5252A"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.8779 0L16.0004 5.12344H11.4302C11.1257 5.12344 10.8779 4.87472 10.8779 4.57017V0Z"
                  fill="#B71D21"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.4769 7.29639H12.2778C12.5403 7.29639 12.7547 7.51084 12.7547 7.77329V12.1025C12.7547 12.365 12.5403 12.5794 12.2778 12.5794H0.4769C0.214454 12.5794 0 12.365 0 12.1025V7.77329C0 7.51084 0.214488 7.29639 0.4769 7.29639Z"
                  fill="#B71D21"
                />
              </svg>
              <p>PDF</p>
            </div>
          </div>
          <div className="divider"></div>
          <div className="lower">
            <div className="wrapper" onClick={downloadJPG}>
              <svg
                width="16"
                height="19"
                viewBox="0 0 16 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.64726 0H2.82682C2.17012 0 1.63477 0.535356 1.63477 1.19563V17.0814C1.63477 17.7417 2.17012 18.2735 2.83039 18.277H14.8045C15.4648 18.277 15.9966 17.7417 16.0001 17.0814L15.9645 5.28218L9.64726 0Z"
                  fill="#4EB3F2"
                />
                <path
                  d="M9.64675 0L9.62891 5.15726C9.62891 5.15726 9.64675 5.28218 9.75382 5.28218H15.964L9.64675 0Z"
                  fill="#0077CC"
                />
                <path
                  d="M0.485389 8.80444H12.5345C12.8021 8.80444 13.0199 9.02215 13.0199 9.28983V14.6719C13.0199 14.9396 12.8021 15.1573 12.5345 15.1573H0.485389C0.217711 15.1573 0 14.9396 0 14.6719V9.28983C0 9.02215 0.217711 8.80444 0.485389 8.80444Z"
                  fill="#0077CC"
                />
                <path
                  d="M3.8225 10.675H4.65051V12.1276C4.65051 12.431 4.62196 12.6666 4.56843 12.8236C4.50775 12.9914 4.39354 13.1341 4.24364 13.2269C4.07947 13.3376 3.87246 13.3911 3.61549 13.3911C3.34425 13.3911 3.13724 13.3554 2.98734 13.2804C2.84458 13.2091 2.72323 13.0984 2.64471 12.9592C2.55906 12.7986 2.50909 12.6202 2.50195 12.4382L3.29071 12.3311C3.28714 12.4203 3.29785 12.5095 3.32283 12.5952C3.34068 12.6487 3.37637 12.6987 3.42277 12.7344C3.46202 12.7594 3.50842 12.7736 3.55839 12.7701C3.64048 12.7772 3.719 12.7344 3.76182 12.6666C3.80465 12.5988 3.82607 12.481 3.82607 12.3204L3.8225 10.675Z"
                  fill="white"
                />
                <path
                  d="M5.19727 10.675H6.57135C6.87114 10.675 7.09599 10.7464 7.24233 10.8892C7.39222 11.032 7.46717 11.2354 7.46717 11.4959C7.46717 11.7672 7.38509 11.9777 7.22448 12.1276C7.06387 12.2775 6.81404 12.3561 6.48212 12.3561H6.02885V13.3483H5.20083V10.675H5.19727ZM6.02885 11.8171H6.23229C6.39289 11.8171 6.50353 11.7886 6.56778 11.7351C6.63202 11.6815 6.66771 11.603 6.66414 11.5209C6.66771 11.4424 6.63559 11.3639 6.57848 11.3068C6.52138 11.2497 6.41788 11.2175 6.26441 11.2175H6.02885V11.8171Z"
                  fill="white"
                />
                <path
                  d="M9.24034 12.3812V11.8244H10.5181V12.9629C10.2754 13.1307 10.0576 13.2413 9.86849 13.302C9.65078 13.3662 9.42593 13.3983 9.20108 13.3912C8.88344 13.3912 8.62646 13.3377 8.4266 13.2306C8.22673 13.1199 8.06256 12.9522 7.96262 12.7488C7.84841 12.5203 7.79131 12.2669 7.79845 12.0135C7.79845 11.7209 7.85912 11.4675 7.9769 11.2533C8.09825 11.0392 8.28384 10.8643 8.50512 10.7608C8.68714 10.6752 8.92983 10.6323 9.23677 10.6323C9.533 10.6323 9.75428 10.6609 9.90061 10.7108C10.0434 10.7608 10.1683 10.8465 10.2647 10.9607C10.3682 11.0856 10.4431 11.2319 10.4824 11.389L9.68647 11.5317C9.65792 11.4389 9.60081 11.3568 9.51872 11.2997C9.4295 11.2426 9.326 11.2141 9.21893 11.2212C9.05475 11.2141 8.89414 11.2855 8.78707 11.4104C8.68 11.5353 8.62647 11.7352 8.62647 12.0064C8.62647 12.2955 8.68 12.5025 8.79064 12.6274C8.89771 12.7523 9.05118 12.813 9.24748 12.813C9.3367 12.813 9.42593 12.7987 9.51159 12.7737C9.61152 12.7381 9.70788 12.6917 9.80068 12.6381V12.3883L9.24034 12.3812Z"
                  fill="white"
                />
              </svg>
              <p>JPG</p>
            </div>
            <div className="wrapper" onClick={downloadPNG}>
              <svg
                width="16"
                height="18"
                viewBox="0 0 16 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.07433 0H10.8764L15.9998 5.12345V14.962C15.9998 16.1567 15.0216 17.135 13.8269 17.135H5.07433C3.87963 17.135 2.90137 16.1567 2.90137 14.962V2.17296C2.90137 0.978265 3.87967 0 5.07433 0Z"
                  fill="#0AC963"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.876 0L15.9994 5.12345H11.4292C11.1247 5.12345 10.876 4.87473 10.876 4.57018V0Z"
                  fill="#08A14F"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.476901 7.29639H12.2779C12.5393 7.29639 12.7548 7.51084 12.7548 7.77329V12.1025C12.7548 12.365 12.5393 12.5794 12.2779 12.5794H0.476901C0.214455 12.5794 3.91584e-09 12.365 3.91584e-09 12.1025V7.77329C-3.34628e-05 7.51084 0.214455 7.29639 0.476901 7.29639Z"
                  fill="#08A14F"
                />
              </svg>
              <p>PNG</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Download;
