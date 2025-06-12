const todayTemp = document.querySelector(".today-temp");
const tempUnit = document.querySelectorAll(".temp-unit");
const bigIcon = document.querySelector(".icon-big");
const clouds = document.querySelector(".today-clouds");

const wind = document.querySelector(".wind");
const windUnit = document.querySelector(".wind-unit");
const humidity = document.querySelector(".humidity");
const humidityUnit = document.querySelector(".humidity-unit");
const pressure = document.querySelector(".pressure");
const pressureUnit = document.querySelector(".pressure-unit");

const weatherData = {};
const weatherUnits = {};

const getWeatherData = async function () {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=44.82&longitude=20.68&daily=temperature_2m_max,temperature_2m_min&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m,surface_pressure,cloud_cover&wind_speed_unit=ms"
    );
    if (!res.ok) {
      throw new Error("HTTP Error");
    }
    const data = await res.json();
    console.log(data);
    weatherData.rain = data.current.rain;
    weatherData.humidity = data.current.relative_humidity_2m;
    weatherData.pressure = data.current.surface_pressure;
    weatherData.wind = data.current.wind_speed_10m;
    weatherData.temperature = data.current.temperature_2m;
    weatherData.clouds = data.current.cloud_cover;

    weatherUnits.humidityUnit = data.current_units.relative_humidity_2m;
    weatherUnits.pressureUnit = data.current_units.surface_pressure;
    weatherUnits.windUnit = data.current_units.wind_speed_10m;
    weatherUnits.tempUnit = data.current_units.temperature_2m;

    fillWidget();
  } catch (err) {
    console.error(err);
  }
};

const fillWidget = function () {
  todayTemp.firstChild.nodeValue = weatherData.temperature;
  tempUnit.forEach((unit) => {
    unit.textContent = weatherUnits.tempUnit;
  });
  wind.firstChild.nodeValue = weatherData.wind;
  windUnit.textContent = weatherUnits.windUnit;
  humidity.firstChild.nodeValue = weatherData.humidity;
  humidityUnit.textContent = weatherUnits.humidity;
};

getWeatherData();
console.log(weatherData);
console.log(weatherUnits);
