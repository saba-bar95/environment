export default function LinkedInSvg() {
  return (
    <svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() =>
        window.open(
          "https://ge.linkedin.com/company/national-statistics-office-of-georgia",
          "_blank"
        )
      } // Attach onClick directly
      style={{ cursor: "pointer" }} // Add pointer cursor for better UX
      role="button" // Improve accessibility
      tabIndex={0} // Make it focusable for keyboard navigation
      aria-label="Open LinkedIn" // Accessibility for screen readers
    >
      <path
        d="M0.3 6H4.05V18H0.3V6ZM2.175 0C3.375 0 4.35 0.975 4.35 2.175C4.35 3.375 3.375 4.35 2.175 4.35C0.975 4.35 0 3.375 0 2.175C0 0.975 0.975 0 2.175 0Z"
        fill="#A0A0A0"
      />
      <path
        d="M6.375 6.0002H9.975V7.6502H10.05C10.575 6.6752 11.775 5.7002 13.575 5.7002C17.325 5.7002 18.075 8.1752 18.075 11.4002V18.0002H14.325V12.1502C14.325 10.7252 14.325 8.9252 12.375 8.9252C10.425 8.9252 10.125 10.4252 10.125 12.0002V18.0002H6.375V6.0002Z"
        fill="#A0A0A0"
      />
    </svg>
  );
}
