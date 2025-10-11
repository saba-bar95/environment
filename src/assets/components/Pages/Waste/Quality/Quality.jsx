import { useParams } from "react-router-dom";
import cities from "./cities";
import "./Quality.scss";

const Quality = () => {
  const { language } = useParams();

  // Function to map qualityLevel to a color

  return (
    <div className="quality-container-waste">
      <div className="quality-wrapper">
        {cities.map((el, i) => (
          <div
            className="city"
            key={i}
            style={{ backgroundColor: el.color, color: "#ffffff" }}>
            <div className="bottom">
              <div className="right">
                <h2>
                  <span>
                    {el[`unit_${language}`] && el[`unit_${language}`]}
                  </span>
                  {el[`name_${language}`]}
                </h2>
                <h1>{el.num}</h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quality;
