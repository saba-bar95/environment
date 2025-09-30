const Svg3 = ({ className, text = "მ²", textClassName = "svg-text" }) => {
  return (
    <svg
      className={className}
      width="34"
      height="40"
      viewBox="0 0 34 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M33 6.42188V17.6172C33 27.2253 26.2203 36.1144 17 38.9541C7.78032 36.1141 1 27.2008 1 17.6172V6.42188L17 1.05469L33 6.42188Z"
        stroke="white"
        strokeWidth="2"
      />
      <text
        x="17" // Center horizontally (34 / 2)
        y="20" // Center vertically (40 / 2)
        textAnchor="middle" // Horizontally center the text
        dominantBaseline="middle" // Vertically center the text
        className={textClassName} // Apply custom text styling
      >
        {text}
      </text>
    </svg>
  );
};

export default Svg3;
