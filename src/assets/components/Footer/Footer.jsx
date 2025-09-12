import { useParams } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
  const { language } = useParams();

  return (
    <footer>
      <h1>
        {language === "en"
          ? "All rights reserved © Geostat 2025"
          : "ყველა უფლება დაცულია © საქსტატი 2025"}
      </h1>
    </footer>
  );
};

export default Footer;
