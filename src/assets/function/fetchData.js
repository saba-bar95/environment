import backendURL from "./backendURL";

const fetchData = async (id, type, lang) => {
  try {
    const url =
      lang === "en"
        ? `${backendURL}/api/datasets/${id}/${type}?lang=en`
        : `${backendURL}/api/datasets/${id}/${type}`;
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

export default fetchData;
