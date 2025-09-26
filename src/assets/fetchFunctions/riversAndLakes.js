import backendURL from "./backendURL";

const riversAndLakes = async (id, lang) => {
  try {
    const url =
      lang === "en"
        ? `${backendURL}/api/${id}/?lang=en`
        : `${backendURL}/api/${id}`;
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

export default riversAndLakes;
