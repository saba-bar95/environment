import FacebookSvg from "./Svgs/FacebookSvg";
import LinkedInSvg from "./Svgs/LinkedInSvg";
import XSvg from "./Svgs/XSvg";
import "./Socials.scss";

const Socials = () => {
  return (
    <div className="icons">
      <FacebookSvg />
      <XSvg />
      <LinkedInSvg />
    </div>
  );
};

export default Socials;
