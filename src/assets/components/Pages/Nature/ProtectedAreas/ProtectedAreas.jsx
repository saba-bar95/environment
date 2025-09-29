import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import GeoMapContainer from "./GeoMapContainer";

const ProtectedAreas = () => {
  const { language } = useParams();

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en"
            ? "Protected Areas of Georgia"
            : "საქართველოს დაცული ტერიტორიები"}
        </h1>
        <h2>
          {" "}
          {language === "en"
            ? "Discover Georgia's growing network of national parks, reserves, and protected landscapes"
            : "აღმოაჩინეთ საქართველოს ეროვნული პარკების, ნაკრძალებისა და დაცული ლანდშაფტების მზარდი ქსელი"}{" "}
        </h2>
      </div>
      <div className="charts-section">
        <GeoMapContainer />
      </div>
    </div>
  );
};

export default ProtectedAreas;
