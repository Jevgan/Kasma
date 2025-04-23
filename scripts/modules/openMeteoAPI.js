

export const fetchWeather = async (parameters) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?${Object.entries(parameters)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")}`;
    
    const response = await fetch(`${url}`
    );
    
    if (!response.ok) {
      throw new Error("Respone was not ok in fetchWeather function");
    }
    
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};
