const UpVector = () => {
  return (
    <svg
      className="up-vector"
      width="15"
      height="8" // Increase height slightly to accommodate rectangle
      viewBox="0 0 15 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="6" width="15" height="2" fill="white" />{" "}
      {/* Background rectangle */}
      <path d="M7.5 0L14.8612 6.75H0.138784L7.5 0Z" fill="white" />
    </svg>
  );
};

export default UpVector;
