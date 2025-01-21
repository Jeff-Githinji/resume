const apiKey = "d7a8716a7644007310a02fa8016964f3";
const cityInput = document.getElementById("city-input");
const getWeatherButton = document.getElementById("get-weather");
const weatherInfo = document.getElementById("weather-info");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const errorMessage = document.getElementById("error-message");
const loader = document.getElementById("loader");
const weatherIcon = document.getElementById("weather-icon");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");

getWeatherButton.addEventListener("click", async () => {
  const city = cityInput.value.trim();

  if (city === "") {
    errorMessage.textContent = "Please enter a city name.";
    weatherInfo.style.display = "none";
    return;
  }

  errorMessage.textContent = "";
  loader.style.display = "block";
  weatherInfo.style.display = "none";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    const tempC = data.main.temp;
    const tempF = (tempC * 9/5) + 32;

    cityName.textContent = `Weather in ${data.name}, ${data.sys.country}`;
    temperature.textContent = `${tempC.toFixed(1)}°C / ${tempF.toFixed(1)}°F`;
    description.textContent = data.weather[0].description;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind: ${data.wind.speed} m/s`;
    
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherInfo.style.display = "block";
  } catch (error) {
    errorMessage.textContent = "City not found. Please try again.";
    weatherInfo.style.display = "none";
  } finally {
    loader.style.display = "none";
    cityInput.value = "";
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeatherButton.click();
  }
});