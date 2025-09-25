import backendURL from "./backendURL";

const fetchCitiesAirQuality = async (id) => {
  try {
    const url = `${backendURL}/api/air-quality/${id}/pm25-average`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default fetchCitiesAirQuality;
