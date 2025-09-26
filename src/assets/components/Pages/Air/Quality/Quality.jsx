import { useParams } from "react-router-dom";
import cities from "./cities";
import "./Quality.scss";
import citiesAirQuality from "../../../../fetchFunctions/citiesAirQuality";
import { useState, useEffect } from "react";

const Quality = () => {
  const { language } = useParams();
  const [airQualityData, setAirQualityData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch air quality data for each city
        const promises = cities.map((city) => citiesAirQuality(city.name_en));
        const results = await Promise.all(promises);

        // Create an object to store air quality data by city name
        const dataByCity = cities.reduce((acc, city, index) => {
          acc[city.name_en] = results[index];
          return acc;
        }, {});

        setAirQualityData(dataByCity);
      } catch (error) {
        console.error("Error fetching air quality data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to map qualityLevel to a color
  const getQualityColor = (level) => {
    const colors = {
      good: "#307752", // Green
      fair: "#ddca21ff", // Yellow
      moderate: "#ff9800", // Orange
      poor: "#ED4C5C", // Red
      very_poor: "#9c27b0", // Purple
      unknown: "#757575", // Gray
    };
    return colors[level] || "#757575"; // Default to gray for unknown
  };

  return (
    <div className="quality-container">
      <div className="quality-wrapper">
        {cities.map((el, i) => (
          <div className="city" key={i}>
            <div
              className="top"
              style={{ backgroundImage: `url(${el.background})` }}></div>
            <div className="bottom">
              <div className="right">
                <h2>{el[`name_${language}`]}</h2>
                <p>{language === "ge" ? "მიმდინარე" : "current"} PM2.5 </p>
              </div>
              <div
                className="left"
                style={{
                  color: getQualityColor(
                    airQualityData[el.name_en]?.data?.average?.qualityLevel
                  ),
                }}>
                <h2>
                  {airQualityData[el.name_en]
                    ? airQualityData[el.name_en].data.average.value || "N/A"
                    : ""}
                </h2>
                <p>
                  {" "}
                  {language === "en"
                    ? airQualityData[el.name_en]?.data?.average?.unit || "N/A"
                    : "მკგ/მ3"}{" "}
                </p>
              </div>
            </div>
            <div className="update">
              <p>
                {language === "en" ? "Last updated" : "ბოლოს განახლდა"}:{" "}
                <span style={{ marginRight: "3px" }}>
                  {airQualityData[el.name_en]?.data?.dataFreshness
                    ?.oldestDataAgeMinutes || "N/A"}
                </span>
                {language === "en" ? "minutes ago" : "წუთის წინ"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quality;
