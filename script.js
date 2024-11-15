// Get references to elements
const showTemperatureBtn = document.getElementById("showTemperature");
const showConditionBtn = document.getElementById("showCondition");
const getWeatherBtn = document.getElementById("getWeather");
const cityInput = document.getElementById("city");
const temperatureSection = document.getElementById("temperatureSection");
const conditionSection = document.getElementById("conditionSection");
const errorDiv = document.getElementById("error");

// Enable navigation buttons only after valid weather data is fetched
getWeatherBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (!city) {
    errorDiv.textContent = "Please enter a valid location.";
    errorDiv.classList.remove("hidden");
    return;
  }

  try {
    errorDiv.classList.add("hidden");

    // Fetch location data
    const apiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;
    const locationResponse = await fetch(apiUrl);
    const locationData = await locationResponse.json();

    if (!locationData.results || locationData.results.length === 0) {
      throw new Error("Location not found.");
    }

    const { latitude, longitude, name } = locationData.results[0];

    // Fetch weather data
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (!weatherData.current_weather) {
      throw new Error("Weather data not available.");
    }

    // Update DOM with fetched data
    document.getElementById("locationTemp").textContent = name;
    document.getElementById("locationCond").textContent = name;
    document.getElementById("temperature").textContent = weatherData.current_weather.temperature;
    document.getElementById("condition").textContent = weatherData.current_weather.weathercode;

    // Enable navigation buttons
    showTemperatureBtn.disabled = false;
    showConditionBtn.disabled = false;

    // Show temperature by default
    showTemperatureBtn.click();

  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.classList.remove("hidden");
  }
});

// Highlight active button and toggle sections
function setActiveButton(activeBtn, inactiveBtn) {
  activeBtn.classList.add("active");
  inactiveBtn.classList.remove("active");
}

showTemperatureBtn.addEventListener("click", () => {
  setActiveButton(showTemperatureBtn, showConditionBtn);
  temperatureSection.classList.remove("hidden");
  conditionSection.classList.add("hidden");
});

showConditionBtn.addEventListener("click", () => {
  setActiveButton(showConditionBtn, showTemperatureBtn);
  conditionSection.classList.remove("hidden");
  temperatureSection.classList.add("hidden");
});
