import { useParams } from "react-router-dom";

const InfoContent = ({ text }) => {
  const { language } = useParams();

  return (
    <div className="info-content">
      <p>{text[language]} </p>
    </div>
  );
};

export default InfoContent;
