export default function FacebookSvg() {
  return (
    <svg
      width="10"
      height="18"
      viewBox="0 0 10 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() =>
        window.open("https://www.facebook.com/geostat.ge/", "_blank")
      } // Attach onClick directly
      style={{ cursor: "pointer" }} // Add pointer cursor for better UX
      role="button" // Improve accessibility
      tabIndex={0} // Make it focusable for keyboard navigation
      aria-label="Open Facebook" // Accessibility for screen readers
    >
      <path
        d="M6.375 18V10.125H9L9.525 6.9H6.375V4.725C6.375 3.825 6.825 3 8.25 3H9.675V0.225C9.675 0.225 8.4 0 7.125 0C4.575 0 2.85 1.575 2.85 4.35V6.825H0V10.05H2.85V18H6.375Z"
        fill="#A0A0A0"
      />
    </svg>
  );
}
