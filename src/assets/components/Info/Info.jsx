import { useState } from "react";
import "./Info.scss";
import Frame from "./Svgs/Frame";
import Text from "./Svgs/Text";
import InfoContent from "./InfoContent";

const Info = ({ text }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="info-container"
      style={{ position: "relative" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <Frame />
      <Text />
      {isHovered && <InfoContent text={text} />}
    </div>
  );
};

export default Info;
