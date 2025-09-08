export default function XSvg() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => window.open("https://x.com/Geostat100", "_blank")} // Attach onClick directly
      style={{ cursor: "pointer" }} // Add pointer cursor for better UX
      role="button" // Improve accessibility
      tabIndex={0} // Make it focusable for keyboard navigation
      aria-label="Open X" // Accessibility for screen readers
    >
      <path
        d="M10.5 7.65L17.025 0H15.45L9.75 6.6L5.25 0H0L6.9 9.975L0 18H1.575L7.575 11.025L12.375 18H17.625L10.5 7.65ZM8.325 10.125L7.65 9.15L2.1 1.2H4.5L9 7.575L9.675 8.55L15.525 16.875H13.125L8.325 10.125Z"
        fill="#A0A0A0"
      />
    </svg>
  );
}
